# Frontend Deployment Guide

## 🚀 Automatic Deployment Options

### Option 1: Quick Deploy (Recommended)
After making changes, simply run:
```bash
cd /var/www/arabella/frontend
npm run deploy
```

Or use the script directly:
```bash
./auto-deploy.sh
```

This will:
- ✅ Build the Next.js app
- ✅ Restart the frontend service
- ✅ Show deployment status

### Option 2: Watch Mode (Auto-deploy on file changes)
For development, you can watch for changes and auto-deploy:
```bash
cd /var/www/arabella/frontend
npm run watch
```

Or:
```bash
./watch-and-deploy.sh
```

This will:
- 👀 Watch for changes in `src/` directory
- 🔄 Automatically rebuild and restart on file changes
- ⚠️ Press Ctrl+C to stop

### Option 3: Git Hook (Auto-deploy on commit)
If you use git, commits will automatically trigger deployment via the post-commit hook.

## 📋 Manual Deployment

If you prefer manual control:
```bash
cd /var/www/arabella/frontend
bash rebuild-frontend.sh
```

## 🔧 Troubleshooting

### Permission Issues
If you get permission errors, you may need to run with sudo:
```bash
sudo bash auto-deploy.sh
```

### Service Not Restarting
Check service status:
```bash
sudo systemctl status arabella-frontend
```

View logs:
```bash
sudo journalctl -u arabella-frontend -f
```

### Build Fails
Check for TypeScript/ESLint errors:
```bash
npm run lint
npm run build
```

## 💡 Pro Tips

1. **Quick Deploy**: Use `npm run deploy` after making changes
2. **Development**: Use `npm run watch` to auto-deploy on save
3. **Production**: Always test locally before deploying
4. **Check Logs**: Monitor logs after deployment to catch errors early







