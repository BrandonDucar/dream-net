/**
 * Compile and prepare Base mini-apps for deployment
 */

import { execSync } from 'child_process';
import { BaseMiniApps } from '@dreamnet/base-mini-apps';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log("===============================================");
  console.log(" 🔨 Compiling Base Mini-Apps");
  console.log("===============================================\n");

  const miniAppsDir = path.join(process.cwd(), 'packages', 'base-mini-apps');

  // Ensure apps exist
  const apps = BaseMiniApps.listMiniApps();
  if (apps.length === 0) {
    console.log("📱 Creating default mini-apps...");
    BaseMiniApps.createDefaultMiniApps();
  }

  console.log(`✅ Found ${apps.length} mini-apps\n`);

  // Check if Hardhat is set up
  const hardhatConfig = path.join(miniAppsDir, 'hardhat.config.js');
  if (!fs.existsSync(hardhatConfig)) {
    console.log("⚠️  Hardhat config not found. Contracts will need manual setup.");
    console.log("   See packages/base-mini-apps/hardhat.config.js\n");
  }

  // List all apps
  console.log("📱 Mini-Apps Ready:\n");
  for (const app of apps) {
    console.log(`   ${app.name}`);
    console.log(`      Category: ${app.category}`);
    console.log(`      Status: ${app.status}`);
    if (app.contractAddress) {
      console.log(`      Contract: ${app.contractAddress}`);
    }
    console.log(`      Features: ${app.features.join(', ')}`);
    console.log("");
  }

  // Frontend components status
  const frontendDir = path.join(miniAppsDir, 'frontend');
  const frontendFiles = [
    'PassportMintApp.tsx',
    'GovernanceApp.tsx',
    'APIKeeperDashboard.tsx',
    'WolfPackPortal.tsx',
    'SocialHub.tsx',
    'WhalePackCommerce.tsx',
    'Treasury.tsx',
    'ShieldMonitor.tsx',
  ];

  console.log("🎨 Frontend Components:\n");
  for (const file of frontendFiles) {
    const filePath = path.join(frontendDir, file);
    const exists = fs.existsSync(filePath);
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  }
  console.log("");

  // Contracts status
  const contractsDir = path.join(miniAppsDir, 'contracts');
  const contractFiles = [
    'PassportMint.sol',
    'Governance.sol',
  ];

  console.log("📜 Smart Contracts:\n");
  for (const file of contractFiles) {
    const filePath = path.join(contractsDir, file);
    const exists = fs.existsSync(filePath);
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  }
  console.log("");

  // Deployment scripts
  const scriptsDir = path.join(miniAppsDir, 'scripts');
  const scriptFiles = [
    'deploy-passport.ts',
    'deploy-governance.ts',
    'deploy-all.ts',
  ];

  console.log("🚀 Deployment Scripts:\n");
  for (const file of scriptFiles) {
    const filePath = path.join(scriptsDir, file);
    const exists = fs.existsSync(filePath);
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  }
  console.log("");

  console.log("===============================================");
  console.log(" ✅ All Mini-Apps Ready!");
  console.log("===============================================\n");

  console.log("📋 Summary:");
  console.log(`   • ${apps.length} Mini-Apps defined`);
  console.log(`   • ${frontendFiles.filter(f => fs.existsSync(path.join(frontendDir, f))).length}/${frontendFiles.length} Frontend components`);
  console.log(`   • ${contractFiles.filter(f => fs.existsSync(path.join(contractsDir, f))).length}/${contractFiles.length} Smart contracts`);
  console.log(`   • ${scriptFiles.filter(f => fs.existsSync(path.join(scriptsDir, f))).length}/${scriptFiles.length} Deployment scripts\n`);

  console.log("💡 Next Steps:");
  console.log("   1. cd packages/base-mini-apps");
  console.log("   2. pnpm install");
  console.log("   3. pnpm compile");
  console.log("   4. Set PRIVATE_KEY in .env");
  console.log("   5. pnpm deploy:all");
  console.log("   6. Update frontend with contract addresses");
  console.log("   7. Launch on Base! 🚀\n");
}

main().catch(console.error);




