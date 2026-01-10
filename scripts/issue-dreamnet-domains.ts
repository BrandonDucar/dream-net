#!/usr/bin/env tsx
/**
 * Issue DreamNet Domains to DreamNet Itself
 * 
 * Issues .dream and .sheep domains to DreamNet's main passport/wallet
 * for use as vertical domains and sub-services.
 * 
 * Usage: pnpm issue:dreamnet-domains
 */

import { execSync } from 'child_process';

const DREAMNET_WALLET = process.env.DREAMNET_WALLET || '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e';
const DREAMNET_PASSPORT = process.env.DREAMNET_PASSPORT || 'dreamnet-main';
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Core vertical domains to issue
const CORE_DREAM_DOMAINS = [
  'dreamkeeper',      // DreamKeeper agent dashboard
  'dream-cloud',      // Dream Cloud hub
  'dream-nodes',      // Dream Nodes ecosystem
  'dream-vault',      // Dream Vault marketplace
  'dream-feed',       // Dream Feed social
  'dream-ops',        // DreamOps launcher
  'dream-scope',      // DreamScope monitoring
  'deploykeeper',     // DeployKeeper operations
  'relaybot',         // RelayBot messaging
  'envkeeper',        // EnvKeeper configuration
  'mesh',             // Neural Mesh network
  'star-bridge',      // Star Bridge Lungs
];

const SHEEP_DOMAINS = [
  'sheep-staking',    // SHEEP token staking
  'sheep-vault',      // SHEEP vaults
  'sheep-rewards',    // SHEEP rewards system
];

interface IssueResult {
  domain: string;
  success: boolean;
  message: string;
  data?: any;
}

async function issueDreamDomain(name: string): Promise<IssueResult> {
  const domain = `${name}.dream`;
  
  try {
    console.log(`   Issuing ${domain}...`);
    
    const response = await fetch(`${API_URL}/api/domains/issue/dream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        passportId: DREAMNET_PASSPORT,
        walletAddress: DREAMNET_WALLET,
        requestedName: name,
        tier: 'premium',
      }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      return {
        domain,
        success: true,
        message: `✅ Issued ${domain}`,
        data: data.domain,
      };
    } else {
      return {
        domain,
        success: false,
        message: `❌ Failed: ${data.message || data.error || 'Unknown error'}`,
      };
    }
  } catch (error: any) {
    return {
      domain,
      success: false,
      message: `❌ Error: ${error.message}`,
    };
  }
}

async function issueSheepDomain(name: string): Promise<IssueResult> {
  const domain = `${name}.dream`; // .sheep domains might resolve to .dream
  
  try {
    console.log(`   Issuing ${domain}...`);
    
    const response = await fetch(`${API_URL}/api/domains/issue/sheep`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        passportId: DREAMNET_PASSPORT,
        walletAddress: DREAMNET_WALLET,
        requestedName: name,
        tier: 'premium',
      }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      return {
        domain,
        success: true,
        message: `✅ Issued ${domain}`,
        data: data.domain,
      };
    } else {
      return {
        domain,
        success: false,
        message: `❌ Failed: ${data.message || data.error || 'Unknown error'}`,
      };
    }
  } catch (error: any) {
    return {
      domain,
      success: false,
      message: `❌ Error: ${error.message}`,
    };
  }
}

async function checkServerRunning(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🎫 Issuing DreamNet Domains to DreamNet Itself\n');
  console.log('='.repeat(60));
  console.log(`📋 Configuration:`);
  console.log(`   Wallet: ${DREAMNET_WALLET}`);
  console.log(`   Passport: ${DREAMNET_PASSPORT}`);
  console.log(`   API URL: ${API_URL}`);
  console.log('='.repeat(60));
  
  // Check if server is running
  console.log('\n🔍 Checking if server is running...');
  const serverRunning = await checkServerRunning();
  
  if (!serverRunning) {
    console.log('   ⚠️  Server is not running!');
    console.log('   💡 Start the server with: pnpm dev:app');
    console.log('   💡 Or set API_URL environment variable to point to running server');
    console.log('\n📋 Domains that will be issued:');
    console.log(`   .dream domains (${CORE_DREAM_DOMAINS.length}):`);
    CORE_DREAM_DOMAINS.forEach(name => console.log(`      - ${name}.dream`));
    console.log(`   .sheep domains (${SHEEP_DOMAINS.length}):`);
    SHEEP_DOMAINS.forEach(name => console.log(`      - ${name}.dream`));
    console.log('\n💡 Run this script again after starting the server to issue domains.');
    process.exit(0);
  }
  
  console.log('   ✅ Server is running!\n');
  
  const results: IssueResult[] = [];
  
  // Issue .dream domains
  console.log('🌐 Issuing .dream domains...\n');
  for (const name of CORE_DREAM_DOMAINS) {
    const result = await issueDreamDomain(name);
    results.push(result);
    console.log(`   ${result.message}`);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🐑 Issuing .sheep domains...\n');
  for (const name of SHEEP_DOMAINS) {
    const result = await issueSheepDomain(name);
    results.push(result);
    console.log(`   ${result.message}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Issuance Summary:\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successfully issued: ${successful.length}/${results.length}`);
  successful.forEach(r => console.log(`   ${r.domain}`));
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
    failed.forEach(r => console.log(`   ${r.domain}: ${r.message}`));
  }
  
  // List all domains
  console.log('\n' + '='.repeat(60));
  console.log('📋 All Issued Domains:\n');
  
  try {
    const listResponse = await fetch(`${API_URL}/api/domains/list`);
    const listData = await listResponse.json();
    
    if (listData.success && listData.domains) {
      console.log(`   Total domains: ${listData.count}`);
      listData.domains.slice(0, 20).forEach((domain: any) => {
        console.log(`   - ${domain.domain} (${domain.type || 'unknown'})`);
      });
      if (listData.count > 20) {
        console.log(`   ... and ${listData.count - 20} more`);
      }
    }
  } catch (error: any) {
    console.log(`   ⚠️  Could not fetch domain list: ${error.message}`);
  }
  
  console.log('\n💡 Next Steps:');
  console.log('   1. Configure DNS routing for each domain');
  console.log('   2. Deploy services to each domain');
  console.log('   3. Set up SSL certificates');
  console.log('   4. Test domain resolution');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

