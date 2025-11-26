# Update Vercel Node Version

## Quick Fix

Run this script with your Vercel token:

```bash
VERCEL_TOKEN=your_token_here node scripts/update-vercel-node-simple.mjs
```

Or set the token as an environment variable first:
```bash
$env:VERCEL_TOKEN = "your_token"
node scripts/update-vercel-node-simple.mjs
```

## Get Your Token

1. Go to: https://vercel.com/account/tokens
2. Create a new token
3. Copy it
4. Use it in the command above

## Alternative: Use Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select `dream-net` project
3. Settings → General → Node.js Version
4. Select **22.x**
5. Save

## What We've Done

- ✅ Updated root `package.json` engines to `"node": "22.x"`
- ✅ Created script to update via API
- ✅ All other fixes in place

The script will update the project settings via Vercel API once you provide the token.

