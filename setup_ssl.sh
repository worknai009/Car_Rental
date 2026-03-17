#!/bin/bash
set -e

# Configuration
DOMAINS="aitourism.in admin.aitourism.in"
EMAIL="badgu.workn@gmail.com" # Updated email
STAGING=0 # Set to 1 for testing

if [ -d "/root/car-rental/certbot/conf/live/aitourism.in" ]; then
    echo "SSL Certificates already exist. Skipping initial request."
    exit 0
fi

echo "### Clearing Nginx HTTPS blocks for initial setup..."
cp /root/car-rental/gateway.nginx.conf /root/car-rental/gateway.nginx.conf.bak
cat <<EOF > /root/car-rental/gateway.nginx.conf
server {
    listen 80;
    server_name aitourism.in admin.aitourism.in;
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}
EOF

echo "### Starting Nginx for verification..."
docker compose -f /root/car-rental/docker-compose.yml up -d gateway

echo "### Requesting Let's Encrypt certificates..."
# Combine all domains into one certificate for simplicity
docker compose -f /root/car-rental/docker-compose.yml run --rm certbot \
    certonly --webroot --webroot-path=/var/www/certbot \
    --email $EMAIL --agree-tos --no-eff-email \
    -d aitourism.in -d admin.aitourism.in

echo "### Restoring full Nginx configuration..."
cp /root/car-rental/gateway.nginx.conf.bak /root/car-rental/gateway.nginx.conf

echo "### Restarting Nginx with SSL..."
docker compose -f /root/car-rental/docker-compose.yml up -d gateway

echo "SSL Setup complete! Your site is now secure."
