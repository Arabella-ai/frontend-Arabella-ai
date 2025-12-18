#!/bin/bash
# Watch for file changes and auto-deploy
# Usage: ./watch-and-deploy.sh

set -e

echo "👀 Watching for file changes in src/..."
echo "   Press Ctrl+C to stop"
echo ""

cd /var/www/arabella/frontend

# Check if inotifywait is available
if ! command -v inotifywait &> /dev/null; then
    echo "⚠️  inotifywait not found. Installing inotify-tools..."
    sudo apt-get update && sudo apt-get install -y inotify-tools
fi

# Watch for changes in src directory
inotifywait -m -r -e modify,create,delete,move \
    --include '\.(ts|tsx|js|jsx|css|json)$' \
    src/ 2>/dev/null | while read path action file; do
    
    echo ""
    echo "📝 Change detected: $file ($action)"
    echo "🔄 Auto-deploying..."
    
    # Run auto-deploy
    bash auto-deploy.sh
    
    echo "✅ Ready for next change..."
    echo ""
done







