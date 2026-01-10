#!/usr/bin/env tsx
/**
 * DEPLOY NOW - Get Live Fastest
 * 
 * Deploys to Cloud Run RIGHT NOW - no domain needed
 * You get a live URL immediately: https://dreamnet-xxxxx.run.app
 * 
 * Usage: pnpm deploy:now
 */

import { execSync } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';
const REGION = process.env.GCP_REGION || 'us-central1';
const SERVICE_NAME = 'dreamnet';
const IMAGE_NAME = `gcr.io/${PROJECT_ID}/${SERVICE_NAME}`;

function log(message: string, emoji: string = '📝') {
  console.log(`${emoji} ${message}`);
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 DEPLOYING TO CLOUD RUN NOW - GETTING YOU LIVE FASTEST');
  console.log('='.repeat(70) + '\n');

  log(`Project: ${PROJECT_ID}`, '📋');
  log(`Region: ${REGION}`, '📍');
  log(`Service: ${SERVICE_NAME}`, '⚙️');
  log(`Image: ${IMAGE_NAME}`, '🐳');
  console.log('');

  // Step 1: Build Docker image
  log('Step 1/3: Building Docker image...', '🔨');
  log('   This may take 5-10 minutes...', '⏳');
  try {
    execSync(
      `gcloud builds submit --tag ${IMAGE_NAME} --project=${PROJECT_ID} --timeout=20m`,
      { stdio: 'inherit' }
    );
    log('✅ Build complete!', '✅');
  } catch (error: any) {
    log(`❌ Build failed: ${error.message}`, '❌');
    log('💡 Fix: Run `pnpm install` first to update pnpm-lock.yaml', '💡');
    process.exit(1);
  }

  console.log('');

  // Step 2: Deploy to Cloud Run
  log('Step 2/3: Deploying to Cloud Run...', '☁️');
  try {
    execSync(
      `gcloud run deploy ${SERVICE_NAME} ` +
      `--image ${IMAGE_NAME} ` +
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
      { stdio: 'inherit' }
    );
    log('✅ Deployment complete!', '✅');
  } catch (error: any) {
    log(`❌ Deployment failed: ${error.message}`, '❌');
    process.exit(1);
  }

  console.log('');

  // Step 3: Get live URL
  log('Step 3/3: Getting your live URL...', '🌐');
  try {
    const url = execSync(
      `gcloud run services describe ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID} --format="value(status.url)"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();

    console.log('\n' + '='.repeat(70));
    console.log('🎉 YOU ARE LIVE! 🎉');
    console.log('='.repeat(70));
    console.log(`\n🌐 Your DreamNet is live at:`);
    console.log(`   ${url}`);
    console.log(`\n✅ No domain needed - this URL works RIGHT NOW`);
    console.log(`\n💡 Share this URL with anyone - it's live!`);
    console.log(`\n📊 View logs:`);
    console.log(`   gcloud run services logs read ${SERVICE_NAME} --region ${REGION}`);
    console.log(`\n⚙️  Manage:`);
    console.log(`   https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}?project=${PROJECT_ID}`);
    console.log('\n' + '='.repeat(70) + '\n');
  } catch (error: any) {
    log(`⚠️  Could not get URL: ${error.message}`, '⚠️');
    log('💡 Check Cloud Run console for URL', '💡');
  }
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, '❌');
  process.exit(1);
});

