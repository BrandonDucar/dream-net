#!/usr/bin/env tsx
/**
 * Add Wallets to Coin Sensei
 * Adds all your wallets to Coin Sensei for portfolio tracking
 */

const API_URL = process.env.API_URL || process.env.VITE_API_URL || 'http://localhost:3000';

const wallets = [
  // VeChain wallets
  {
    address: '0x73d4c431ed1fc2126cca2597d9ace1b14de8474e',
    chain: 'vechain',
    label: 'My Active VeChain Wallet',
  },
  {
    address: '0x064915fAD67E70D2Fa708B14af9e01B0083a1B9E',
    chain: 'vechain',
    label: 'Tangem Wallet (Locked)',
  },
  // Solana wallet
  {
    address: '9jAUEPpb74rJNrgfjAQzDpLgweCbipgdN1fujupFZZj',
    chain: 'solana',
    label: 'My Solana Wallet',
  },
  // Owner wallet (Base/Ethereum)
  {
    address: '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e',
    chain: 'base',
    label: 'Owner Wallet (Base)',
  },
];

async function addWalletsToCoinSensei() {
  console.log('🪙 Adding Wallets to Coin Sensei\n');
  console.log('='.repeat(50));

  try {
    const response = await fetch(`${API_URL}/api/coinsensei/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallets: wallets.map(w => ({
          address: w.address,
          chain: w.chain,
          label: w.label,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    console.log('✅ Successfully added wallets to Coin Sensei!\n');
    console.log('📊 Portfolio Summary:');
    console.log(`   Total Value: $${result.summary?.total_value || 'N/A'}`);
    console.log(`   Positions: ${result.positions?.length || 0}`);
    console.log(`   Wallets Tracked: ${wallets.length}\n`);

    console.log('📋 Wallets Added:');
    wallets.forEach((wallet, i) => {
      console.log(`   ${i + 1}. ${wallet.label}`);
      console.log(`      Address: ${wallet.address}`);
      console.log(`      Chain: ${wallet.chain}\n`);
    });

    if (result.hygiene_issues && result.hygiene_issues.length > 0) {
      console.log('⚠️  Data Hygiene Issues:');
      result.hygiene_issues.forEach((issue: any) => {
        console.log(`   - ${issue.message}`);
      });
      console.log('');
    }

    if (result.dca_suggestions) {
      console.log('💡 DCA Suggestions Available');
    }

    if (result.rebalance_suggestions) {
      console.log('💡 Rebalance Suggestions Available');
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n✨ All wallets are now tracked in Coin Sensei!');
    console.log('   View portfolio at: /coinsensei mini-app');

  } catch (error: any) {
    console.error('❌ Error adding wallets:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Server is running (pnpm dev:app)');
    console.log('   2. API_URL is correct (default: http://localhost:5000)');
    console.log('   3. Coin Sensei endpoint is available');
    process.exit(1);
  }
}

addWalletsToCoinSensei();

