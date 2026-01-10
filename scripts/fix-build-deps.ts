#!/usr/bin/env tsx
/**
 * Fix Build Dependencies
 * 
 * Ensures all dependencies are properly installed and versions match
 * 
 * Usage: pnpm fix:build-deps
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

console.log('🔧 Fixing build dependencies...\n');

// Step 1: Ensure versions match
console.log('1️⃣ Checking dependency versions...');
const rootPackage = JSON.parse(readFileSync('package.json', 'utf-8'));
const clientPackage = JSON.parse(readFileSync('client/package.json', 'utf-8'));

// Align @tanstack versions
if (rootPackage.dependencies['@tanstack/react-query'] !== clientPackage.dependencies['@tanstack/react-query']) {
  console.log('   ⚠️  Version mismatch detected - aligning...');
  rootPackage.dependencies['@tanstack/react-query'] = clientPackage.dependencies['@tanstack/react-query'];
  rootPackage.dependencies['@tanstack/query-core'] = clientPackage.dependencies['@tanstack/query-core'];
  writeFileSync('package.json', JSON.stringify(rootPackage, null, 2) + '\n');
  console.log('   ✅ Versions aligned');
}

// Step 2: Install dependencies
console.log('\n2️⃣ Installing dependencies...');
try {
  execSync('pnpm install', { stdio: 'inherit' });
  console.log('   ✅ Dependencies installed');
} catch (error: any) {
  console.error('   ❌ Failed to install:', error.message);
  process.exit(1);
}

// Step 3: Verify client dependencies
console.log('\n3️⃣ Verifying client dependencies...');
try {
  execSync('cd client && pnpm install', { stdio: 'inherit' });
  console.log('   ✅ Client dependencies verified');
} catch (error: any) {
  console.error('   ❌ Failed to verify client:', error.message);
  process.exit(1);
}

console.log('\n✅ Build dependencies fixed!');
console.log('💡 Now run: pnpm deploy:now');

