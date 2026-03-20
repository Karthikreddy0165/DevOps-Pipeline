#!/bin/bash
set -e

echo "==> Starting TaskFlow deployment..."

# Install Docker if not present
if ! command -v docker &> /dev/null
then
  echo "==> Docker not found. Installing..."
  sudo apt update
  sudo apt install docker.io -y
  sudo systemctl start docker
  sudo systemctl enable docker
  sudo usermod -aG docker $USER
fi

# Install docker compose plugin if missing
if ! docker compose version &> /dev/null
then
  echo "==> Installing Docker Compose plugin..."
  sudo apt install docker-compose -y
fi

mkdir -p ~/app/logs
cd ~/app

touch .env

echo "==> Building and restarting Docker services..."
docker-compose up -d --build

echo "==> Deployment successful!"
echo "==> App is running at http://$(curl -s ifconfig.me):3000"
