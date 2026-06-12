# UCLA MAE 162D/E Gallery

Static project gallery for UCLA MAE 162D/E capstone projects.

The gallery is built locally from cached GitHub fork data. The normal workflow is:

1. Scan forks and cache project data on `main`.
2. Check the gallery locally.
3. Deploy the built site to the `gh-pages` branch.

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
  "featured_repos": [
    { "repo": "pochihh/example-capstone-portfolio" }
  ]
}
```

The fetch script includes `featured_repos` first, then scans forks of
`source_repo`. Each valid repo must include a root-level `manifest.json` and a
README.

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

## Scan And Cache Forks

Run this on `main`:

```sh
npm run fetch-projects
```

This will:

- Scan forks of `pochihh/Project-NUEVO`.
- Include featured example repos before scanned forks.
- Read each fork's root `manifest.json`.
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
thumbnail, it is skipped with a warning.

The cached `projects.json` includes `repo`, `repo_url`, `default_branch`, and
`stars`. Project pages use those fields for the GitHub repo button, cached star
count, repo-relative README links, and repo-relative README images.

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
npm run dev
npm run lint
npm run build
npm run deploy
```
