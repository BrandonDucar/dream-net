# Vercel Environment Variables Setup Guide

## Current Status
❌ **No environment variables are currently set in Vercel**

## Required Environment Variables

### For Frontend (apps/site)
Since `vercel.json` has API rewrites configured, you have two options:

**Option 1: Use relative paths (Recommended)**
- Set `VITE_API_URL` to empty string `""` or don't set it
- The frontend will use relative paths like `/api/rewards/balance`
- Vercel rewrites will automatically forward to `https://api.dreamnet.ink`

**Option 2: Use absolute API URL**
- Set `VITE_API_URL` to `https://api.dreamnet.ink`
- Frontend will make direct API calls

### For Operator Panel (if needed)
- `VITE_OPERATOR_TOKEN` - Token for admin routes (optional, can be set client-side)

## Setting Environment Variables

### Via Vercel Dashboard (Recommended)
1. Go to: https://vercel.com/brandons-projects-91c5553e/site/settings/environment-variables
2. Click **Add New**
3. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `""` (empty string) OR `https://api.dreamnet.ink`
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

### Via Vercel CLI
```bash
# For relative paths (recommended with rewrites)
vercel env add VITE_API_URL production
# When prompted, enter: "" (empty string)

# Or for absolute URL
vercel env add VITE_API_URL production
# When prompted, enter: https://api.dreamnet.ink

# Add to all environments
vercel env add VITE_API_URL preview
vercel env add VITE_API_URL development
```

## Current Configuration

Your `vercel.json` already has:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.dreamnet.ink/:path*"
    }
  ]
}
```

This means:
- Frontend calls `/api/rewards/balance`
- Vercel automatically rewrites to `https://api.dreamnet.ink/rewards/balance`
- **So you can use empty string for `VITE_API_URL`**

## Recommendation

**Set `VITE_API_URL` to empty string `""`** - this will:
- Use relative paths that work with rewrites
- Work seamlessly with your current setup
- Avoid CORS issues
- Work in all environments

## Next Steps

1. Set `VITE_API_URL=""` in Vercel dashboard
2. Redeploy: `vercel --prod`
3. Test the site - API calls should work via rewrites
