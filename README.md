# UCLA MAE 162D/E Gallery

Static project gallery for UCLA MAE 162D/E capstone projects.

The gallery is built locally from cached GitHub repository data. The normal
workflow is:

1. Scout forks for repos that have valid manifests.
2. Promote selected repos into the curated update list.
3. Refresh the local cache from the curated list on `main`.
4. Check the gallery locally.
5. Deploy the built site to the `gh-pages` branch.

## Setup

```sh
npm install
```

## Student Project Source

The source repository is configured in `repos.json`:

```json
{
  "source_repo": "pochihh/Project-NUEVO",
  "include_source_repo": false,
  "repos": [
    {
      "repo": "pochihh/example-capstone-portfolio",
      "featured": true,
      "ranking": null
    }
  ]
}
```

`source_repo` is used only by the scouting scan. `repos` is the curated update
list used by the cache update scan. Each listed repo must include a root-level
`manifest.json` and a README.

Curated repo entries can also include local-only display metadata:

- `featured`: set to `true` to pin a project before non-featured projects.
- `ranking`: set to `1`, `2`, or `3` to show the gold, silver, or bronze crown
  on the project card. Leave it as `null` when the project is unranked.

## Manifest Format

Each fork should include:

```json
{
  "schema_version": 1,
  "course": "MAE 162D/E",
  "year": 2026,
  "section": "Tsao",
  "group": 8,
  "title": "Example Capstone Project",
  "authors": ["Alice Chen", "Bob Kim"],
  "summary": "One or two sentences describing the project.",
  "thumbnail": "media/thumbnail.jpg",
  "keywords": ["robotics", "controls"]
}
```

Rules:

- `course` must be exactly `MAE 162D/E`.
- `year` and `group` must be numbers.
- `thumbnail` must be a path relative to the repo root.
- `keywords` is optional.
- The project page body comes from the fork README.
- No external links are rendered from the manifest.

See [docs/manifest.md](docs/manifest.md) for the full schema notes.

## Scouting Scan

Run this on `main` when you want to discover teams that have added a valid
manifest:

```sh
npm run scout-projects
```

This will:

- Scan forks of `pochihh/Project-NUEVO`.
- Read each fork's root `manifest.json`.
- Validate the manifest.
- Compare valid repos against the curated `repos` list.
- Write `scouting-repos.json`.

The scouting output includes:

- `new_repos`: valid manifest repos that are not yet in `repos.json`.
- `manifest_repos`: all scanned repos with valid manifests.
- `skipped_repos`: scanned repos without a manifest or with invalid manifests.

For now this discovers forks automatically. Later, this can be replaced by an
official submission list from teams.

## Promote Scouted Repos

After reviewing `scouting-repos.json`, either edit `repos.json` manually or run:

```sh
npm run promote-scouted
```

This appends all entries from `scouting-repos.json` `new_repos` into the curated
`repos` list. Review the diff before committing.

## Update Cache

Run this on `main`:

```sh
npm run fetch-projects
```

This will:

- Read only repos listed in `repos.json`.
- Read each repo's root `manifest.json`.
- Validate the manifest.
- Cache the GitHub repository URL for traceability.
- Cache the default branch so relative README links can point to the right
  GitHub files.
- Fetch the fork README.
- Download the thumbnail referenced by `manifest.thumbnail`.
- Write normalized data to `public/data/projects.json`.
- Cache manifests in `public/data/manifests/`.
- Cache thumbnails in `public/data/thumbnails/`.

If a fork is missing `manifest.json`, has invalid fields, or has a missing
thumbnail, it is skipped with a warning. Because update scan only reads the
curated list, it is safer to run frequently.

The cached `projects.json` includes `repo`, `repo_url`, `default_branch`,
`stars`, and local `ranking` metadata. Project pages use those fields for the
GitHub repo button, cached star count, repo-relative README links,
repo-relative README images, and optional ranking crowns on project cards.

## Check Locally

After fetching:

```sh
npm run dev
```

Open:

```text
http://localhost:5173/ucla-162-gallery/
```

Check:

- Project cards render correctly.
- Section, group, year, authors, summary, and keywords look right.
- Thumbnails load from the local cache.
- Project pages render the cached README.
- Repo-relative README links open the matching file on GitHub.
- Repo-relative README images load from the repository's raw file URL.
- YouTube links and YouTube iframe embeds render as embedded videos.

For production parity:

```sh
npm run build
npm run preview
```

## Deploy

Deploy only after the local cache and site look correct.

```sh
npm run deploy
```

This runs a production build and force-pushes `dist/` to the `gh-pages` branch.
GitHub Pages is configured to serve from:

```text
gh-pages /
```

Live site:

```text
https://pochihh.github.io/ucla-162-gallery/
```

## Useful Commands

```sh
npm run fetch-projects
npm run scout-projects
npm run promote-scouted
npm run dev
npm run lint
npm run build
npm run deploy
```
