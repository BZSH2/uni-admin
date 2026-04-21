#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
: "${BUILD_ARCHIVE_PATH:?BUILD_ARCHIVE_PATH is required}"

COMPOSE_FILE="${DEPLOY_PATH}/deploy/docker-compose.prod.yml"
RELEASES_DIR="${DEPLOY_PATH}/releases"
CURRENT_LINK="${DEPLOY_PATH}/current"
RELEASE_ID="${RELEASE_ID:-manual-$(date +%Y%m%d%H%M%S)}"
NEW_RELEASE_DIR="${RELEASES_DIR}/${RELEASE_ID}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
HOST_PORT="${HOST_PORT:-25003}"
PORT_MAPPING="${PORT_MAPPING:-127.0.0.1:${HOST_PORT}:80}"
APP_DOMAIN="${APP_DOMAIN:-uni-admin.bzsh.fun}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://127.0.0.1:${HOST_PORT}/healthz}"
CONTAINER_NAME="${CONTAINER_NAME:-uni-admin}"
RELEASE_GIT_SHA="${RELEASE_GIT_SHA:-}"
RELEASE_GIT_REF="${RELEASE_GIT_REF:-}"
RELEASE_RUN_URL="${RELEASE_RUN_URL:-}"
BUILD_ARCHIVE_SHA256_PATH="${BUILD_ARCHIVE_SHA256_PATH:-}"
PREVIOUS_TARGET="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"

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

recreate_app() {
  export DEPLOY_PATH CONTAINER_NAME HOST_PORT PORT_MAPPING
  docker compose -f "$COMPOSE_FILE" up -d --force-recreate --remove-orphans
}

cleanup_failed_release() {
  rm -rf "$NEW_RELEASE_DIR"
  rm -f "$BUILD_ARCHIVE_PATH"
  if [ -n "$BUILD_ARCHIVE_SHA256_PATH" ]; then
    rm -f "$BUILD_ARCHIVE_SHA256_PATH"
  fi
}

if ! command -v docker >/dev/null 2>&1; then
  echo 'docker is required on the deploy host.' >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo 'docker compose plugin is required on the deploy host.' >&2
  exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Compose file not found: $COMPOSE_FILE" >&2
  exit 1
fi

if [ ! -f "$BUILD_ARCHIVE_PATH" ]; then
  echo "Build archive not found: $BUILD_ARCHIVE_PATH" >&2
  exit 1
fi

case "$KEEP_RELEASES" in
  ''|*[!0-9]*)
    echo "KEEP_RELEASES must be a positive integer, got: $KEEP_RELEASES" >&2
    exit 1
    ;;
esac

if [ "$KEEP_RELEASES" -lt 1 ]; then
  echo "KEEP_RELEASES must be at least 1, got: $KEEP_RELEASES" >&2
  exit 1
fi

if [ -n "$BUILD_ARCHIVE_SHA256_PATH" ] && [ -f "$BUILD_ARCHIVE_SHA256_PATH" ]; then
  if command -v sha256sum >/dev/null 2>&1; then
    (
      cd "$(dirname "$BUILD_ARCHIVE_PATH")"
      sha256sum -c "$(basename "$BUILD_ARCHIVE_SHA256_PATH")"
    )
  else
    echo 'Warning: sha256sum not found on deploy host, skipping checksum verification.' >&2
  fi
fi

rm -rf "$NEW_RELEASE_DIR"
mkdir -p "$NEW_RELEASE_DIR"
tar -xzf "$BUILD_ARCHIVE_PATH" -C "$NEW_RELEASE_DIR"

if [ ! -f "$NEW_RELEASE_DIR/index.html" ]; then
  echo "Invalid release: index.html not found in $NEW_RELEASE_DIR" >&2
  cleanup_failed_release
  exit 1
fi

cat > "$NEW_RELEASE_DIR/.release-meta" <<EOF
release_id=${RELEASE_ID}
deployed_at=$(date -Iseconds)
app_domain=${APP_DOMAIN}
host_port=${HOST_PORT}
git_sha=${RELEASE_GIT_SHA}
git_ref=${RELEASE_GIT_REF}
workflow_run=${RELEASE_RUN_URL}
EOF

ln -sfn "$NEW_RELEASE_DIR" "$CURRENT_LINK"
recreate_app

if check_health; then
  echo "Deploy succeeded: uni-admin is responding on ${HEALTHCHECK_URL}."
  echo "Suggested public URL: https://${APP_DOMAIN}"
  rm -f "$BUILD_ARCHIVE_PATH"
  if [ -n "$BUILD_ARCHIVE_SHA256_PATH" ]; then
    rm -f "$BUILD_ARCHIVE_SHA256_PATH"
  fi

  if [ -d "$RELEASES_DIR" ]; then
    ls -1dt "$RELEASES_DIR"/* 2>/dev/null | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf
  fi

  exit 0
fi

echo "Health check failed for new release, attempting automatic rollback..." >&2

if [ -n "$PREVIOUS_TARGET" ] && [ -d "$PREVIOUS_TARGET" ]; then
  ln -sfn "$PREVIOUS_TARGET" "$CURRENT_LINK"
  recreate_app

  if check_health; then
    echo "Rollback succeeded. Previous release restored: $(basename "$PREVIOUS_TARGET")" >&2
  else
    echo 'Rollback also failed. Manual intervention required.' >&2
  fi
fi

echo 'Deploy failed, dumping container state...' >&2
docker compose -f "$COMPOSE_FILE" ps >&2 || true
docker compose -f "$COMPOSE_FILE" logs --no-color --tail=200 >&2 || true
cleanup_failed_release
exit 1
