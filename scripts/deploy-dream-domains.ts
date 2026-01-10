#!/usr/bin/env tsx
/**
 * Deploy DreamNet with .dream Domains
 * 
 * Issues .dream domains to DreamNet itself and deploys to Cloud Run
 * Shows real-time progress and dialogue
 * 
 * Usage: pnpm deploy:dream-domains
 */

import { execSync } from 'child_process';
import { spawn } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';
const REGION = process.env.GCP_REGION || 'us-central1';
const SERVICE_NAME = 'dreamnet';
const API_URL = process.env.API_URL || 'http://localhost:3000';
const DREAMNET_WALLET = process.env.DREAMNET_WALLET || '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e';
const DREAMNET_PASSPORT = process.env.DREAMNET_PASSPORT || 'dreamnet-main';

// Main domain to issue
const MAIN_DOMAIN = 'dreamnet.dream';

function log(message: string, emoji: string = '📝') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] ${emoji} ${message}`);
}

function logStep(step: number, total: number, message: string) {
  log(`Step ${step}/${total}: ${message}`, '🚀');
}

async function checkServerRunning(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function issueDomain(name: string): Promise<{ success: boolean; domain?: string; message: string }> {
  try {
    log(`   Issuing ${name}.dream...`, '🎫');
    const response = await fetch(`${API_URL}/api/domains/issue/dream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passportId: DREAMNET_PASSPORT,
        walletAddress: DREAMNET_WALLET,
        requestedName: name,
        tier: 'premium',
      }),
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      log(`   ✅ Issued ${data.domain.domain}`, '✅');
      return { success: true, domain: data.domain.domain, message: 'Issued successfully' };
    } else {
      log(`   ⚠️  ${data.message || data.error || 'Unknown error'}`, '⚠️');
      return { success: false, message: data.message || data.error || 'Unknown error' };
    }
  } catch (error: any) {
    log(`   ❌ Error: ${error.message}`, '❌');
    return { success: false, message: error.message };
  }
}

async function runCommand(command: string, description: string, showOutput: boolean = true): Promise<boolean> {
  log(`   Running: ${description}`, '⚙️');
  
  return new Promise((resolve) => {
    const [cmd, ...args] = command.split(' ');
    const proc = spawn(cmd, args, {
      stdio: showOutput ? 'inherit' : 'pipe',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code === 0) {
        log(`   ✅ ${description} completed`, '✅');
        resolve(true);
      } else {
        log(`   ❌ ${description} failed (exit code: ${code})`, '❌');
        resolve(false);
      }
    });

    proc.on('error', (error) => {
      log(`   ❌ Error: ${error.message}`, '❌');
      resolve(false);
    });
  });
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🌐 DreamNet Deployment with .dream Domains');
  console.log('='.repeat(70));
  console.log(`📋 Configuration:`);
  console.log(`   Project: ${PROJECT_ID}`);
  console.log(`   Region: ${REGION}`);
  console.log(`   Service: ${SERVICE_NAME}`);
  console.log(`   Main Domain: ${MAIN_DOMAIN}`);
  console.log('='.repeat(70) + '\n');

  let step = 1;
  const totalSteps = 5;

  // Step 1: Check if server is running (for domain issuance)
  logStep(step++, totalSteps, 'Checking server status');
  const serverRunning = await checkServerRunning();
  if (serverRunning) {
    log('   ✅ Server is running - can issue domains', '✅');
  } else {
    log('   ⚠️  Server not running - will skip domain issuance', '⚠️');
    log('   💡 Start server with: pnpm dev:app (in another terminal)', '💡');
  }

  // Step 2: Issue main domain
  logStep(step++, totalSteps, 'Issuing .dream domains');
  let mainDomainIssued = false;
  if (serverRunning) {
    const result = await issueDomain('dreamnet');
    mainDomainIssued = result.success;
    if (mainDomainIssued) {
      log(`   🎉 Main domain ready: ${result.domain}`, '🎉');
    }
  } else {
    log('   ⏭️  Skipping domain issuance (server not running)', '⏭️');
    log('   💡 Domains can be issued later with: pnpm issue:all-verticals', '💡');
  }

  // Step 3: Build Docker image
  logStep(step++, totalSteps, 'Building Docker image');
  log('   This may take a few minutes...', '⏳');
  const imageName = `gcr.io/${PROJECT_ID}/${SERVICE_NAME}`;
  const buildSuccess = await runCommand(
    `gcloud builds submit --tag ${imageName} --project ${PROJECT_ID}`,
    'Docker build',
    true
  );

  if (!buildSuccess) {
    log('❌ Build failed. Check errors above.', '❌');
    process.exit(1);
  }

  // Step 4: Deploy to Cloud Run
  logStep(step++, totalSteps, 'Deploying to Cloud Run');
  log('   Deploying service...', '☁️');
  
  const deploySuccess = await runCommand(
    `gcloud run deploy ${SERVICE_NAME} ` +
    `--image ${imageName} ` +
    `--platform managed ` +
    `--region ${REGION} ` +
    `--project ${PROJECT_ID} ` +
    `--allow-unauthenticated ` +
    `--port 8080 ` +
    `--memory 2Gi ` +
    `--cpu 2 ` +
    `--timeout 300 ` +
    `--max-instances 10 ` +
    `--set-env-vars=NODE_ENV=production`,
    'Cloud Run deployment',
    true
  );

  if (!deploySuccess) {
    log('❌ Deployment failed. Check errors above.', '❌');
    process.exit(1);
  }

  // Step 5: Get service URL and summary
  logStep(step++, totalSteps, 'Getting service information');
  let serviceUrl = '';
  try {
    serviceUrl = execSync(
      `gcloud run services describe ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID} --format="value(status.url)"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();
    log(`   ✅ Service URL: ${serviceUrl}`, '✅');
  } catch {
    log('   ⚠️  Could not get service URL', '⚠️');
  }

  // Final summary
  console.log('\n' + '='.repeat(70));
  console.log('🎉 Deployment Complete!');
  console.log('='.repeat(70));
  console.log('\n📊 Summary:\n');
  console.log(`✅ Service: ${SERVICE_NAME}`);
  console.log(`✅ Region: ${REGION}`);
  if (serviceUrl) {
    console.log(`✅ Service URL: ${serviceUrl}`);
  }
  if (mainDomainIssued) {
    console.log(`✅ Main Domain: ${MAIN_DOMAIN}`);
    console.log(`   💡 Note: .dream domains resolve via DreamNet's domain system`);
    console.log(`   💡 They don't need DNS changes - they work internally`);
  }
  console.log('\n👀 Where to Watch:\n');
  console.log(`📊 Cloud Run Console:`);
  console.log(`   https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}?project=${PROJECT_ID}\n`);
  console.log(`📝 View Logs:`);
  console.log(`   gcloud run services logs read ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID}\n`);
  console.log(`📈 Monitor:`);
  console.log(`   gcloud run services describe ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID}\n`);
  
  if (serviceUrl) {
    console.log(`🌐 Access Your Service:\n`);
    console.log(`   ${serviceUrl}\n`);
  }

  console.log('💡 Next Steps:\n');
  console.log('   1. Test the service URL above');
  console.log('   2. Issue more domains: pnpm issue:all-verticals');
  console.log('   3. Monitor logs: gcloud run services logs tail');
  console.log('   4. Update environment variables via Cloud Run console\n');

  console.log('='.repeat(70) + '\n');
}

main().catch((error) => {
  log(`Fatal error: ${error.message}`, '❌');
  process.exit(1);
});

