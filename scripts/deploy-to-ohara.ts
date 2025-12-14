/**
 * Deploy Game/App to Ohara Platform
 * Builds standalone game and deploys via Ohara API
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { oharaClient } from '../server/integrations/oharaClient.js';

config({ path: '.env' });
config({ path: '.env.local' });

interface DeployConfig {
  name: string;
  description: string;
  gameKey: string;
  htmlPath?: string;
}

async function deployToOhara(config: DeployConfig) {
  console.log(`🚀 Deploying "${config.name}" to Ohara...\n`);

  // Check API key
  if (!process.env.OHARA_API_KEY) {
    console.error('❌ OHARA_API_KEY not set');
    console.log('💡 Get your API key from: https://ohara.ai/api/keys');
    process.exit(1);
  }

  // Verify connection
  console.log('🔌 Verifying Ohara connection...');
  const connected = await oharaClient.verifyConnection();
  if (!connected) {
    console.error('❌ Failed to connect to Ohara API');
    console.log('💡 Check your OHARA_API_KEY and network connection');
    process.exit(1);
  }
  console.log('✅ Connected to Ohara API\n');

  // Read HTML content if path provided
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
</head>
<body>
  <div id="root"></div>
  <script>
    // Game will be injected here
    console.log('${config.name} loaded');
  </script>
</body>
</html>`;
    console.log('📝 Using generated HTML template\n');
  }

  try {
    // Check if app already exists
    console.log('🔍 Checking for existing app...');
    const existingApps = await oharaClient.listApps();
    const existingApp = existingApps.find(app => app.name === config.name);

    let app;
    if (existingApp) {
      console.log(`📱 Found existing app: ${existingApp.id}`);
      console.log('🔄 Updating app...\n');
      app = await oharaClient.updateApp(existingApp.id, {
        description: config.description,
        code: htmlContent,
        status: 'published',
      });
    } else {
      console.log('✨ Creating new app...\n');
      app = await oharaClient.createApp(config.name, config.description);
      if (app) {
        // Update with code
        app = await oharaClient.updateApp(app.id, {
          code: htmlContent,
          status: 'published',
        });
      }
    }

    if (app) {
      console.log('✅ Deployment successful!\n');
      console.log(`📱 App ID: ${app.id}`);
      console.log(`📝 Name: ${app.name}`);
      console.log(`📊 Status: ${app.status || 'published'}`);
      console.log(`🔗 View at: https://ohara.ai/apps/${app.id}\n`);
      return app;
    } else {
      throw new Error('Failed to create/update app');
    }
  } catch (error: any) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

const gameName = process.argv[2];
const gameDescription = process.argv[3] || 'DreamNet game/app';
const htmlPath = process.argv[4];

if (!gameName) {
  console.log('Usage: pnpm tsx scripts/deploy-to-ohara.ts <game-name> [description] [html-path]');
  console.log('\nExample:');
  console.log('  pnpm tsx scripts/deploy-to-ohara.ts "Jaggy Stealth Run" "Stealth action game" dist/standalone-games/ohara/jaggy-stealth-run.html');
  process.exit(1);
}

deployToOhara({
  name: gameName,
  description: gameDescription,
  gameKey: gameName.toLowerCase().replace(/\s+/g, '-'),
  htmlPath,
}).catch(console.error);



