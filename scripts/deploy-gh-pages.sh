#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
remote="${1:-origin}"
remote_url="$(git -C "$repo_root" remote get-url "$remote")"
tmp_dir="$(mktemp -d "${TMPDIR:-/tmp}/ucla-162-gallery-gh-pages.XXXXXX")"

cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT

cp -R "$repo_root/dist/." "$tmp_dir/"

git -C "$tmp_dir" init -b gh-pages
git -C "$tmp_dir" config user.name "$(git -C "$repo_root" config user.name || printf 'github-pages')"
git -C "$tmp_dir" config user.email "$(git -C "$repo_root" config user.email || printf 'github-pages@users.noreply.github.com')"
git -C "$tmp_dir" remote add origin "$remote_url"
git -C "$tmp_dir" add .
git -C "$tmp_dir" commit -m "Deploy site to GitHub Pages"
git -C "$tmp_dir" push --force origin gh-pages
