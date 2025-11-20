#!/usr/bin/env tsx
/**
 * List Admin Wallets
 * Retrieves admin wallet addresses from environment variables
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
const envPath = join(process.cwd(), '.env');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Also check for .env.local, .env.production, etc.
const envFiles = ['.env.local', '.env.production', '.env.development'];
for (const file of envFiles) {
  const filePath = join(process.cwd(), file);
  if (existsSync(filePath)) {
    dotenv.config({ path: filePath, override: false });
  }
}

function identifyWalletType(address: string): string {
  // Ethereum/Base/VeChain addresses start with 0x and are 42 chars
  if (address.startsWith('0x') && address.length === 42) {
    // VeChain uses same format as Ethereum
    return 'ethereum/base/vechain';
  }
  // Solana addresses are base58, typically 32-44 chars, no 0x prefix
  if (!address.startsWith('0x') && address.length >= 32 && address.length <= 44) {
    return 'solana';
  }
  return 'unknown';
}

function main() {
  console.log('🔍 Retrieving Admin Wallets\n');
  console.log('='.repeat(50));

  // Get ADMIN_WALLETS from environment
  const adminWalletsEnv = process.env.ADMIN_WALLETS;
  
  if (!adminWalletsEnv) {
    console.log('⚠️  ADMIN_WALLETS environment variable not set');
    console.log('\n📋 Default fallback wallets (from code):');
    const defaultWallets = [
      '0xAbCdEf1234567890abcdef1234567890aBcDeF01',
      '0x1234567890abcdef1234567890abcdef12345678',
      '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e',
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    ];
    defaultWallets.forEach((wallet, i) => {
      const type = identifyWalletType(wallet);
      console.log(`   ${i + 1}. ${wallet} (${type})`);
    });
    console.log('\n💡 Set ADMIN_WALLETS env var to override defaults');
    return;
  }

  // Parse comma-separated wallets
  const wallets = adminWalletsEnv
    .split(',')
    .map(w => w.trim())
    .filter(w => w.length > 0);

  console.log(`✅ Found ${wallets.length} admin wallet(s) in ADMIN_WALLETS:\n`);

  const walletGroups: Record<string, string[]> = {
    ethereum: [],
    solana: [],
    vechain: [],
    unknown: []
  };

  wallets.forEach((wallet, i) => {
    const type = identifyWalletType(wallet);
    console.log(`${i + 1}. ${wallet}`);
    console.log(`   Type: ${type}`);
    
    if (type.includes('ethereum')) {
      walletGroups.ethereum.push(wallet);
    } else if (type === 'solana') {
      walletGroups.solana.push(wallet);
    } else {
      walletGroups.unknown.push(wallet);
    }
    console.log('');
  });

  // Group by type
  console.log('\n📊 Grouped by Chain:\n');
  if (walletGroups.ethereum.length > 0) {
    console.log('🔷 Ethereum/Base/VeChain:');
    walletGroups.ethereum.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }
  if (walletGroups.solana.length > 0) {
    console.log('🟣 Solana:');
    walletGroups.solana.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }
  if (walletGroups.unknown.length > 0) {
    console.log('❓ Unknown format:');
    walletGroups.unknown.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }

  // Check for specific wallets mentioned
  console.log('\n🔍 Looking for specific wallets:\n');
  const vechainWallet = wallets.find(w => 
    w.toLowerCase() !== '0x742d35cc6527cc3de8b36b5c81b8a0ea4d5d3a8e' && // Owner wallet
    w.toLowerCase() !== '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' && // Other known
    w.startsWith('0x')
  );
  
  const solanaWallet = wallets.find(w => !w.startsWith('0x'));

  if (vechainWallet) {
    console.log(`✅ VeChain wallet found: ${vechainWallet}`);
  } else {
    console.log('⚠️  No additional VeChain wallet found (besides owner wallet)');
  }

  if (solanaWallet) {
    console.log(`✅ Solana wallet found: ${solanaWallet}`);
  } else {
    console.log('⚠️  No Solana wallet found');
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n💡 To add these to Coin Sensei:');
  console.log('   1. Use the /api/coinsensei/analyze endpoint');
  console.log('   2. Or add via the Coin Sensei mini-app UI');
  console.log('\n📝 Update MY_WALLETS.md with these addresses');
}

main();

