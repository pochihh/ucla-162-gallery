# Project Manifest

Each fork of `pochihh/Project-NUEVO` should include a root-level `manifest.json`.
The gallery scans forks, validates this file, caches the manifest, downloads the
thumbnail, fetches the repo README, and writes `public/data/projects.json`.

## Required Format

```json
{
  "schema_version": 1,
  "course": "MAE 162D/E",
  "year": 2026,
  "section": "Tsao",
  "group": 8,
  "title": "Example Capstone Project",
  "authors": ["Alice Chen", "Bob Kim", "Carol Liu"],
  "summary": "One or two sentences describing the project.",
  "thumbnail": "media/thumbnail.jpg",
  "keywords": ["robotics", "controls", "sensing"]
}
```

## Rules

- `schema_version` must be `1`.
- `course` must be exactly `MAE 162D/E`.
- `year` and `group` must be numbers.
- `section`, `title`, `summary`, and `thumbnail` must be non-empty strings.
- `authors` must be a non-empty array of strings.
- `keywords` is optional, but when present it must be an array of strings.
- `thumbnail` must be a repo-relative path, not an external URL.

## Slugs

Project routes are generated as:

```text
{section}-group{group}-{repo-name}
```

Example:

```text
Tsao-group8-team-nuevo
```

## Local Cache Workflow

```sh
npm run fetch-projects
npm run dev
```

Inspect the site locally on `main`. When the cached data looks correct, deploy
the current build to the `gh-pages` branch:

```sh
npm run deploy
```

## Cached Output

The generated `public/data/projects.json` includes the manifest fields plus
gallery-owned cache metadata:

```json
{
  "repo": "owner/repo-name",
  "repo_url": "https://github.com/owner/repo-name",
  "default_branch": "main",
  "stars": 0,
  "featured": false,
  "slug": "Tsao-group8-repo-name",
  "manifest": "data/manifests/Tsao-group8-repo-name.json",
  "thumbnail": "data/thumbnails/Tsao-group8-repo-name.jpg",
  "thumbnail_repo_path": "media/thumbnail.jpg",
  "readme": "# README markdown...",
  "updated_at": "2026-06-12T00:00:00Z"
}
```

`repo_url`, `default_branch`, and `stars` come from the GitHub repository API.
The project page uses `repo_url` for the GitHub button, `stars` for the cached
star count, and `default_branch` when turning repo-relative README links and
images into GitHub URLs.

## README Rendering

The project page renders the cached root `README.md`.

- Repo-relative links, such as `docs/README.md`, open the corresponding GitHub
  file using the cached repository URL and default branch.
- Repo-relative images, such as `assets/photo.jpg`, load from the repository's
  raw file URL.
- External links and external images are left as-is.
- YouTube URLs and YouTube iframe embeds render as embedded videos.

The gallery does not cache every linked internal document. Use the root README
as the public project page and link to deeper repo docs when more detail is
useful.
