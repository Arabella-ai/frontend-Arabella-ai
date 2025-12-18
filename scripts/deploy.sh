#!/bin/bash
# Deployment script for frontend
# This script builds and restarts the frontend service

set -e

echo "🚀 Deploying Arabella Frontend..."
echo ""

cd /var/www/arabella/frontend

# Build the application
echo "📦 Building Next.js app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Check if service is running
    if pgrep -f "next-server" > /dev/null; then
        echo "🔄 Restarting frontend service..."
        echo ""
        echo "⚠️  To restart the service, run one of:"
        echo "   sudo systemctl restart arabella-frontend"
        echo "   OR"
        echo "   pkill -f 'next-server' && cd /var/www/arabella/frontend && npm run start &"
        echo ""
        echo "📋 Current running processes:"
        ps aux | grep -E "next|node.*3000" | grep -v grep || echo "   No Next.js processes found"
    else
        echo "⚠️  Frontend service is not running. Start it with:"
        echo "   cd /var/www/arabella/frontend && npm run start &"
    fi
    
    echo ""
    echo "✅ Deployment ready! Restart the service to apply changes."
    echo ""
    echo "📋 Check logs:"
    echo "   sudo journalctl -u arabella-frontend -f"
    echo ""
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi


