#!/bin/bash
# Configuration
DOMAINS="aitourism.in admin.aitourism.in"
EMAIL="badgu.workn@gmail.com"

cd /root/car-rental

echo "### Nginx current status:"
docker ps | grep gateway

echo "### Requesting certs directly with docker run..."
# Run certbot in the foreground with direct output
docker run --rm \
  -v "/root/car-rental/certbot/conf:/etc/letsencrypt" \
  -v "/root/car-rental/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --webroot --webroot-path=/var/www/certbot \
  --email $EMAIL --agree-tos --no-eff-email --non-interactive \
  -d aitourism.in -d admin.aitourism.in || { echo 'Certbot FAILED'; exit 1; }

echo "### Certs obtained! Updating Nginx..."
cp gateway.nginx.conf.bak gateway.nginx.conf
docker compose restart gateway
echo "SSL Setup SUCCESS"
