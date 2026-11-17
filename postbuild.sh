#!/bin/bash
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy || true

echo "Generating Prisma client..."
npx prisma generate

echo "Done!"
