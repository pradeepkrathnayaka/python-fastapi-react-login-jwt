#!/usr/bin/env bash
# Run the full test suite with coverage.
set -e

cd "$(dirname "$0")/.."

echo "Running tests..."
pytest --cov=src --cov-report=term-missing --cov-report=html "$@"
echo "Done. HTML report: htmlcov/index.html"
