#!/usr/bin/env bash
# Initializes the database (runs Alembic migrations then seeds initial data).
set -e

cd "$(dirname "$0")/.."

echo "Running Alembic migrations..."
alembic upgrade head

echo "Seeding initial data..."
python scripts/seed_data.py

echo "Database initialization complete."
