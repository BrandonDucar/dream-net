#!/usr/bin/env tsx
/**
 * Issue Domains for All DreamNet Verticals
 * 
 * Issues .dream domains for all proposed verticals
 * 
 * Usage: pnpm issue:all-verticals
 */

const DREAMNET_WALLET = process.env.DREAMNET_WALLET || '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e';
const DREAMNET_PASSPORT = process.env.DREAMNET_PASSPORT || 'dreamnet-main';
const API_URL = process.env.API_URL || 'http://localhost:3000';

// All vertical domains
const VERTICAL_DOMAINS = [
  // Core Verticals
  { name: 'agents', description: 'Agent Foundry - Custom hybrid agent creation' },
  { name: 'systems', description: 'DreamNet Systems - Infrastructure & documentation' },
  { name: 'social', description: 'Crypto Social Ecosystem' },
  
  // Expansion Verticals
  { name: 'stream', description: 'OTT Streaming - Dream-driven content' },
  { name: 'science', description: 'Science & Research - Dream-inspired research' },
  { name: 'travel', description: 'Travel - Dream destination matching' },
  
  // Specialized Verticals
  { name: 'military', description: 'Military & Defense - Security & threat intelligence' },
  { name: 'metals', description: 'Precious Metals - Dream-backed trading' },
  { name: 'gov', description: 'DreamState & Government - Digital citizenship' },
  
  // Music & Audio
  { name: 'dreamstar', description: 'DreamStar - AI music generation & audio' },
  
  // Community Structures
  { name: 'pods', description: 'Pods, Packs, Pods - Community organization' },
  
  // Additional Core Domains
  { name: 'dreamkeeper', description: 'DreamKeeper - Agent monitoring' },
  { name: 'dream-cloud', description: 'Dream Cloud - Cloud storage' },
  { name: 'dream-nodes', description: 'Dream Nodes - Network infrastructure' },
  { name: 'dream-vault', description: 'Dream Vault - Marketplace' },
  { name: 'dream-feed', description: 'Dream Feed - Social feed' },
  { name: 'dream-ops', description: 'DreamOps - Operations launcher' },
  { name: 'dream-scope', description: 'DreamScope - Monitoring dashboard' },
];

async function issueDomain(name: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_URL}/api/domains/issue/dream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passportId: DREAMNET_PASSPORT,
        walletAddress: DREAMNET_WALLET,
        requestedName: name,
        tier: 'premium',
      }),
    });
    
    const data = await response.json();
    return {
      success: response.ok && data.success,
      message: data.message || data.error || 'Unknown error',
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function checkServer(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🌐 Issuing Domains for All DreamNet Verticals\n');
  console.log('='.repeat(70));
  console.log(`📋 Configuration:`);
  console.log(`   Wallet: ${DREAMNET_WALLET}`);
  console.log(`   Passport: ${DREAMNET_PASSPORT}`);
  console.log(`   API URL: ${API_URL}`);
  console.log(`   Total Verticals: ${VERTICAL_DOMAINS.length}`);
  console.log('='.repeat(70));
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('\n⚠️  Server is not running!');
    console.log('💡 Start server: pnpm dev:app');
    console.log('\n📋 Verticals to be issued:\n');
    VERTICAL_DOMAINS.forEach(v => {
      console.log(`   • ${v.name}.dream - ${v.description}`);
    });
    process.exit(0);
  }
  
  console.log('\n✅ Server is running!\n');
  console.log('🎫 Issuing domains...\n');
  
  const results: Array<{ name: string; success: boolean; message: string }> = [];
  
  for (const vertical of VERTICAL_DOMAINS) {
    console.log(`   Issuing ${vertical.name}.dream...`);
    const result = await issueDomain(vertical.name);
    results.push({ name: vertical.name, ...result });
    
    if (result.success) {
      console.log(`   ✅ ${vertical.name}.dream - ${vertical.description}`);
    } else {
      console.log(`   ❌ ${vertical.name}.dream - ${result.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Issuance Summary:\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successfully issued: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}\n`);
  
  if (successful.length > 0) {
    console.log('Issued domains:');
    successful.forEach(r => {
      const vertical = VERTICAL_DOMAINS.find(v => v.name === r.name);
      console.log(`   • ${r.name}.dream - ${vertical?.description || ''}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\nFailed domains:');
    failed.forEach(r => console.log(`   • ${r.name}.dream - ${r.message}`));
  }
  
  console.log('\n💡 Next Steps:');
  console.log('   1. Configure DNS routing for each domain');
  console.log('   2. Deploy vertical services');
  console.log('   3. Set up SSL certificates');
  console.log('   4. Test domain resolution');
}

main().catch(console.error);

