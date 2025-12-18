#!/bin/bash
# Frontend Deployment Script
# Rebuilds and restarts the frontend service

set -e

echo "🚀 Deploying Arabella Frontend..."
echo ""

# Navigate to frontend directory
cd /var/www/arabella/frontend

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next

# Build the application
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Stop existing service
echo "🛑 Stopping existing service..."
ps aux | grep "next-server" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true
sleep 2

# Start service
echo "▶️  Starting frontend service..."
nohup npm run start > /tmp/arabella-frontend.log 2>&1 &
sleep 6

# Verify health
echo "🏥 Checking health..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Frontend deployed successfully!"
    echo "   HTTP Status: $HTTP_CODE"
else
    echo "❌ Frontend health check failed!"
    echo "   HTTP Status: $HTTP_CODE"
    echo "   Check logs: tail -f /tmp/arabella-frontend.log"
    exit 1
fi

echo ""
echo "📊 Service Status:"
ps aux | grep next-server | grep -v grep | head -1

echo ""
echo "✅ Deployment complete!"


