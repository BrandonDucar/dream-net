#!/usr/bin/env tsx
/**
 * Simple script to add wallets to Coin Sensei
 * Run this once the server is running
 */

const API_URL = 'http://localhost:3000';

const wallets = [
  { address: '0x73d4c431ed1fc2126cca2597d9ace1b14de8474e', chain: 'vechain', label: 'My Active VeChain Wallet' },
  { address: '0x064915fAD67E70D2Fa708B14af9e01B0083a1B9E', chain: 'vechain', label: 'Tangem Wallet (Locked)' },
  { address: '9jAUEPpb74rJNrgfjAQzDpLgweCbipgdN1fujupFZZj', chain: 'solana', label: 'My Solana Wallet' },
  { address: '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e', chain: 'base', label: 'Owner Wallet (Base)' },
];

async function main() {
  console.log('🪙 Adding Wallets to Coin Sensei\n');
  
  try {
    const response = await fetch(`${API_URL}/api/coinsensei/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallets }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const result = await response.json();
    
    console.log('✅ Successfully added wallets!\n');
    console.log(`📊 Total Value: $${result.summary?.total_value || 'N/A'}`);
    console.log(`📈 Positions: ${result.positions?.length || 0}\n`);
    console.log('📋 Wallets Added:');
    wallets.forEach((w, i) => console.log(`   ${i + 1}. ${w.label} (${w.chain})`));
    
  } catch (error: any) {
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      console.log('❌ Server not running yet.');
      console.log('\n💡 Start the server first:');
      console.log('   pnpm dev:app');
      console.log('\n   Then run this script again.');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

main();

