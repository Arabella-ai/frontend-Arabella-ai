#!/bin/bash
# Setup script for Arabella Frontend

set -e

echo "🚀 Setting up Arabella Frontend..."

cd /var/www/arabella/frontend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Setup Nginx
echo "🌐 Setting up Nginx..."
if [ ! -f /etc/nginx/sites-available/arabella.uz ]; then
    sudo cp nginx-config.conf /etc/nginx/sites-available/arabella.uz
    echo "✅ Created Nginx config"
else
    echo "⚠️  Nginx config already exists, skipping..."
fi

# Enable site
if [ ! -L /etc/nginx/sites-enabled/arabella.uz ]; then
    sudo ln -s /etc/nginx/sites-available/arabella.uz /etc/nginx/sites-enabled/
    echo "✅ Enabled Nginx site"
else
    echo "⚠️  Nginx site already enabled"
fi

# Test Nginx config
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Setup systemd service
echo "⚙️  Setting up systemd service..."
if [ ! -f /etc/systemd/system/arabella-frontend.service ]; then
    sudo cp arabella-frontend.service /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable arabella-frontend
    echo "✅ Created and enabled systemd service"
else
    echo "⚠️  Service already exists, reloading..."
    sudo systemctl daemon-reload
fi

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart nginx
sudo systemctl restart arabella-frontend

# Check status
echo ""
echo "📊 Service Status:"
echo "=================="
systemctl is-active arabella-frontend && echo "✅ Frontend service: Active" || echo "❌ Frontend service: Inactive"
systemctl is-active nginx && echo "✅ Nginx: Active" || echo "❌ Nginx: Inactive"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Point arabella.uz DNS A record to this server's IP"
echo "2. Test: curl http://arabella.uz"
echo "3. Check logs: sudo journalctl -u arabella-frontend -f"
echo "4. Setup SSL: sudo certbot --nginx -d arabella.uz"



