/**
 * Build Standalone Game/App for Ohara or Remix.gg
 * Creates a self-contained HTML file with the game embedded
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });

interface GameConfig {
  name: string;
  component: string;
  description: string;
  category: 'game' | 'app';
  platform: 'ohara' | 'remix';
}

const GAMES: Record<string, GameConfig> = {
  'jaggy-stealth-run': {
    name: 'Jaggy Stealth Run',
    component: 'JaggyStealthRun',
    description: 'Stealth action game with on-chain leaderboards',
    category: 'game',
    platform: 'ohara',
  },
  'dream-remix-arena': {
    name: 'Dream Remix Arena',
    component: 'DreamRemixArena',
    description: 'Competitive remix battles on Remix.gg',
    category: 'game',
    platform: 'remix',
  },
  'dream-dna-sequencer': {
    name: 'Dream DNA Sequencer',
    component: 'DreamDNASequencerGame',
    description: 'Puzzle game with DNA sequencing mechanics',
    category: 'game',
    platform: 'ohara',
  },
  'dream-lattice': {
    name: 'Dream Lattice Game',
    component: 'DreamLatticeGame',
    description: 'Pattern matching puzzle game',
    category: 'game',
    platform: 'ohara',
  },
  'wormhole-escape': {
    name: 'Wormhole Escape',
    component: 'WormholeEscape',
    description: 'Escape through wormholes',
    category: 'game',
    platform: 'ohara',
  },
  'dream-nebula-explorer': {
    name: 'Dream Nebula Explorer',
    component: 'DreamNebulaExplorer',
    description: '3D space exploration through particle nebulas',
    category: 'game',
    platform: 'remix',
  },
};

async function buildStandaloneGame(gameKey: string, platform: 'ohara' | 'remix' = 'ohara') {
  const game = GAMES[gameKey];
  if (!game) {
    console.error(`❌ Game "${gameKey}" not found`);
    console.log(`Available games: ${Object.keys(GAMES).join(', ')}`);
    process.exit(1);
  }

  console.log(`🎮 Building ${game.name} for ${platform.toUpperCase()}...\n`);

  const outputDir = join(process.cwd(), 'dist', 'standalone-games', platform);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Create standalone HTML wrapper
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${game.name} - DreamNet</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #fff;
      overflow: hidden;
    }
    #root {
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    // This will be replaced with actual game bundle
    import { ${game.component} } from '/packages/base-mini-apps/frontend/index.tsx';
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${game.component}));
  </script>
</body>
</html>`;

  const outputPath = join(outputDir, `${gameKey}.html`);
  writeFileSync(outputPath, htmlContent);

  console.log(`✅ Built standalone game: ${outputPath}`);
  console.log(`📦 Game: ${game.name}`);
  console.log(`🎯 Platform: ${platform.toUpperCase()}`);
  console.log(`📝 Component: ${game.component}\n`);

  return {
    gameKey,
    game,
    outputPath,
    platform,
  };
}

const gameKey = process.argv[2];
const platform = (process.argv[3] as 'ohara' | 'remix') || 'ohara';

if (!gameKey) {
  console.log('Usage: pnpm tsx scripts/build-standalone-game.ts <game-key> [platform]');
  console.log('\nAvailable games:');
  Object.entries(GAMES).forEach(([key, game]) => {
    console.log(`  - ${key}: ${game.name} (${game.platform})`);
  });
  process.exit(1);
}

buildStandaloneGame(gameKey, platform).catch(console.error);

