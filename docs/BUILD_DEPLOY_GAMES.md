# 🎮 Build & Deploy Games to Ohara & Remix.gg

## Quick Start

### Deploy to Ohara (One Command)
```bash
pnpm deploy:game jaggy-stealth-run ohara
```

### Deploy to Remix.gg (One Command)
```bash
pnpm deploy:game dream-remix-arena remix
```

## Available Games

- `jaggy-stealth-run` - Stealth action game
- `dream-remix-arena` - Competitive remix battles (perfect for Remix.gg!)
- `dream-dna-sequencer` - DNA sequencing puzzle game
- `dream-lattice` - Pattern matching puzzle
- `wormhole-escape` - Escape through wormholes

## Step-by-Step Workflow

### Option 1: Build & Deploy (Recommended)
```bash
# Build standalone game and deploy in one command
pnpm deploy:game <game-key> <platform>

# Examples:
pnpm deploy:game jaggy-stealth-run ohara
pnpm deploy:game dream-remix-arena remix
```

### Option 2: Build Then Deploy Separately
```bash
# Step 1: Build standalone game
pnpm build:game <game-key> [platform]

# Step 2: Deploy to Ohara
pnpm deploy:ohara "<Game Name>" "<Description>" dist/standalone-games/ohara/<game-key>.html

# Or deploy to Remix.gg
pnpm deploy:remix "<Game Name>" "<Description>" dist/standalone-games/remix/<game-key>.html
```

## Setup

### Ohara Setup
1. Get API key from: https://ohara.ai/api/keys
2. Add to `.env`:
   ```
   OHARA_API_KEY=your_key_here
   ```

### Remix.gg Setup
1. Get API key from: https://remix.gg/api/keys (or check their docs)
2. Add to `.env`:
   ```
   REMIX_API_KEY=your_key_here
   REMIX_API_URL=https://api.remix.gg/v1  # Update if different
   ```

## How It Works

1. **Build Standalone Game** (`build-standalone-game.ts`)
   - Creates self-contained HTML file
   - Includes game component
   - Outputs to `dist/standalone-games/<platform>/<game-key>.html`

2. **Deploy to Ohara** (`deploy-to-ohara.ts`)
   - Uses `oharaClient` from `server/integrations/oharaClient.ts`
   - Creates or updates app on Ohara
   - Publishes with HTML code

3. **Deploy to Remix.gg** (`deploy-to-remix.ts`)
   - Connects to Remix.gg API
   - Creates or updates game
   - Publishes with HTML code

## Examples

### Deploy Jaggy Stealth Run to Ohara
```bash
pnpm deploy:game jaggy-stealth-run ohara
```

### Deploy Dream Remix Arena to Remix.gg
```bash
pnpm deploy:game dream-remix-arena remix
```

### Build Multiple Games
```bash
# Build for Ohara
pnpm build:game jaggy-stealth-run ohara
pnpm build:game dream-dna-sequencer ohara

# Build for Remix
pnpm build:game dream-remix-arena remix
```

## Output Location

Built games are saved to:
- `dist/standalone-games/ohara/<game-key>.html`
- `dist/standalone-games/remix/<game-key>.html`

## Troubleshooting

**Ohara API errors:**
- Verify `OHARA_API_KEY` is set correctly
- Check API endpoint: `https://api.ohara.ai`

**Remix.gg API errors:**
- Verify `REMIX_API_KEY` is set correctly
- Check `REMIX_API_URL` matches their actual API endpoint
- Remix.gg API structure may vary - check their docs

**Build errors:**
- Ensure game component exists in `packages/base-mini-apps/frontend/`
- Check game key matches available games list

## Next Steps

After deploying:
1. Check Ohara dashboard: https://ohara.ai/apps
2. Check Remix.gg dashboard: https://remix.gg/games
3. Test the deployed game
4. Share the game URL!



