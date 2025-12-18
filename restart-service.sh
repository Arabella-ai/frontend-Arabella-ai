#!/bin/bash
# Quick script to restart the frontend service

echo "🔄 Restarting frontend service..."
sudo systemctl restart arabella-frontend

sleep 2

echo ""
echo "📊 Service Status:"
sudo systemctl status arabella-frontend --no-pager | head -10

echo ""
echo "✅ If service is active, the new build should now be served!"
echo ""
echo "💡 If you still see chunk errors:"
echo "   1. Hard refresh your browser: Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
echo "   2. Clear browser cache for arabella.uz"

