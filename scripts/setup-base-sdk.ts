/**
 * Setup Base Mini App SDK for a Mini App
 * Adds SDK initialization and manifest setup
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface SetupConfig {
  miniappPath: string;
  miniappName: string;
  homeUrl: string;
  ownerAddress?: string;
}

export function setupBaseSDK(config: SetupConfig): void {
  const { miniappPath, miniappName, homeUrl, ownerAddress } = config;

  console.log(`\n🔧 Setting up Base SDK for: ${miniappName}`);
  console.log(`   Path: ${miniappPath}`);
  console.log(`   URL: ${homeUrl}\n`);

  // 1. Check if package.json exists and add SDK if needed
  const packageJsonPath = join(miniappPath, 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    if (!packageJson.dependencies['@farcaster/miniapp-sdk']) {
      console.log(`📦 Adding @farcaster/miniapp-sdk to dependencies...`);
      packageJson.dependencies = packageJson.dependencies || {};
      packageJson.dependencies['@farcaster/miniapp-sdk'] = '^1.0.0';
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`✅ SDK added to package.json`);
    } else {
      console.log(`✅ SDK already in dependencies`);
    }
  }

  // 2. Create/update manifest file
  const manifestDir = join(miniappPath, 'public', '.well-known');
  const manifestPath = join(manifestDir, 'farcaster.json');

  if (!existsSync(manifestDir)) {
    mkdirSync(manifestDir, { recursive: true });
  }

  const manifest = {
    accountAssociation: {
      header: '',
      payload: '',
      signature: '',
    },
    baseBuilder: {
      ownerAddress: ownerAddress || '0x',
    },
    miniapp: {
      version: '1',
      name: miniappName.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      homeUrl: homeUrl,
      iconUrl: `${homeUrl}/icon.png`,
      splashImageUrl: `${homeUrl}/splash.png`,
      splashBackgroundColor: '#000000',
      webhookUrl: `${homeUrl}/api/webhook`,
      subtitle: `View your ${miniappName.replace('-', ' ')}`,
      description: `Check your ${miniappName.replace('-', ' ')} on Base L2`,
      screenshotUrls: [
        `${homeUrl}/screenshot1.png`,
        `${homeUrl}/screenshot2.png`,
      ],
      primaryCategory: 'utility',
      tags: [miniappName, 'base', 'dreamnet'],
      heroImageUrl: `${homeUrl}/hero.png`,
      tagline: `Check ${miniappName.replace('-', ' ')} instantly`,
      ogTitle: miniappName.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      ogDescription: `View your ${miniappName.replace('-', ' ')} on Base L2`,
      ogImageUrl: `${homeUrl}/og-image.png`,
      noindex: false,
    },
  };

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest created at: ${manifestPath}`);

  // 3. Check if index.html has embed metadata
  const indexHtmlPath = join(miniappPath, 'index.html');
  if (existsSync(indexHtmlPath)) {
    const indexHtml = readFileSync(indexHtmlPath, 'utf-8');
    
    if (!indexHtml.includes('fc:miniapp')) {
      console.log(`⚠️  index.html missing fc:miniapp metadata`);
      console.log(`   Add this to <head>:`);
      console.log(`   <meta name="fc:miniapp" content='{"version":"next","imageUrl":"${homeUrl}/embed-image.png","button":{"title":"Launch","action":{"type":"launch_miniapp","name":"${manifest.miniapp.name}","url":"${homeUrl}"}}}' />`);
    } else {
      console.log(`✅ Embed metadata found in index.html`);
    }
  }

  console.log(`\n✨ Setup complete!`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Install dependencies: cd ${miniappPath} && pnpm install`);
  console.log(`   2. Build: cd ${miniappPath} && pnpm build`);
  console.log(`   3. Deploy to Vercel`);
  console.log(`   4. Update manifest with actual Vercel URL`);
  console.log(`   5. Setup account association via Base Build tool`);
  console.log(`   6. Add screenshots (required for featured apps)`);
  console.log(`   7. Test using Base Build Preview tool\n`);
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const miniappName = args[0] || 'token-balance';
  const miniappPath = args[1] || `miniapps/${miniappName}`;
  const homeUrl = args[2] || `https://${miniappName}-dreamnet.vercel.app`;
  const ownerAddress = args[3];

  setupBaseSDK({
    miniappPath,
    miniappName,
    homeUrl,
    ownerAddress,
  });
}

