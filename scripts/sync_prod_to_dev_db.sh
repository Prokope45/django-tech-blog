#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

# Load .env
set -o allexport
source "$ROOT_DIR/.env" 2>/dev/null || true
set +o allexport

# Build prod connection string
if [ -n "$DATABASE_URL" ]; then
  PROD_DB_URL="$DATABASE_URL"
elif [ -n "$DATABASE_HOST" ]; then
  PROD_DB_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT:-5432}/${DATABASE_NAME}"
else
  echo "No production database credentials found (DATABASE_URL or DATABASE_HOST). Skipping sync."
  exit 0
fi

# Wait for dev_db to be healthy
echo "Waiting for dev_db to be ready..."
for i in $(seq 1 30); do
  if PGPASSWORD=password psql -h dev_db -U user -d dev_db -c "SELECT 1" >/dev/null 2>&1; then
    echo "dev_db is ready."
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "ERROR: dev_db not reachable after 30 attempts."
    exit 1
  fi
  sleep 2
done

echo "Dumping production database..."
pg_dump --no-owner --no-acl "$PROD_DB_URL" > /tmp/prod_dump.sql

echo "Restoring into dev_db..."
export PGPASSWORD=password
psql -h dev_db -U user -d dev_db <<'EOSQL'
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
EOSQL
psql -h dev_db -U user -d dev_db < /tmp/prod_dump.sql

echo "Running migrations..."
uv run python manage.py migrate

echo "Sync complete."
