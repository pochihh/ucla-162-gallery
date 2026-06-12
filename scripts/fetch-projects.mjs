#!/usr/bin/env node
/**
 * Scans forks of the source repo, reads each fork's manifest.json and README,
 * caches thumbnails/manifests locally, and writes public/data/projects.json.
 *
 * Run locally before deploy:
 *   npm run fetch-projects
 */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { extname, join } from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')

const COURSE = 'MAE 162D/E'
const MANIFEST_SCHEMA_VERSION = 1
const DEFAULT_CONFIG = {
  source_repo: 'pochihh/Project-NUEVO',
  include_source_repo: false,
}

const token = process.env.GITHUB_TOKEN
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
}

const rawHeaders = token ? { Authorization: `Bearer ${token}` } : {}

function readConfig() {
  const configPath = join(root, 'repos.json')
  const parsed = JSON.parse(readFileSync(configPath, 'utf8'))

  if (Array.isArray(parsed)) {
    return {
      ...DEFAULT_CONFIG,
      repos: parsed,
    }
  }

  return {
    ...DEFAULT_CONFIG,
    ...parsed,
  }
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

async function fetchText(url) {
  const res = await fetch(url, { headers: rawHeaders })
  if (!res.ok) return null
  return res.text()
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: rawHeaders })
  if (!res.ok) return null
  return {
    buffer: Buffer.from(await res.arrayBuffer()),
    contentType: res.headers.get('content-type') || '',
  }
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function slugifySection(value) {
  return String(value)
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function rawRepoUrl(repo, branch, filePath) {
  const encodedPath = filePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

  return `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(branch)}/${encodedPath}`
}

function extensionFor(filePath, contentType) {
  const ext = extname(filePath).toLowerCase()
  if (ext) return ext

  if (contentType.includes('png')) return '.png'
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg'
  if (contentType.includes('webp')) return '.webp'
  if (contentType.includes('gif')) return '.gif'

  return '.jpg'
}

function validateManifest(manifest, repo) {
  const errors = []

  if (manifest.schema_version !== MANIFEST_SCHEMA_VERSION) {
    errors.push(`schema_version must be ${MANIFEST_SCHEMA_VERSION}`)
  }

  if (manifest.course !== COURSE) {
    errors.push(`course must be "${COURSE}"`)
  }

  if (!Number.isInteger(manifest.year)) {
    errors.push('year must be an integer')
  }

  if (typeof manifest.section !== 'string' || !manifest.section.trim()) {
    errors.push('section must be a non-empty string')
  }

  if (!Number.isInteger(manifest.group)) {
    errors.push('group must be an integer')
  }

  if (typeof manifest.title !== 'string' || !manifest.title.trim()) {
    errors.push('title must be a non-empty string')
  }

  if (
    !Array.isArray(manifest.authors) ||
    manifest.authors.length === 0 ||
    manifest.authors.some((author) => typeof author !== 'string' || !author.trim())
  ) {
    errors.push('authors must be a non-empty array of strings')
  }

  if (typeof manifest.summary !== 'string' || !manifest.summary.trim()) {
    errors.push('summary must be a non-empty string')
  }

  if (typeof manifest.thumbnail !== 'string' || !manifest.thumbnail.trim()) {
    errors.push('thumbnail must be a non-empty repo-relative path')
  } else if (
    manifest.thumbnail.startsWith('/') ||
    manifest.thumbnail.includes('://') ||
    manifest.thumbnail.split('/').includes('..')
  ) {
    errors.push('thumbnail must be relative to the repo root')
  }

  if (
    manifest.keywords != null &&
    (!Array.isArray(manifest.keywords) ||
      manifest.keywords.some((keyword) => typeof keyword !== 'string' || !keyword.trim()))
  ) {
    errors.push('keywords must be an array of strings when provided')
  }

  if (errors.length > 0) {
    console.warn(`  - Skipping ${repo}: invalid manifest`)
    for (const error of errors) console.warn(`    - ${error}`)
    return null
  }

  return {
    schema_version: MANIFEST_SCHEMA_VERSION,
    course: COURSE,
    year: manifest.year,
    section: manifest.section.trim(),
    group: manifest.group,
    title: manifest.title.trim(),
    authors: manifest.authors.map((author) => author.trim()),
    summary: manifest.summary.trim(),
    thumbnail: manifest.thumbnail.trim(),
    keywords: (manifest.keywords || []).map((keyword) => keyword.trim()),
  }
}

async function listForkRepos(sourceRepo, includeSourceRepo) {
  const forks = []
  let page = 1

  while (true) {
    const batch = await fetchJSON(
      `https://api.github.com/repos/${sourceRepo}/forks?per_page=100&page=${page}&sort=newest`
    )

    forks.push(...batch)
    if (batch.length < 100) break
    page += 1
  }

  if (includeSourceRepo) {
    const source = await fetchJSON(`https://api.github.com/repos/${sourceRepo}`)
    return [source, ...forks]
  }

  return forks
}

async function getRepos(config) {
  if (config.repos) {
    const repos = await Promise.all(
      config.repos.map(async ({ repo }, index) => {
        const repoData = await fetchJSON(`https://api.github.com/repos/${repo}`)
        repoData.__featured = true
        repoData.__sourceOrder = index
        return repoData
      })
    )
    return repos
  }

  const featuredRepos = await Promise.all(
    (config.featured_repos || []).map(async ({ repo }, index) => {
      const repoData = await fetchJSON(`https://api.github.com/repos/${repo}`)
      repoData.__featured = true
      repoData.__sourceOrder = index
      return repoData
    })
  )

  const forkRepos = await listForkRepos(config.source_repo, config.include_source_repo)
  forkRepos.forEach((repoData, index) => {
    repoData.__featured = false
    repoData.__sourceOrder = featuredRepos.length + index
  })

  const byRepo = new Map()
  for (const repoData of [...featuredRepos, ...forkRepos]) {
    if (!byRepo.has(repoData.full_name)) byRepo.set(repoData.full_name, repoData)
  }

  return [...byRepo.values()]
}

async function fetchReadme(repo) {
  try {
    const readmeData = await fetchJSON(`https://api.github.com/repos/${repo}/readme`)
    return readmeData?.content
      ? Buffer.from(readmeData.content, 'base64').toString('utf8')
      : ''
  } catch {
    return ''
  }
}

async function processRepo(repoData, outputDirs) {
  const repo = repoData.full_name
  const repoName = repoData.name
  const defaultBranch = repoData.default_branch || 'main'

  console.log(`Fetching ${repo}...`)

  const manifestRaw = await fetchText(rawRepoUrl(repo, defaultBranch, 'manifest.json'))
  if (!manifestRaw) {
    console.warn(`  - Skipping ${repo}: manifest.json not found`)
    return null
  }

  let parsedManifest
  try {
    parsedManifest = JSON.parse(manifestRaw)
  } catch (error) {
    console.warn(`  - Skipping ${repo}: manifest.json is not valid JSON (${error.message})`)
    return null
  }

  const manifest = validateManifest(parsedManifest, repo)
  if (!manifest) return null

  const slug = `${slugifySection(manifest.section)}-group${manifest.group}-${slugify(repoName)}`
  const readme = await fetchReadme(repo)
  const thumbnailUrl = rawRepoUrl(repo, defaultBranch, manifest.thumbnail)
  const thumbnail = await fetchBuffer(thumbnailUrl)

  if (!thumbnail) {
    console.warn(`  - Skipping ${repo}: thumbnail not found at ${manifest.thumbnail}`)
    return null
  }

  const thumbnailExt = extensionFor(manifest.thumbnail, thumbnail.contentType)
  const thumbnailPath = `data/thumbnails/${slug}${thumbnailExt}`
  const manifestPath = `data/manifests/${slug}.json`

  writeFileSync(join(outputDirs.thumbnails, `${slug}${thumbnailExt}`), thumbnail.buffer)
  writeFileSync(
    join(outputDirs.manifests, `${slug}.json`),
    JSON.stringify(manifest, null, 2),
    'utf8'
  )

  return {
    repo,
    repo_url: repoData.html_url || `https://github.com/${repo}`,
    default_branch: defaultBranch,
    stars: Number(repoData.stargazers_count || 0),
    featured: Boolean(repoData.__featured),
    slug,
    schema_version: manifest.schema_version,
    course: manifest.course,
    year: manifest.year,
    section: manifest.section,
    group: manifest.group,
    title: manifest.title,
    authors: manifest.authors,
    summary: manifest.summary,
    thumbnail: thumbnailPath,
    thumbnail_repo_path: manifest.thumbnail,
    keywords: manifest.keywords,
    manifest: manifestPath,
    readme,
    updated_at: repoData.updated_at || new Date().toISOString(),
  }
}

function resetOutputDirs() {
  const dataDir = join(root, 'public/data')
  const manifests = join(dataDir, 'manifests')
  const thumbnails = join(dataDir, 'thumbnails')

  mkdirSync(dataDir, { recursive: true })
  rmSync(manifests, { recursive: true, force: true })
  rmSync(thumbnails, { recursive: true, force: true })
  mkdirSync(manifests, { recursive: true })
  mkdirSync(thumbnails, { recursive: true })

  return { dataDir, manifests, thumbnails }
}

const config = readConfig()
const outputDirs = resetOutputDirs()
const repos = await getRepos(config)
const results = await Promise.all(repos.map((repo) => processRepo(repo, outputDirs)))
const projects = results
  .filter(Boolean)
  .sort((a, b) =>
    Number(b.featured) - Number(a.featured) ||
    a.section.localeCompare(b.section) ||
    a.group - b.group ||
    a.title.localeCompare(b.title)
  )

writeFileSync(
  join(outputDirs.dataDir, 'projects.json'),
  JSON.stringify(projects, null, 2),
  'utf8'
)

console.log(`\nWrote ${projects.length} projects to public/data/projects.json`)
