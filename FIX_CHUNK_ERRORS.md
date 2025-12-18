# Fix Chunk Loading Errors

## Problem
Browser is trying to load old JavaScript chunks that no longer exist after a new build, causing 404 errors.

## Solution

### Step 1: Restart Frontend Service
The build completed successfully, but the service needs to be restarted to serve the new chunks:

```bash
sudo systemctl restart arabella-frontend
```

### Step 2: Clear Browser Cache
Users experiencing the error should:
1. Hard refresh the page: `Ctrl+Shift+R` (Linux/Windows) or `Cmd+Shift+R` (Mac)
2. Or clear browser cache for arabella.uz

### Step 3: Clear Nginx Cache (if applicable)
If you have nginx caching enabled:

```bash
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx
```

### Step 4: Verify Service is Running
Check that the service started correctly:

```bash
sudo systemctl status arabella-frontend
```

View logs if there are issues:

```bash
sudo journalctl -u arabella-frontend -f
```

## What Was Fixed

1. ✅ Added Suspense boundaries to admin pages to fix prerendering errors
2. ✅ Rebuilt the frontend with fresh chunks
3. ✅ Build completed successfully

## Prevention

To avoid this in the future:
- Always restart the frontend service after building
- Consider adding cache-busting headers in nginx
- Use the auto-deploy script: `npm run deploy`

## Current Build Status
- ✅ Build completed successfully
- ✅ New chunks generated in `.next/static/chunks/app/`
- ⚠️ Service restart required (needs sudo)

