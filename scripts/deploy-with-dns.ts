#!/usr/bin/env tsx
/**
 * Deploy DreamNet to Cloud Run with DNS Migration
 * 
 * Deploys to Cloud Run and helps migrate dreamnet.ink from Vercel to GCP
 * 
 * Usage: pnpm deploy:with-dns
 */

import { execSync } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';
const REGION = process.env.GCP_REGION || 'us-central1';
const SERVICE_NAME = 'dreamnet';
const DOMAIN = 'dreamnet.ink';

console.log('🚀 Deploying DreamNet to Cloud Run with DNS Migration...\n');
console.log('='.repeat(70));
console.log(`📋 Configuration:`);
console.log(`   Project: ${PROJECT_ID}`);
console.log(`   Region: ${REGION}`);
console.log(`   Service: ${SERVICE_NAME}`);
console.log(`   Domain: ${DOMAIN}`);
console.log('='.repeat(70));

// Step 1: Deploy to Cloud Run
console.log('\n☁️  Step 1: Deploying to Cloud Run...\n');
try {
  execSync('pnpm deploy:gcp', { stdio: 'inherit' });
  console.log('\n✅ Deployment complete!\n');
} catch (error) {
  console.error('\n❌ Deployment failed');
  process.exit(1);
}

// Step 2: Get Cloud Run service URL
console.log('🔗 Step 2: Getting service URL...\n');
let serviceUrl = '';
try {
  serviceUrl = execSync(
    `gcloud run services describe ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID} --format="value(status.url)"`,
    { encoding: 'utf-8', stdio: 'pipe' }
  ).trim();
  console.log(`✅ Service URL: ${serviceUrl}\n`);
} catch (error) {
  console.error('❌ Could not get service URL');
  process.exit(1);
}

// Step 3: Map custom domain
console.log('🌐 Step 3: Mapping custom domain...\n');
try {
  console.log(`   Mapping ${DOMAIN} to ${SERVICE_NAME}...`);
  execSync(
    `gcloud run domain-mappings create --service=${SERVICE_NAME} --domain=${DOMAIN} --region=${REGION} --project=${PROJECT_ID}`,
    { stdio: 'inherit' }
  );
  console.log(`✅ Domain mapping created\n`);
} catch (error: any) {
  if (error.message.includes('already exists')) {
    console.log(`   ℹ️  Domain mapping already exists\n`);
  } else {
    console.log(`   ⚠️  Domain mapping failed: ${error.message}`);
    console.log(`   💡 You can create it manually in Cloud Run console\n`);
  }
}

// Step 4: Get DNS records needed
console.log('📋 Step 4: DNS Configuration Required\n');
console.log('='.repeat(70));
console.log('\n⚠️  IMPORTANT: DNS Migration Required\n');
console.log('dreamnet.ink is currently pointed at Vercel.');
console.log('To migrate to Cloud Run, you need to update DNS at your registrar.\n');

try {
  // Try to get domain mapping details
  const mappingOutput = execSync(
    `gcloud run domain-mappings describe --domain=${DOMAIN} --region=${REGION} --project=${PROJECT_ID} --format="json"`,
    { encoding: 'utf-8', stdio: 'pipe' }
  );
  const mapping = JSON.parse(mappingOutput);
  
  if (mapping.status?.resourceRecords) {
    console.log('📝 DNS Records to Add at Your Registrar:\n');
    mapping.status.resourceRecords.forEach((record: any) => {
      console.log(`   Type: ${record.type}`);
      console.log(`   Name: ${record.name}`);
      console.log(`   Value: ${record.rrdata}`);
      console.log('');
    });
  }
} catch {
  console.log('💡 To get DNS records:');
  console.log(`   gcloud run domain-mappings describe --domain=${DOMAIN} --region=${REGION} --project=${PROJECT_ID}\n`);
}

console.log('📋 Steps to Complete DNS Migration:\n');
console.log('1. Go to your domain registrar (where you bought dreamnet.ink)');
console.log('2. Remove old Vercel DNS records (if any)');
console.log('3. Add the Cloud Run DNS records shown above');
console.log('4. Wait for DNS propagation (can take up to 48 hours)');
console.log('5. SSL certificate will auto-provision once DNS propagates\n');

// Step 5: Monitoring links
console.log('='.repeat(70));
console.log('\n👀 Where to Watch Deployment:\n');
console.log(`📊 Cloud Run Console:`);
console.log(`   https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}?project=${PROJECT_ID}\n`);
console.log(`📝 Logs:`);
console.log(`   gcloud run services logs read ${SERVICE_NAME} --region=${REGION} --project=${PROJECT_ID}\n`);
console.log(`🌐 Service URL:`);
console.log(`   ${serviceUrl}\n`);
console.log(`🔗 Domain (after DNS update):`);
console.log(`   https://${DOMAIN}\n`);

console.log('='.repeat(70));
console.log('\n✅ Deployment Summary:\n');
console.log(`✅ Service deployed: ${SERVICE_NAME}`);
console.log(`✅ Service URL: ${serviceUrl}`);
console.log(`⚠️  DNS migration: Required (see steps above)`);
console.log(`⏳ SSL certificate: Will auto-provision after DNS propagates\n`);

console.log('💡 Next Steps:');
console.log('   1. Update DNS records at your registrar');
console.log('   2. Wait for DNS propagation');
console.log('   3. SSL certificate will auto-provision');
console.log('   4. Visit https://dreamnet.ink\n');

