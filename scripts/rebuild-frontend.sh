#!/bin/bash
# Rebuild and restart frontend

set -e

echo "🔨 Rebuilding frontend..."

cd /var/www/arabella/frontend

# Remove old build
echo "🗑️  Removing old build..."
rm -rf .next

# Build
echo "📦 Building Next.js app..."
npm run build

# Restart service
echo "🔄 Restarting frontend service..."
sudo systemctl restart arabella-frontend

echo ""
echo "✅ Frontend rebuilt and restarted!"
echo ""
echo "📋 Check status:"
echo "  sudo systemctl status arabella-frontend"
echo ""
echo "📋 View logs:"
echo "  sudo journalctl -u arabella-frontend -f"


