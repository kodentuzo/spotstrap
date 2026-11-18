#!/usr/bin/env bash
# Publishes spotstrap to npm from CI: `latest`, or `next` for a pre-release. A version already
# on npm is skipped, so a failed run can be re-run. With NODE_AUTH_TOKEN (the first publish
# only) provenance is asked for explicitly; with trusted publishing (OIDC) it's automatic.
set -euo pipefail
name="$(jq -r .name package.json)"
version="$(jq -r .version package.json)"
tag=latest
case "$version" in *-*) tag=next ;; esac
if npm view "$name@$version" version > /dev/null 2>&1; then
  echo "$name@$version is already on npm; skipping"
  exit 0
fi
extra=()
[ -n "${NODE_AUTH_TOKEN:-}" ] && extra=(--provenance)
npm publish --access public --tag "$tag" "${extra[@]}"
