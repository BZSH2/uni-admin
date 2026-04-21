#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_PATH:?DEPLOY_PATH is required}"

COMPOSE_FILE="${DEPLOY_PATH}/deploy/docker-compose.prod.yml"
RELEASES_DIR="${DEPLOY_PATH}/releases"
CURRENT_LINK="${DEPLOY_PATH}/current"
HOST_PORT="${HOST_PORT:-25003}"
PORT_MAPPING="${PORT_MAPPING:-127.0.0.1:${HOST_PORT}:80}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://127.0.0.1:${HOST_PORT}/healthz}"
CONTAINER_NAME="${CONTAINER_NAME:-uni-admin}"
TARGET_RELEASE="${1:-}"

check_health() {
  for _ in $(seq 1 30); do
    if command -v curl >/dev/null 2>&1; then
      if curl -fsS "$HEALTHCHECK_URL" >/dev/null; then
        return 0
      fi
    elif command -v wget >/dev/null 2>&1; then
      if wget -q -O /dev/null "$HEALTHCHECK_URL"; then
        return 0
      fi
    fi
    sleep 2
  done

  return 1
}

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Compose file not found: $COMPOSE_FILE" >&2
  exit 1
fi

if [ ! -d "$RELEASES_DIR" ]; then
  echo "Releases directory not found: $RELEASES_DIR" >&2
  exit 1
fi

CURRENT_TARGET="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"

if [ -n "$TARGET_RELEASE" ]; then
  TARGET_DIR="${RELEASES_DIR}/${TARGET_RELEASE}"
else
  TARGET_DIR="$(ls -1dt "$RELEASES_DIR"/* 2>/dev/null | grep -vx "$CURRENT_TARGET" | head -n 1 || true)"
fi

if [ -z "$TARGET_DIR" ] || [ ! -d "$TARGET_DIR" ]; then
  echo "Rollback target not found." >&2
  exit 1
fi

if [ ! -f "$TARGET_DIR/index.html" ]; then
  echo "Rollback target is invalid: index.html not found in $TARGET_DIR" >&2
  exit 1
fi

ln -sfn "$TARGET_DIR" "$CURRENT_LINK"

export DEPLOY_PATH CONTAINER_NAME HOST_PORT PORT_MAPPING

docker compose -f "$COMPOSE_FILE" up -d --force-recreate --remove-orphans

if check_health; then
  echo "Rollback succeeded: $(basename "$TARGET_DIR")"
  exit 0
fi

echo "Rollback health check failed." >&2
docker compose -f "$COMPOSE_FILE" ps >&2 || true
docker compose -f "$COMPOSE_FILE" logs --no-color --tail=200 >&2 || true
exit 1
