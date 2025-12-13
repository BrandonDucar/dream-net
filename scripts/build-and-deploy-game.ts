/**
 * Build and Deploy Game to Ohara or Remix.gg
 * One-command workflow: build standalone → deploy
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });

async function buildAndDeploy(gameKey: string, platform: 'ohara' | 'remix' = 'ohara') {
  console.log(`🚀 Building and deploying ${gameKey} to ${platform.toUpperCase()}...\n`);

  try {
    // Step 1: Build standalone game
    console.log('📦 Step 1: Building standalone game...');
    execSync(`pnpm tsx scripts/build-standalone-game.ts ${gameKey} ${platform}`, {
      stdio: 'inherit',
    });

    // Step 2: Get game name
    const gameNames: Record<string, string> = {
      'jaggy-stealth-run': 'Jaggy Stealth Run',
      'dream-remix-arena': 'Dream Remix Arena',
      'dream-dna-sequencer': 'Dream DNA Sequencer',
      'dream-lattice': 'Dream Lattice Game',
      'wormhole-escape': 'Wormhole Escape',
    };

    const gameName = gameNames[gameKey] || gameKey;
    const htmlPath = join(process.cwd(), 'dist', 'standalone-games', platform, `${gameKey}.html`);

    // Step 3: Deploy
    console.log('\n🚀 Step 2: Deploying to platform...');
    if (platform === 'ohara') {
      execSync(`pnpm tsx scripts/deploy-to-ohara.ts "${gameName}" "DreamNet game" "${htmlPath}"`, {
        stdio: 'inherit',
      });
    } else {
      execSync(`pnpm tsx scripts/deploy-to-remix.ts "${gameName}" "DreamNet game on Remix.gg" "${htmlPath}"`, {
        stdio: 'inherit',
      });
    }

    console.log('\n✅ Build and deploy complete!');
  } catch (error: any) {
    console.error('\n❌ Build/deploy failed:', error.message);
    process.exit(1);
  }
}

const gameKey = process.argv[2];
const platform = (process.argv[3] as 'ohara' | 'remix') || 'ohara';

if (!gameKey) {
  console.log('Usage: pnpm tsx scripts/build-and-deploy-game.ts <game-key> [platform]');
  console.log('\nAvailable games:');
  console.log('  - jaggy-stealth-run');
  console.log('  - dream-remix-arena');
  console.log('  - dream-dna-sequencer');
  console.log('  - dream-lattice');
  console.log('  - wormhole-escape');
  console.log('\nPlatforms:');
  console.log('  - ohara (default)');
  console.log('  - remix');
  console.log('\nExample:');
  console.log('  pnpm tsx scripts/build-and-deploy-game.ts jaggy-stealth-run ohara');
  process.exit(1);
}

buildAndDeploy(gameKey, platform).catch(console.error);



