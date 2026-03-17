#!/bin/bash
set -e

# Copy the modern compose file to the correct location
cp /root/car-rental/docker-compose.yml /root/car-rental/docker-compose.yml.bak

# Update the VPS compose file with the one we just pushed
# Actually, I'll just upload the new compose file directly.

cd /root/car-rental

echo "Stopping and removing existing containers..."
docker compose down

echo "Cleaning up source code folders..."
rm -rf backend frontend Admin deploy.sh project.tar.gz vps_setup.sh

echo "Pulling latest images from Docker Hub..."
docker pull worknai009/car-rental-frontend
docker pull worknai009/car-rental-backend
docker pull worknai009/car-rental-admin-frontend
docker pull worknai009/car-rental-admin-backend

echo "Starting stack from Docker Hub images..."
docker compose up -d

echo "Cleanup complete. VPS now only contains docker-compose.yml, .env, and gateway.nginx.conf"
ls -la
