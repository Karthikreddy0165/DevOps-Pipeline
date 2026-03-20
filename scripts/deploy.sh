#!/bin/bash
set -e

echo "==> Starting TaskFlow deployment..."

# Idempotent directory setup
mkdir -p ~/app/logs

cd ~/app

# Create .env if it doesn't exist (safe to re-run)
touch .env

echo "==> Building and restarting Docker services..."
# docker compose (V2 plugin) up -d --build is idempotent:
# - Rebuilds the image if source changed
# - Restarts only changed containers
# - Leaves the sqlite_data volume untouched (data persists)
docker compose up -d --build

echo "==> Deployment successful!"
echo "==> App is running at http://$(curl -s ifconfig.me):3000"
