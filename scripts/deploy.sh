#!/bin/bash

# Idempotent Deployment Script
# This script ensures the directory exists and restarts the service safely.

set -e

PROJECT_DIR="/home/ubuntu/taskflow"

echo "➡️ Setting up deployment directory..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo "➡️ Pulling latest changes (simulated)..."
# In a real environment, you'd run git pull here
# git pull origin main

echo "➡️ Checking if Docker containers are running..."
if docker-compose ps | grep "Up" > /dev/null; then
  echo "⚠️ Containers are already running. Stopping them first to ensure clean state..."
  docker-compose down
else
  echo "✅ No running containers found. Proceeding cleanly."
fi

echo "➡️ Rebuilding and starting application..."
docker-compose up -d --build

echo "🎉 Deployment completed successfully. Service is up!"
