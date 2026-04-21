#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_PATH:?DEPLOY_PATH is required}"

RELEASES_DIR="${DEPLOY_PATH}/releases"
CURRENT_LINK="${DEPLOY_PATH}/current"
CURRENT_TARGET="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"

if [ ! -d "$RELEASES_DIR" ]; then
  echo "Releases directory not found: $RELEASES_DIR" >&2
  exit 1
fi

found=0
for dir in $(ls -1dt "$RELEASES_DIR"/* 2>/dev/null || true); do
  found=1
  marker=' '
  if [ -n "$CURRENT_TARGET" ] && [ "$(readlink -f "$dir")" = "$CURRENT_TARGET" ]; then
    marker='*'
  fi

  echo "[$marker] $(basename "$dir")"
  if [ -f "$dir/.release-meta" ]; then
    sed 's/^/    /' "$dir/.release-meta"
  fi
  echo
done

if [ "$found" -eq 0 ]; then
  echo 'No releases found.'
fi
