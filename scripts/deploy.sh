#!/bin/bash
set -e

echo "Starting Dockerized Deployment process..."

# Enforce idempotency - directories exist
mkdir -p ~/app/logs
mkdir -p ~/app/data

cd ~/app

# Ensure correct env fields are ready to go in production
touch .env

echo "Pulling Latest Docker Images & Restarting Services..."
# docker-compose allows idempotent service execution cleanly removing old containers
docker-compose --env-file .env up -d --build

echo "Deployment Successful via Docker!"
