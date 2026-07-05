#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

# Install Python dependencies
uv sync --frozen --all-groups || uv sync --all-groups

# Optionally sync production DB into dev_db
bash "$SCRIPT_DIR/sync_prod_to_dev_db.sh"
