# 🚀 Deploy Dream Nebula Explorer to Remix.gg

## ✅ Build Complete!

The standalone game HTML has been built:
- **Location:** `dist/standalone-games/remix/dream-nebula-explorer.html`
- **Game:** Dream Nebula Explorer
- **Platform:** Remix.gg

## 🔑 Setup Required

### Step 1: Get Remix.gg API Key

1. Visit: https://remix.gg/api/keys (or check Remix.gg dashboard)
2. Create/generate an API key
3. Copy the key

### Step 2: Add to .env

Add to your `.env` or `.env.local` file:

```bash
REMIX_API_KEY=your_api_key_here
REMIX_API_URL=https://api.remix.gg/v1  # Update if different
```

### Step 3: Deploy

Once the API key is set, run:

```bash
pnpm deploy:remix "Dream Nebula Explorer" "3D space exploration game through particle nebulas" dist/standalone-games/remix/dream-nebula-explorer.html
```

Or use the combined command:

```bash
pnpm deploy:game dream-nebula-explorer remix
```

## 📋 Manual Deployment Alternative

If the API doesn't work, you can manually upload:

1. Go to Remix.gg dashboard
2. Create new game
3. Upload the HTML file: `dist/standalone-games/remix/dream-nebula-explorer.html`
4. Set name: "Dream Nebula Explorer"
5. Set description: "3D space exploration game through particle nebulas"
6. Publish

## 🎮 Game Details

- **Name:** Dream Nebula Explorer
- **Description:** 3D space exploration game through particle nebulas - Navigate, collect dream fragments, avoid obstacles. Built with WebGL capabilities and on-chain scoring.
- **Category:** Game
- **Features:**
  - 3D perspective rendering
  - Particle nebula systems
  - On-chain scoring
  - Real-time effects

## ✅ Next Steps

1. Set `REMIX_API_KEY` in `.env`
2. Run deploy command
3. Check Remix.gg dashboard for your game
4. Share the game URL!

---

**Status:** ✅ Built & Ready to Deploy  
**File:** `dist/standalone-games/remix/dream-nebula-explorer.html`



