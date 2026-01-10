#!/usr/bin/env tsx
/**
 * Setup Cloud Scheduler Jobs for DreamNet
 * 
 * Creates scheduled jobs for:
 * - Star Bridge breaths (every 2 minutes)
 * - DreamKeeper health checks (every 5 minutes)
 * - EnvKeeper sync (every 10 minutes)
 * 
 * Usage: pnpm tsx scripts/setup-cloud-scheduler.ts
 */

import { execSync } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';
const REGION = process.env.GCP_REGION || 'us-central1';

console.log('⏰ Setting up Cloud Scheduler jobs for DreamNet...\n');
console.log(`📋 Project: ${PROJECT_ID}`);
console.log(`📍 Region: ${REGION}\n`);

// Get Cloud Run service URL (or App Engine URL)
let serviceUrl = '';
try {
  const url = execSync(
    `gcloud run services describe dreamnet --region=${REGION} --project=${PROJECT_ID} --format="value(status.url)"`,
    { encoding: 'utf-8', stdio: 'pipe' }
  ).trim();
  serviceUrl = url;
} catch {
  // Try App Engine
  try {
    const appUrl = execSync(
      `gcloud app describe --project=${PROJECT_ID} --format="value(defaultHostname)"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();
    serviceUrl = `https://${appUrl}`;
  } catch {
    console.log('⚠️  Could not find service URL. Using placeholder.');
    serviceUrl = 'https://dreamnet-XXXXX.run.app'; // Will need to update
  }
}

const jobs = [
  {
    name: 'star-bridge-breath',
    schedule: '*/2 * * * *', // Every 2 minutes
    target: `${serviceUrl}/api/star-bridge/breath`,
    description: 'Star Bridge Lungs breath cycle',
  },
  {
    name: 'dreamkeeper-health',
    schedule: '*/5 * * * *', // Every 5 minutes
    target: `${serviceUrl}/api/agent`,
    body: JSON.stringify({ agent: 'dreamkeeper', input: { action: 'health-check' } }),
    description: 'DreamKeeper health diagnostics',
  },
  {
    name: 'envkeeper-sync',
    schedule: '*/10 * * * *', // Every 10 minutes
    target: `${serviceUrl}/api/env-keeper/sync`,
    description: 'EnvKeeper environment sync',
  },
];

console.log('📅 Creating scheduled jobs...\n');

for (const job of jobs) {
  try {
    console.log(`   Creating ${job.name}...`);
    
    const bodyFlag = job.body ? `--message-body='${job.body}'` : '';
    
    execSync(
      `gcloud scheduler jobs create http ${job.name} ` +
      `--schedule="${job.schedule}" ` +
      `--uri="${job.target}" ` +
      `--http-method=POST ` +
      `--location=${REGION} ` +
      `--project=${PROJECT_ID} ` +
      `${bodyFlag} ` +
      `--description="${job.description}" ` +
      `--time-zone="UTC"`,
      { stdio: 'inherit' }
    );
    
    console.log(`   ✅ ${job.name} created\n`);
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log(`   ⚠️  ${job.name} already exists, updating...\n`);
      try {
        execSync(
          `gcloud scheduler jobs update http ${job.name} ` +
          `--schedule="${job.schedule}" ` +
          `--uri="${job.target}" ` +
          `--location=${REGION} ` +
          `--project=${PROJECT_ID}`,
          { stdio: 'inherit' }
        );
        console.log(`   ✅ ${job.name} updated\n`);
      } catch (updateError) {
        console.log(`   ❌ Failed to update ${job.name}\n`);
      }
    } else {
      console.log(`   ❌ Failed to create ${job.name}: ${error.message.split('\n')[0]}\n`);
    }
  }
}

console.log('✅ Cloud Scheduler setup complete!');
console.log('\n📋 Jobs created:');
jobs.forEach(job => {
  console.log(`   ⏰ ${job.name} - ${job.schedule}`);
});

console.log('\n💡 To test a job:');
console.log(`   gcloud scheduler jobs run star-bridge-breath --location=${REGION}`);

