#!/usr/bin/env tsx
/**
 * Setup DreamNet GCP Project
 * 
 * Creates project, links billing, enables APIs
 * 
 * Usage: pnpm setup:dreamnet-gcp
 */

import { execSync } from 'child_process';

const PROJECT_ID = 'dreamnet-62b49';
const PROJECT_NAME = 'DreamNet';
const ACCOUNT = 'brandonducar1234@gmail.com';

console.log('🚀 Setting up DreamNet GCP Project...\n');
console.log(`📋 Account: ${ACCOUNT}`);
console.log(`📋 Project: ${PROJECT_ID}\n`);

// Step 1: Set account
console.log('1️⃣ Setting active account...');
try {
  execSync(`gcloud config set account ${ACCOUNT}`, { stdio: 'pipe' });
  console.log(`   ✅ Account set to ${ACCOUNT}`);
} catch (error: any) {
  console.log(`   ⚠️  Could not set account: ${error.message.split('\n')[0]}`);
}

// Step 2: Check if project exists
console.log('\n2️⃣ Checking if project exists...');
let projectExists = false;
try {
  execSync(`gcloud projects describe ${PROJECT_ID}`, { stdio: 'pipe' });
  projectExists = true;
  console.log(`   ✅ Project ${PROJECT_ID} already exists`);
} catch (error: any) {
  if (error.message.includes('not found')) {
    console.log(`   ℹ️  Project ${PROJECT_ID} does not exist, will create it`);
  } else {
    console.log(`   ⚠️  Could not check project: ${error.message.split('\n')[0]}`);
  }
}

// Step 3: Create project if needed
if (!projectExists) {
  console.log('\n3️⃣ Creating project...');
  try {
    execSync(`gcloud projects create ${PROJECT_ID} --name="${PROJECT_NAME}"`, {
      stdio: 'pipe'
    });
    console.log(`   ✅ Project ${PROJECT_ID} created`);
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log(`   ✅ Project already exists`);
    } else {
      console.log(`   ❌ Failed to create project: ${error.message.split('\n')[0]}`);
      console.log(`   💡 You may need to create it manually:`);
      console.log(`      Go to: https://console.cloud.google.com/projectcreate`);
      process.exit(1);
    }
  }
}

// Step 4: Set as default project
console.log('\n4️⃣ Setting as default project...');
try {
  execSync(`gcloud config set project ${PROJECT_ID}`, { stdio: 'pipe' });
  console.log(`   ✅ Default project set to ${PROJECT_ID}`);
} catch (error: any) {
  console.log(`   ⚠️  Could not set default project: ${error.message.split('\n')[0]}`);
}

// Step 5: Check billing
console.log('\n5️⃣ Checking billing...');
try {
  const billing = execSync(`gcloud billing projects describe ${PROJECT_ID}`, {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  if (billing.includes('billingAccountName')) {
    console.log(`   ✅ Billing is linked`);
  } else {
    console.log(`   ⚠️  Billing not linked`);
    console.log(`   💡 Link billing at: https://console.cloud.google.com/billing?project=${PROJECT_ID}`);
  }
} catch (error: any) {
  if (error.message.includes('billing not enabled')) {
    console.log(`   ⚠️  Billing not enabled`);
    console.log(`   💡 Enable billing at: https://console.cloud.google.com/billing?project=${PROJECT_ID}`);
  } else {
    console.log(`   ⚠️  Could not check billing`);
  }
}

// Step 6: Grant Owner role
console.log('\n6️⃣ Checking IAM permissions...');
try {
  const iam = execSync(`gcloud projects get-iam-policy ${PROJECT_ID} --format="value(bindings.members)"`, {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  if (iam.includes(ACCOUNT)) {
    console.log(`   ✅ ${ACCOUNT} has access`);
  } else {
    console.log(`   ⚠️  ${ACCOUNT} may not have Owner role`);
    console.log(`   💡 Grant Owner role at: https://console.cloud.google.com/iam-admin/iam?project=${PROJECT_ID}`);
  }
} catch (error: any) {
  console.log(`   ⚠️  Could not check IAM: ${error.message.split('\n')[0]}`);
}

console.log('\n✅ Project setup complete!');
console.log('\n📋 Next Steps:');
console.log('   1. Link billing: https://console.cloud.google.com/billing?project=dreamnet-62b49');
console.log('   2. Grant Owner role: https://console.cloud.google.com/iam-admin/iam?project=dreamnet-62b49');
console.log('   3. Enable APIs: pnpm enable:gcp-apis');
console.log('   4. Verify: pnpm check:gcp-setup');

