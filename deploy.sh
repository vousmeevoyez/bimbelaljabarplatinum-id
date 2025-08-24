#!/bin/bash
set -euo pipefail

D1_DATABASE_NAME=$(node scripts/get-db-name.mjs)
D1_DATABASE_ID=$(node scripts/get-db-id.mjs)

export D1_DATABASE_NAME
export D1_DATABASE_ID

echo "Using database: $D1_DATABASE_NAME (ID: $D1_DATABASE_ID)"

pnpm run db:migrate:dev
pnpm run db:migrate:remote
pnpm run deploy
