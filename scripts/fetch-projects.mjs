#!/usr/bin/env node
/**
 * Fetches project data from GitHub for each repo in repos.json.
 * Writes the combined result to public/data/projects.json.
 *
 * Requires GITHUB_TOKEN env var for authenticated requests (5000 req/hr).
 * Run manually: node scripts/fetch-projects.mjs
 * Run by CI:    see .github/workflows/fetch-data.yml
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')

const token = process.env.GITHUB_TOKEN
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
}

const repos = JSON.parse(readFileSync(join(root, 'repos.json'), 'utf8'))

async function fetchJSON(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

async function fetchText(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) return null
  return res.text()
}

async function processRepo({ repo, year }) {
  const [owner, name] = repo.split('/')
  const slug = name

  console.log(`Fetching ${repo}…`)

  let repoData, contributors, manifestRaw, readmeData
  try {
    ;[repoData, contributors] = await Promise.all([
      fetchJSON(`https://api.github.com/repos/${repo}`),
      fetchJSON(`https://api.github.com/repos/${repo}/contributors?per_page=10`),
    ])
  } catch (e) {
    console.warn(`  ✗ Repo API failed: ${e.message}`)
    return null
  }

  try {
    const manifestUrl = `https://raw.githubusercontent.com/${repo}/${repoData.default_branch}/manifest.json`
    manifestRaw = await fetchText(manifestUrl)
  } catch {
    manifestRaw = null
  }

  try {
    readmeData = await fetchJSON(`https://api.github.com/repos/${repo}/readme`)
  } catch {
    readmeData = null
  }

  const manifest = manifestRaw ? JSON.parse(manifestRaw) : {}
  const defaultBranch = repoData.default_branch || 'main'

  const thumbnail = manifest.thumbnail
    ? `https://raw.githubusercontent.com/${repo}/${defaultBranch}/${manifest.thumbnail}`
    : ''

  const readme = readmeData?.content
    ? Buffer.from(readmeData.content, 'base64').toString('utf8')
    : ''

  return {
    repo,
    slug,
    year,
    title: manifest.title || repoData.name,
    authors: manifest.authors || [],
    thumbnail,
    keywords: manifest.keywords || [],
    summary: manifest.summary || repoData.description || '',
    demo_url: manifest.demo_url || '',
    video_url: manifest.video_url || '',
    stars: repoData.stargazers_count || 0,
    contributors: (contributors || []).map((c) => ({
      login: c.login,
      avatar_url: c.avatar_url,
      html_url: c.html_url,
    })),
    readme,
    updated_at: repoData.updated_at || new Date().toISOString(),
  }
}

const results = await Promise.all(repos.map(processRepo))
const projects = results.filter(Boolean)

mkdirSync(join(root, 'public/data'), { recursive: true })
writeFileSync(
  join(root, 'public/data/projects.json'),
  JSON.stringify(projects, null, 2),
  'utf8'
)

console.log(`\n✓ Wrote ${projects.length} projects to public/data/projects.json`)
