/**
 * Deploy Game to Remix.gg Platform
 * Builds and deploys games to Remix.gg
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });

interface RemixDeployConfig {
  name: string;
  description: string;
  gameKey: string;
  htmlPath?: string;
  remixApiKey?: string;
}

async function deployToRemix(config: RemixDeployConfig) {
  console.log(`🎮 Deploying "${config.name}" to Remix.gg...\n`);

  const apiKey = config.remixApiKey || process.env.REMIX_API_KEY;
  if (!apiKey) {
    console.error('❌ REMIX_API_KEY not set');
    console.log('💡 Get your API key from: https://remix.gg/api/keys');
    console.log('💡 Or set REMIX_API_KEY in your .env file\n');
    console.log('📝 Note: Remix.gg API endpoint may vary - check their docs');
    process.exit(1);
  }

  // Read HTML content
  let htmlContent = '';
  if (config.htmlPath && existsSync(config.htmlPath)) {
    htmlContent = readFileSync(config.htmlPath, 'utf-8');
    console.log(`📄 Loaded HTML from: ${config.htmlPath}\n`);
  } else {
    // Generate basic HTML template
    htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${config.name}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #000; color: #fff; }
    #root { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Game will be injected here
    console.log('${config.name} loaded on Remix.gg');
  </script>
</body>
</html>`;
    console.log('📝 Using generated HTML template\n');
  }

  try {
    // Remix.gg API endpoint (update based on actual API)
    const remixApiUrl = process.env.REMIX_API_URL || 'https://api.remix.gg/v1';
    
    console.log('🔌 Connecting to Remix.gg API...');
    
    // Check if game exists
    const checkResponse = await fetch(`${remixApiUrl}/games?name=${encodeURIComponent(config.name)}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    let game;
    if (checkResponse.ok) {
      const games = await checkResponse.json();
      const existing = games.data?.find((g: any) => g.name === config.name);
      
      if (existing) {
        console.log(`📱 Found existing game: ${existing.id}`);
        console.log('🔄 Updating game...\n');
        
        const updateResponse = await fetch(`${remixApiUrl}/games/${existing.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: config.description,
            code: htmlContent,
            status: 'published',
          }),
        });

        if (!updateResponse.ok) {
          throw new Error(`Update failed: ${updateResponse.statusText}`);
        }

        game = await updateResponse.json();
      } else {
        console.log('✨ Creating new game...\n');
        
        const createResponse = await fetch(`${remixApiUrl}/games`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: config.name,
            description: config.description,
            code: htmlContent,
            category: 'game',
            status: 'published',
          }),
        });

        if (!createResponse.ok) {
          const error = await createResponse.text();
          throw new Error(`Create failed: ${createResponse.status} - ${error}`);
        }

        game = await createResponse.json();
      }
    } else {
      // If API structure is different, try direct create
      console.log('✨ Creating new game...\n');
      
      const createResponse = await fetch(`${remixApiUrl}/games`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: config.name,
          description: config.description,
          code: htmlContent,
          category: 'game',
        }),
      });

      if (!createResponse.ok) {
        const error = await createResponse.text();
        throw new Error(`Create failed: ${createResponse.status} - ${error}`);
      }

      game = await createResponse.json();
    }

    console.log('✅ Deployment successful!\n');
    console.log(`🎮 Game: ${game.name || config.name}`);
    console.log(`📱 Game ID: ${game.id || 'N/A'}`);
    console.log(`🔗 View at: https://remix.gg/games/${game.id || game.slug || config.gameKey}\n`);

    return game;
  } catch (error: any) {
    console.error('❌ Deployment failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Verify REMIX_API_KEY is correct');
    console.log('   2. Check Remix.gg API documentation for endpoint structure');
    console.log('   3. Ensure API URL is correct (set REMIX_API_URL if needed)');
    process.exit(1);
  }
}

const gameName = process.argv[2];
const gameDescription = process.argv[3] || 'DreamNet game on Remix.gg';
const htmlPath = process.argv[4];

if (!gameName) {
  console.log('Usage: pnpm tsx scripts/deploy-to-remix.ts <game-name> [description] [html-path]');
  console.log('\nExample:');
  console.log('  pnpm tsx scripts/deploy-to-remix.ts "Dream Remix Arena" "Competitive remix battles" dist/standalone-games/remix/dream-remix-arena.html');
  console.log('\nEnvironment Variables:');
  console.log('  REMIX_API_KEY - Your Remix.gg API key');
  console.log('  REMIX_API_URL - Remix.gg API endpoint (default: https://api.remix.gg/v1)');
  process.exit(1);
}

deployToRemix({
  name: gameName,
  description: gameDescription,
  gameKey: gameName.toLowerCase().replace(/\s+/g, '-'),
  htmlPath,
}).catch(console.error);



