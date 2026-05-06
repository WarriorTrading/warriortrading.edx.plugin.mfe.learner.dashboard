#!/usr/bin/env bash
# Sync this repo into Ulmo Tutor MFE build context (Docker COPY source + bind-mount target).
# Usage: export TUTOR_ROOT=/path/to/tutor-root   # then:
#   ./scripts/sync-to-tutor-mfe.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${TUTOR_ROOT:?Set TUTOR_ROOT to your tutor-root path}/env/plugins/mfe/build/mfe/warrior-learner-dashboard"
mkdir -p "$DEST"
rsync -a --delete \
  --exclude node_modules \
  --exclude .git \
  --exclude .cursor \
  "$ROOT/" "$DEST/"
echo "Synced to $DEST"
