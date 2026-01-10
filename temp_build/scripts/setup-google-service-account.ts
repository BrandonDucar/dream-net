#!/usr/bin/env tsx
/**
 * Setup Google Cloud Service Account
 * 
 * If you provide a service account JSON key, this will set it up
 * 
 * Usage: 
 *   pnpm setup:gcp-service-account /path/to/service-account.json
 *   OR
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
 */

import { readFileSync, existsSync, copyFileSync } from 'fs';
import { join } from 'path';

const keyPath = process.argv[2] || process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!keyPath) {
  console.log('🔐 Google Cloud Service Account Setup\n');
  console.log('Usage:');
  console.log('  pnpm setup:gcp-service-account /path/to/service-account.json');
  console.log('  OR');
  console.log('  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json\n');
  console.log('To create a service account:');
  console.log('  1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=dreamnet-62b49');
  console.log('  2. Click "Create Service Account"');
  console.log('  3. Name: dreamnet-deployer');
  console.log('  4. Grant roles:');
  console.log('     - Kubernetes Engine Admin');
  console.log('     - Cloud SQL Admin');
  console.log('     - Storage Admin');
  console.log('     - BigQuery Admin');
  console.log('     - Cloud Build Editor');
  console.log('  5. Create key (JSON)');
  console.log('  6. Download and provide path\n');
  process.exit(0);
}

if (!existsSync(keyPath)) {
  console.error(`❌ Service account file not found: ${keyPath}`);
  process.exit(1);
}

try {
  // Validate JSON
  const keyData = JSON.parse(readFileSync(keyPath, 'utf-8'));
  
  if (!keyData.project_id || !keyData.private_key || !keyData.client_email) {
    throw new Error('Invalid service account JSON format');
  }
  
  console.log('✅ Service account JSON is valid');
  console.log(`   Project: ${keyData.project_id}`);
  console.log(`   Email: ${keyData.client_email}\n`);
  
  // Set environment variable
  const envPath = join(process.cwd(), '.env.gcp');
  const envContent = `GOOGLE_APPLICATION_CREDENTIALS=${keyPath}\nGCP_PROJECT_ID=${keyData.project_id}\n`;
  
  require('fs').appendFileSync(envPath, envContent);
  console.log(`✅ Added to .env.gcp`);
  
  // Also set in current process
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
  process.env.GCP_PROJECT_ID = keyData.project_id;
  
  console.log('\n✅ Service account configured!');
  console.log('\nTest with:');
  console.log('  pnpm tsx scripts/test-google-cloud-sdk.ts');
  console.log('  pnpm enable:gcp-apis');
  
} catch (error: any) {
  console.error(`❌ Failed to setup service account: ${error.message}`);
  process.exit(1);
}

