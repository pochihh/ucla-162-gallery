#!/usr/bin/env node
/**
 * Appends newly discovered repos from scouting-repos.json into repos.json.
 *
 * Run after reviewing scouting-repos.json:
 *   npm run promote-scouted
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')
const configPath = join(root, 'repos.json')
const scoutingPath = join(root, 'scouting-repos.json')

function normalizeEntry(entry) {
  return typeof entry === 'string' ? { repo: entry } : entry
}

const config = JSON.parse(readFileSync(configPath, 'utf8'))
const scouting = JSON.parse(readFileSync(scoutingPath, 'utf8'))

const currentRepos = Array.isArray(config.repos)
  ? config.repos.map(normalizeEntry)
  : (config.featured_repos || []).map((entry) => ({
      ...normalizeEntry(entry),
      featured: true,
    }))

const knownRepos = new Set(currentRepos.map(({ repo }) => repo))
const newRepos = (scouting.new_repos || []).filter(({ repo }) => !knownRepos.has(repo))

if (newRepos.length === 0) {
  console.log('No new scouted repos to promote.')
  process.exit(0)
}

config.repos = [
  ...currentRepos,
  ...newRepos.map(({ repo }) => ({ repo, ranking: null })),
]
delete config.featured_repos

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8')

console.log(`Promoted ${newRepos.length} repos into repos.json:`)
for (const { repo } of newRepos) {
  console.log(`  - ${repo}`)
}
