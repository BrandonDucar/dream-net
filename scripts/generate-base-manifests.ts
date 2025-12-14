/**
 * Generate Base Mini App Manifests
 * Creates manifest files for all mini apps to submit to Base
 */

import { MINI_APPS } from '../packages/base-mini-apps/frontend/index';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestDir = path.join(__dirname, '..', 'public', '.well-known', 'base-mini-apps');

// Ensure directory exists
if (!fs.existsSync(manifestDir)) {
  fs.mkdirSync(manifestDir, { recursive: true });
  console.log(`📁 Created directory: ${manifestDir}`);
}

// Generate manifest for each app
let generated = 0;
let skipped = 0;

Object.entries(MINI_APPS).forEach(([appId, app]) => {
  const manifest = {
    name: app.name,
    description: app.description || `${app.name} - A DreamNet mini app`,
    iconUrl: `https://dreamnet.ink/icons/${appId}.png`,
    splashImageUrl: `https://dreamnet.ink/splash/${appId}.png`,
    screenshots: [
      `https://dreamnet.ink/screenshots/${appId}-1.png`,
      `https://dreamnet.ink/screenshots/${appId}-2.png`
    ],
    category: app.category,
    url: `https://dreamnet.ink/miniapps/${appId}`,
    version: "1.0.0",
    developer: {
      name: "DreamNet",
      url: "https://dreamnet.ink",
      email: "dev@dreamnet.ink"
    },
    tags: [app.category, ...(app.minTier ? [app.minTier] : [])],
    requiresWallet: app.requiresPassport || false,
    chainIds: [8453], // Base mainnet
    contractAddresses: app.contractAddress ? [app.contractAddress] : [],
    metadata: {
      passportTier: app.minTier || null,
      contractName: app.contractName || null
    }
  };

  const manifestPath = path.join(manifestDir, `${appId}.json`);
  
  try {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Generated manifest for: ${app.name} (${appId})`);
    generated++;
  } catch (error) {
    console.error(`❌ Failed to generate manifest for ${appId}:`, error);
    skipped++;
  }
});

// Generate index manifest listing all apps
const indexManifest = {
  name: "DreamNet Mini Apps",
  description: "Collection of 59+ mini apps built on DreamNet",
  version: "1.0.0",
  apps: Object.keys(MINI_APPS).map(appId => ({
    id: appId,
    name: MINI_APPS[appId as keyof typeof MINI_APPS].name,
    manifestUrl: `https://dreamnet.ink/.well-known/base-mini-apps/${appId}.json`,
    url: `https://dreamnet.ink/miniapps/${appId}`
  }))
};

const indexPath = path.join(manifestDir, 'index.json');
fs.writeFileSync(indexPath, JSON.stringify(indexManifest, null, 2));
console.log(`✅ Generated index manifest`);

console.log(`\n📊 Summary:`);
console.log(`   Generated: ${generated} manifests`);
console.log(`   Skipped: ${skipped} manifests`);
console.log(`   Total apps: ${Object.keys(MINI_APPS).length}`);
console.log(`\n📁 Manifests saved to: ${manifestDir}`);
console.log(`\n🚀 Next steps:`);
console.log(`   1. Create icons (512x512px) → public/icons/`);
console.log(`   2. Create splash images (1200x630px) → public/splash/`);
console.log(`   3. Create screenshots → public/screenshots/`);
console.log(`   4. Deploy to dreamnet.ink`);
console.log(`   5. Submit to Base Developer Portal`);

