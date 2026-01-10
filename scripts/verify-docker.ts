#!/usr/bin/env tsx
/**
 * Verification Script for Docker Build
 * 
 * Checks Dockerfile and build configuration before attempting Docker build
 * 
 * Usage: tsx scripts/verify-docker.ts
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const errors: string[] = [];
const warnings: string[] = [];

console.log('🐳 Verifying Docker build configuration...\n');

// Check Dockerfile exists
const dockerfilePath = join(process.cwd(), 'Dockerfile');
if (!existsSync(dockerfilePath)) {
  errors.push('Dockerfile not found at root level');
  console.log('❌ Dockerfile not found');
} else {
  console.log('✅ Dockerfile found');
  
  // Check Dockerfile contents
  const dockerfileContent = readFileSync(dockerfilePath, 'utf-8');
  
  // Check for critical sections
  const checks = [
    { name: 'Base image (node:20)', pattern: /FROM node:20/ },
    { name: 'pnpm installation', pattern: /pnpm/ },
    { name: 'Package files copy', pattern: /COPY.*package\.json/ },
    { name: 'Dependencies install', pattern: /pnpm install/ },
    { name: 'Frontend build', pattern: /client.*build/ },
    { name: 'Backend build', pattern: /server.*build/ },
    { name: 'Port exposure', pattern: /EXPOSE/ },
    { name: 'CMD instruction', pattern: /CMD/ },
  ];
  
  console.log('\n📋 Checking Dockerfile sections:');
  for (const check of checks) {
    if (check.pattern.test(dockerfileContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      warnings.push(`Dockerfile may be missing: ${check.name}`);
      console.log(`   ⚠️  ${check.name} - not found`);
    }
  }
  
  // Check for common issues
  if (dockerfileContent.includes('server/Dockerfile')) {
    warnings.push('Dockerfile references server/Dockerfile (should use root Dockerfile)');
    console.log('\n   ⚠️  Warning: References server/Dockerfile');
  }
  
  // Check port configuration
  if (dockerfileContent.includes('PORT=8080')) {
    console.log('\n   ✅ PORT set to 8080 (Cloud Run compatible)');
  } else {
    warnings.push('PORT may not be set to 8080 (Cloud Run requires 8080)');
    console.log('\n   ⚠️  PORT may not be set correctly');
  }
}

// Check required files for Docker build
console.log('\n📁 Checking required files for Docker build:');
const requiredFiles = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'client/package.json',
  'server/package.json',
];

for (const file of requiredFiles) {
  if (existsSync(join(process.cwd(), file))) {
    console.log(`   ✅ ${file}`);
  } else {
    errors.push(`Missing required file for Docker build: ${file}`);
    console.log(`   ❌ ${file} - MISSING`);
  }
}

// Check client build configuration
console.log('\n📦 Checking client build configuration:');
const clientPackagePath = join(process.cwd(), 'client', 'package.json');
if (existsSync(clientPackagePath)) {
  try {
    const clientPackage = JSON.parse(readFileSync(clientPackagePath, 'utf-8'));
    if (clientPackage.scripts?.build) {
      console.log('   ✅ Client has build script');
    } else {
      warnings.push('Client package.json missing build script');
      console.log('   ⚠️  Client missing build script');
    }
  } catch (e) {
    warnings.push('Could not parse client package.json');
    console.log('   ⚠️  Could not parse client package.json');
  }
} else {
  errors.push('client/package.json not found');
}

// Check server build configuration
console.log('\n🔨 Checking server build configuration:');
const serverPackagePath = join(process.cwd(), 'server', 'package.json');
if (existsSync(serverPackagePath)) {
  try {
    const serverPackage = JSON.parse(readFileSync(serverPackagePath, 'utf-8'));
    if (serverPackage.scripts?.build) {
      console.log('   ✅ Server has build script');
    } else {
      warnings.push('Server package.json missing build script');
      console.log('   ⚠️  Server missing build script');
    }
  } catch (e) {
    warnings.push('Could not parse server package.json');
    console.log('   ⚠️  Could not parse server package.json');
  }
} else {
  errors.push('server/package.json not found');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Docker Build Verification Summary\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Docker build should work.');
  console.log('\nTo build Docker image:');
  console.log('   docker build -t dreamnet-test -f Dockerfile .');
  console.log('\nTo test locally:');
  console.log('   docker run -p 8080:8080 dreamnet-test');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('❌ Errors found:');
    errors.forEach(err => console.log(`   - ${err}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warn => console.log(`   - ${warn}`));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Docker build will fail due to errors above.');
    process.exit(1);
  } else {
    console.log('\n⚠️  Docker build may work but with limitations.');
    process.exit(0);
  }
}

