#!/bin/bash
# Auto-deploy script for frontend changes
# This script rebuilds and restarts the frontend service automatically

set -e

echo "🚀 Auto-deploying frontend changes..."

cd /var/www/arabella/frontend

# Check if we need sudo for service restart
if systemctl is-active --quiet arabella-frontend 2>/dev/null; then
    NEEDS_SUDO=true
else
    NEEDS_SUDO=false
fi

# Build the application
echo "📦 Building Next.js app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Restart service
    if [ "$NEEDS_SUDO" = true ]; then
        echo "🔄 Restarting frontend service (requires sudo)..."
        sudo systemctl restart arabella-frontend
    else
        echo "🔄 Restarting frontend service..."
        systemctl --user restart arabella-frontend 2>/dev/null || npm run start &
    fi
    
    echo ""
    echo "✅ Frontend deployed successfully!"
    echo ""
    echo "📋 Check status:"
    echo "  systemctl status arabella-frontend"
    echo ""
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi







