/**
 * Deploy all Base mini-apps
 */

import { BaseMiniApps } from '@dreamnet/base-mini-apps';

async function main() {
  console.log('===============================================');
  console.log(' 🚀 Deploying All Base Mini-Apps');
  console.log('===============================================\n');

  // Create default apps if they don't exist
  const existing = BaseMiniApps.listMiniApps();
  if (existing.length === 0) {
    console.log('📱 Creating default mini-apps...');
    BaseMiniApps.createDefaultMiniApps();
  }

  const apps = BaseMiniApps.listMiniApps();
  console.log(`Found ${apps.length} mini-apps to deploy\n`);

  for (const app of apps) {
    console.log(`📱 ${app.name}`);
    console.log(`   Category: ${app.category}`);
    console.log(`   Status: ${app.status}`);
    console.log(`   Features: ${app.features.join(', ')}`);
    if (app.requiresPassport) {
      console.log(`   Requires Passport: ${app.passportTier?.join(', ') || 'any'}`);
    }
    console.log(`   Integrates: ${app.integratesWith?.join(', ') || 'none'}`);
    console.log('');
  }

  console.log('===============================================');
  console.log(' ✅ Mini-Apps Ready for Deployment');
  console.log('===============================================');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   1. Compile Solidity contracts');
  console.log('   2. Deploy to Base mainnet (8453)');
  console.log('   3. Update app.contractAddress for each');
  console.log('   4. Build frontend UIs');
  console.log('   5. Launch on Base ecosystem');
  console.log('');
}

main().catch(console.error);

