#!/usr/bin/env tsx
/**
 * Deploy Base Contracts Script
 * Uses PRIVATE_KEY from environment variables
 * Deploys CardForgeNFT and other contracts to Base
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const baseMiniAppsDir = path.join(rootDir, 'packages', 'base-mini-apps');

async function deployContracts() {
  console.log('🚀 Deploying Base Contracts...\n');

  // Check for private key
  const privateKey = process.env.PRIVATE_KEY || process.env.BASE_DEPLOYER_PRIVATE_KEY;
  
  if (!privateKey) {
    console.error('❌ ERROR: PRIVATE_KEY or BASE_DEPLOYER_PRIVATE_KEY not found in environment variables');
    console.error('\nPlease set one of these environment variables:');
    console.error('  - PRIVATE_KEY=0xYourPrivateKey');
    console.error('  - BASE_DEPLOYER_PRIVATE_KEY=0xYourPrivateKey');
    console.error('\nOr create .env file in packages/base-mini-apps/ with:');
    console.error('  PRIVATE_KEY=0xYourPrivateKey');
    process.exit(1);
  }

  // Check if private key looks valid
  if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
    console.error('❌ ERROR: Invalid private key format');
    console.error('Private key should start with 0x and be 66 characters long');
    process.exit(1);
  }

  console.log('✅ Private key found in environment variables');
  console.log(`📍 Deployer address: ${getAddressFromPrivateKey(privateKey)}\n`);

  // Create .env file in base-mini-apps if it doesn't exist
  const envPath = path.join(baseMiniAppsDir, '.env');
  if (!existsSync(envPath)) {
    console.log('📝 Creating .env file in packages/base-mini-apps/...');
    writeFileSync(envPath, `PRIVATE_KEY=${privateKey}\n`, 'utf-8');
    console.log('✅ .env file created\n');
  } else {
    // Update existing .env file
    const envContent = readFileSync(envPath, 'utf-8');
    if (!envContent.includes('PRIVATE_KEY=')) {
      writeFileSync(envPath, `${envContent}\nPRIVATE_KEY=${privateKey}\n`, 'utf-8');
      console.log('✅ Updated .env file with PRIVATE_KEY\n');
    } else {
      console.log('✅ .env file already has PRIVATE_KEY\n');
    }
  }

  // Change to base-mini-apps directory
  process.chdir(baseMiniAppsDir);

  try {
    // Compile contracts first
    console.log('📦 Compiling contracts...');
    execSync('pnpm run compile', { stdio: 'inherit' });
    console.log('✅ Contracts compiled\n');

    // Deploy CardForgeNFT
    console.log('🎴 Deploying CardForgeNFT...');
    execSync('pnpm run deploy:card-forge', { stdio: 'inherit' });
    console.log('✅ CardForgeNFT deployed!\n');

    // Read deployment.json to show addresses
    const deploymentPath = path.join(baseMiniAppsDir, 'contracts', 'deployment.json');
    if (existsSync(deploymentPath)) {
      const deployments = JSON.parse(readFileSync(deploymentPath, 'utf-8'));
      console.log('📋 Deployed Contracts:');
      if (deployments.base?.contracts) {
        Object.entries(deployments.base.contracts).forEach(([name, address]) => {
          console.log(`   ${name}: ${address}`);
          console.log(`   Explorer: https://basescan.org/address/${address}`);
        });
      }
    }

    console.log('\n🎉 Deployment complete!');
  } catch (error: any) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

function getAddressFromPrivateKey(privateKey: string): string {
  // Simple address derivation (for display only)
  // In production, use ethers.js or similar
  try {
    const { ethers } = require('ethers');
    const wallet = new ethers.Wallet(privateKey);
    return wallet.address;
  } catch {
    return '0x...' + privateKey.slice(-8);
  }
}

deployContracts().catch(console.error);

