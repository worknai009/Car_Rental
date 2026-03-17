#!/bin/bash
set -e

echo "Extracting project..."
mkdir -p /root/car-rental
tar -xzf /root/project.tar.gz -C /root/car-rental

cd /root/car-rental

echo "Stopping existing containers (if any)..."
docker compose down || true

echo "Building and starting containers..."
docker compose up --build -d

echo "Deployment complete! Checking status..."
docker compose ps
