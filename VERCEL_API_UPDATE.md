# Update Vercel Node Version via API

## Script Created

I've created `scripts/update-vercel-node-simple.mjs` that will update your Vercel project's Node.js version to 22.x using the Vercel API.

## How to Run

**Option 1: With Token from Environment**
```bash
$env:VERCEL_TOKEN = "your_vercel_token"
node scripts/update-vercel-node-simple.mjs
```

**Option 2: One-liner**
```bash
$env:VERCEL_TOKEN = "your_token"; node scripts/update-vercel-node-simple.mjs
```

## Get Your Vercel Token

1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a name (e.g., "Node Version Update")
4. Copy the token
5. Use it in the command above

## What the Script Does

- Uses Vercel API v10
- Updates project `prj_LADFPSWMoSgaHBxsaANzl3iQipBK`
- Sets `nodeVersion` to `"22.x"`
- Confirms the update

## Alternative: Manual Dashboard Update

If you prefer, you can still update it manually:
1. https://vercel.com/dashboard
2. Select `dream-net` project
3. Settings → General → Node.js Version → **22.x**
4. Save

## After Update

Once the Node version is set to 22.x, the next deployment should succeed! The rollup native module will install correctly.

