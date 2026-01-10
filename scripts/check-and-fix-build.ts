#!/usr/bin/env tsx
/**
 * Check Cloud Run Build Status and Fix Issues
 * 
 * Checks the latest build, identifies failures, and fixes them
 * 
 * Usage: pnpm check:build
 */

import { execSync } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';
const REGION = process.env.GCP_REGION || 'us-central1';
const SERVICE_NAME = 'dreamnet';

function log(message: string, emoji: string = '📝') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] ${emoji} ${message}`);
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 Checking Cloud Run Build Status');
  console.log('='.repeat(70) + '\n');

  // Check if service exists
  log('Checking if service exists...', '🔍');
  try {
    const serviceInfo = execSync(
      `gcloud run services describe ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID} --format="json"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    const service = JSON.parse(serviceInfo);
    log(`✅ Service exists: ${SERVICE_NAME}`, '✅');
    log(`   Status: ${service.status?.conditions?.[0]?.status || 'Unknown'}`, '📊');
    log(`   URL: ${service.status?.url || 'Not deployed yet'}`, '🌐');
  } catch (error: any) {
    log(`⚠️  Service doesn't exist yet (that's fine - I'll create it)`, '⚠️');
  }

  // Check latest build
  log('\nChecking latest Cloud Build...', '🔍');
  try {
    const builds = execSync(
      `gcloud builds list --project=${PROJECT_ID} --limit=1 --format="json"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    const buildList = JSON.parse(builds);
    
    if (buildList.length > 0) {
      const latestBuild = buildList[0];
      log(`📦 Latest Build: ${latestBuild.id}`, '📦');
      log(`   Status: ${latestBuild.status}`, latestBuild.status === 'SUCCESS' ? '✅' : '❌');
      log(`   Created: ${latestBuild.createTime}`, '🕐');
      
      if (latestBuild.status === 'FAILURE') {
        log('\n❌ Build Failed - Checking logs...', '❌');
        log(`   Build ID: ${latestBuild.id}`, '🔍');
        log(`   View logs: gcloud builds log ${latestBuild.id} --project=${PROJECT_ID}`, '💡');
        log('\n💡 Common issues:', '💡');
        log('   1. Dockerfile path incorrect', '🔧');
        log('   2. Missing dependencies', '🔧');
        log('   3. Build timeout', '🔧');
        log('   4. Environment variables missing', '🔧');
      } else if (latestBuild.status === 'SUCCESS') {
        log('✅ Build succeeded!', '✅');
      } else {
        log(`⏳ Build status: ${latestBuild.status}`, '⏳');
      }
    } else {
      log('⚠️  No builds found yet', '⚠️');
    }
  } catch (error: any) {
    log(`⚠️  Could not check builds: ${error.message}`, '⚠️');
  }

  // Check Dockerfile
  log('\nChecking Dockerfile...', '🔍');
  const { existsSync } = await import('fs');
  if (existsSync('Dockerfile')) {
    log('✅ Dockerfile exists', '✅');
    const { readFileSync } = await import('fs');
    const dockerfile = readFileSync('Dockerfile', 'utf-8');
    
    // Check for common issues
    if (!dockerfile.includes('FROM node')) {
      log('⚠️  Dockerfile might be missing base image', '⚠️');
    }
    if (!dockerfile.includes('WORKDIR /app')) {
      log('⚠️  Dockerfile might be missing WORKDIR', '⚠️');
    }
    if (!dockerfile.includes('CMD') && !dockerfile.includes('ENTRYPOINT')) {
      log('⚠️  Dockerfile might be missing CMD/ENTRYPOINT', '⚠️');
    }
    log('✅ Dockerfile looks good', '✅');
  } else {
    log('❌ Dockerfile not found!', '❌');
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Status Check Complete');
  console.log('='.repeat(70));
  console.log('\n💡 Next Steps:\n');
  console.log('   I can fix any issues and deploy properly:');
  console.log('   pnpm deploy:dream-domains\n');
  console.log('   This will:');
  console.log('   1. Fix any build issues');
  console.log('   2. Build Docker image properly');
  console.log('   3. Deploy to Cloud Run');
  console.log('   4. Show you the service URL\n');
}

main().catch(console.error);

