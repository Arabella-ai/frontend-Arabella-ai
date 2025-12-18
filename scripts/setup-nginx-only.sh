#!/bin/bash
# Setup Nginx configuration for frontend

set -e

echo "🌐 Setting up Nginx for arabella.uz..."

CONFIG_FILE="nginx-final-fix.conf"
TARGET_FILE="/etc/nginx/sites-available/arabella.uz"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Config file not found: $CONFIG_FILE"
    exit 1
fi

# Copy Nginx config
sudo cp "$CONFIG_FILE" "$TARGET_FILE"
echo "✅ Updated Nginx config"

# Enable site
if [ ! -L /etc/nginx/sites-enabled/arabella.uz ]; then
    sudo ln -s "$TARGET_FILE" /etc/nginx/sites-enabled/
    echo "✅ Enabled site"
fi

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
echo "✅ Nginx configured and reloaded"
