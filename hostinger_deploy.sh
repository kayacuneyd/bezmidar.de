#!/usr/bin/env bash
set -euo pipefail

# Hostinger deploy (build + rsync over SSH)
# Override any of these via environment variables.
REMOTE_USER="${REMOTE_USER:-u553245641}"
REMOTE_HOST="${REMOTE_HOST:-185.224.137.82}"
REMOTE_PORT="${REMOTE_PORT:-65002}"

# Web root (public site)
REMOTE_WEB_DIR="${REMOTE_WEB_DIR:-~/domains/bezmidar.de/public_html}"
# App source path on the server (kept under web root by default)
REMOTE_APP_DIR="${REMOTE_APP_DIR:-${REMOTE_WEB_DIR}/app}"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Required command not found: $1" >&2
    exit 1
  }
}

require_cmd ssh
require_cmd rsync
require_cmd npm

echo "Building frontend..."
npm run build:frontend

if [ ! -d "frontend/dist" ]; then
  echo "frontend/dist not found. Build may have failed." >&2
  exit 1
fi

SSH_TARGET="${REMOTE_USER}@${REMOTE_HOST}"

echo "Ensuring remote directories exist..."
ssh -p "${REMOTE_PORT}" "${SSH_TARGET}" "mkdir -p ${REMOTE_WEB_DIR} ${REMOTE_APP_DIR}"

EXCLUDES=(
  ".git/"
  "node_modules/"
  "frontend/node_modules/"
  "backend/node_modules/"
  "frontend/dist/"
  ".env"
  ".env.*"
)

EXCLUDE_ARGS=()
for ex in "${EXCLUDES[@]}"; do
  EXCLUDE_ARGS+=(--exclude="$ex")
done

echo "Syncing app source..."
rsync -az --delete "${EXCLUDE_ARGS[@]}" -e "ssh -p ${REMOTE_PORT}" "./" "${SSH_TARGET}:${REMOTE_APP_DIR}/"

echo "Syncing frontend dist to web root..."
rsync -az --delete -e "ssh -p ${REMOTE_PORT}" "frontend/dist/" "${SSH_TARGET}:${REMOTE_WEB_DIR}/"

echo "Deploy complete."
