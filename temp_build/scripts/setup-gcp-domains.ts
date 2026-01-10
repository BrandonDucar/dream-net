#!/usr/bin/env tsx
/**
 * Setup DreamNet Domains on Google Cloud
 * 
 * Configures:
 * - Cloud DNS zones for domains
 * - DNS records pointing to GCP services
 * - SSL certificates via ManagedCertificate
 * - Domain routing to Cloud Run / GKE
 * 
 * Usage: pnpm tsx scripts/setup-gcp-domains.ts
 */

import { execSync } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';
const REGION = process.env.GCP_REGION || 'us-central1';

const domains = [
  { domain: 'dreamnet.ink', zone: 'dreamnet-ink' },
  { domain: 'dreamnet.live', zone: 'dreamnet-live' },
  { domain: 'dadfi.org', zone: 'dadfi-org' },
];

console.log('🌐 Setting up DreamNet domains on Google Cloud...\n');
console.log(`📋 Project: ${PROJECT_ID}`);
console.log(`📍 Region: ${REGION}\n`);

// Step 1: Create DNS zones
console.log('1️⃣ Creating DNS Zones...\n');

for (const { domain, zone } of domains) {
  try {
    // Check if zone exists
    try {
      execSync(
        `gcloud dns managed-zones describe ${zone} --project=${PROJECT_ID}`,
        { stdio: 'pipe' }
      );
      console.log(`   ✅ Zone ${zone} already exists`);
    } catch {
      // Create zone
      console.log(`   Creating zone ${zone} for ${domain}...`);
      execSync(
        `gcloud dns managed-zones create ${zone} ` +
        `--dns-name=${domain} ` +
        `--description="DreamNet DNS zone for ${domain}" ` +
        `--project=${PROJECT_ID}`,
        { stdio: 'inherit' }
      );
      console.log(`   ✅ Zone ${zone} created`);
      
      // Get name servers
      const nsOutput = execSync(
        `gcloud dns managed-zones describe ${zone} --project=${PROJECT_ID} --format="value(nameServers)"`,
        { encoding: 'utf-8', stdio: 'pipe' }
      );
      const nameServers = nsOutput.trim().split('\n');
      console.log(`   📍 Name servers for ${domain}:`);
      nameServers.forEach(ns => console.log(`      - ${ns}`));
      console.log(`   💡 Update your domain registrar to use these name servers\n`);
    }
  } catch (error: any) {
    console.log(`   ❌ Failed to create zone ${zone}: ${error.message.split('\n')[0]}\n`);
  }
}

// Step 2: Get service IPs
console.log('2️⃣ Getting Service IPs...\n');

let serviceIP = '';
try {
  // Try to get GKE ingress IP
  const ipOutput = execSync(
    `gcloud compute addresses describe dreamnet-ip --global --project=${PROJECT_ID} --format="value(address)"`,
    { encoding: 'utf-8', stdio: 'pipe' }
  ).trim();
  if (ipOutput) {
    serviceIP = ipOutput;
    console.log(`   ✅ Found static IP: ${serviceIP}`);
  }
} catch {
  // Try Cloud Run URL
  try {
    const urlOutput = execSync(
      `gcloud run services describe dreamnet --region=${REGION} --project=${PROJECT_ID} --format="value(status.url)"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();
    if (urlOutput) {
      const url = new URL(urlOutput);
      serviceIP = url.hostname;
      console.log(`   ✅ Found Cloud Run service: ${urlOutput}`);
    }
  } catch {
    console.log(`   ⚠️  Could not find service IP. You may need to create static IP first.`);
    console.log(`   💡 Run: gcloud compute addresses create dreamnet-ip --global`);
  }
}

// Step 3: Create DNS records
if (serviceIP) {
  console.log('\n3️⃣ Creating DNS Records...\n');
  
  for (const { domain, zone } of domains) {
    try {
      // A record for root domain
      console.log(`   Creating A record for ${domain}...`);
      execSync(
        `gcloud dns record-sets create ${domain}. ` +
        `--rrdatas=${serviceIP} ` +
        `--type=A ` +
        `--ttl=300 ` +
        `--zone=${zone} ` +
        `--project=${PROJECT_ID}`,
        { stdio: 'inherit' }
      );
      console.log(`   ✅ A record created for ${domain}\n`);
      
      // A record for www subdomain
      console.log(`   Creating A record for www.${domain}...`);
      execSync(
        `gcloud dns record-sets create www.${domain}. ` +
        `--rrdatas=${serviceIP} ` +
        `--type=A ` +
        `--ttl=300 ` +
        `--zone=${zone} ` +
        `--project=${PROJECT_ID}`,
        { stdio: 'inherit' }
      );
      console.log(`   ✅ A record created for www.${domain}\n`);
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log(`   ⚠️  Records already exist for ${domain}\n`);
      } else {
        console.log(`   ❌ Failed to create records for ${domain}: ${error.message.split('\n')[0]}\n`);
      }
    }
  }
}

// Step 4: Create SSL certificates (for GKE)
console.log('4️⃣ SSL Certificates...\n');
console.log('   💡 SSL certificates are managed via Kubernetes ManagedCertificate');
console.log('   💡 See: infrastructure/google/gke/ingress.yaml');
console.log('   💡 Certificates will be auto-provisioned when ingress is created\n');

// Summary
console.log('='.repeat(60));
console.log('📊 Domain Setup Summary:\n');

for (const { domain, zone } of domains) {
  console.log(`🌐 ${domain}`);
  console.log(`   Zone: ${zone}`);
  console.log(`   Status: ${serviceIP ? 'Configured' : 'Needs IP'}`);
  console.log('');
}

console.log('💡 Next Steps:');
console.log('   1. Update domain registrar with name servers (shown above)');
console.log('   2. Wait for DNS propagation (can take up to 48 hours)');
console.log('   3. Deploy to GKE: pnpm deploy:gke');
console.log('   4. SSL certificates will auto-provision');

