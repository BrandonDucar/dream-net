#!/usr/bin/env tsx
/**
 * Check Google Cloud Accounts and Project Access
 * 
 * Helps identify which account has access to which projects
 * 
 * Usage: pnpm check:gcp-accounts
 */

import { execSync } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';

console.log('🔍 Checking Google Cloud Accounts...\n');

// Get all authenticated accounts
console.log('📋 Authenticated Accounts:');
try {
  const authList = execSync('gcloud auth list', { encoding: 'utf-8', stdio: 'pipe' });
  console.log(authList);
  
  // Extract account emails
  const accounts = authList
    .split('\n')
    .filter(line => line.includes('@'))
    .map(line => {
      const isActive = line.includes('*');
      const email = line.trim().split(/\s+/).pop();
      return { email, isActive };
    })
    .filter(acc => acc.email);
  
  console.log(`\nFound ${accounts.length} account(s):\n`);
  
  for (const account of accounts) {
    console.log(`${account.isActive ? '✅ ACTIVE' : '   '} ${account.email}`);
  }
  
  // Check current account
  const currentAccount = accounts.find(acc => acc.isActive)?.email || accounts[0]?.email;
  
  if (currentAccount) {
    console.log(`\n🔍 Checking project access for: ${currentAccount}\n`);
    
    // Try to describe the project
    try {
      const projectInfo = execSync(
        `gcloud projects describe ${PROJECT_ID}`,
        { encoding: 'utf-8', stdio: 'pipe' }
      );
      
      console.log(`✅ ${currentAccount} has access to ${PROJECT_ID}`);
      console.log(`\nProject Info:`);
      console.log(projectInfo.split('\n').slice(0, 10).join('\n'));
      
    } catch (error: any) {
      if (error.message.includes('PERMISSION_DENIED') || error.message.includes('does not have permission')) {
        console.log(`❌ ${currentAccount} does NOT have access to ${PROJECT_ID}`);
        console.log(`\n💡 Try switching to another account:`);
        accounts.forEach(acc => {
          if (!acc.isActive) {
            console.log(`   gcloud config set account ${acc.email}`);
          }
        });
        console.log(`\n💡 Or grant access:`);
        console.log(`   Go to: https://console.cloud.google.com/iam-admin/iam?project=${PROJECT_ID}`);
        console.log(`   Add ${currentAccount} with Owner role`);
      } else {
        console.log(`⚠️  Could not check project: ${error.message.split('\n')[0]}`);
      }
    }
    
    // Check billing
    console.log(`\n💳 Checking billing...`);
    try {
      const billing = execSync(
        `gcloud billing projects describe ${PROJECT_ID}`,
        { encoding: 'utf-8', stdio: 'pipe' }
      );
      
      if (billing.includes('billingAccountName')) {
        console.log(`✅ Billing is linked`);
      } else {
        console.log(`❌ Billing not linked`);
        console.log(`   Go to: https://console.cloud.google.com/billing?project=${PROJECT_ID}`);
      }
    } catch (error: any) {
      if (error.message.includes('billing not enabled')) {
        console.log(`❌ Billing not enabled`);
        console.log(`   Go to: https://console.cloud.google.com/billing?project=${PROJECT_ID}`);
      } else {
        console.log(`⚠️  Could not check billing`);
      }
    }
  }
  
  // List projects for each account
  console.log(`\n📁 Projects accessible to each account:\n`);
  
  for (const account of accounts) {
    console.log(`${account.isActive ? '✅' : '  '} ${account.email}:`);
    try {
      execSync(`gcloud config set account ${account.email}`, { stdio: 'pipe' });
      const projects = execSync('gcloud projects list --format="value(projectId)"', {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      const projectList = projects.trim().split('\n').filter(p => p);
      if (projectList.length > 0) {
        projectList.forEach(proj => {
          const isDreamNet = proj === PROJECT_ID;
          console.log(`     ${isDreamNet ? '🎯' : '  '} ${proj}${isDreamNet ? ' (DreamNet)' : ''}`);
        });
      } else {
        console.log(`     (no projects found)`);
      }
    } catch (error: any) {
      console.log(`     ⚠️  Could not list projects: ${error.message.split('\n')[0]}`);
    }
  }
  
  // Restore active account
  if (currentAccount) {
    execSync(`gcloud config set account ${currentAccount}`, { stdio: 'pipe' });
  }
  
  console.log(`\n💡 Recommendations:`);
  console.log(`   1. Use the account that owns ${PROJECT_ID}`);
  console.log(`   2. Or grant Owner role to your preferred account`);
  console.log(`   3. Set active: gcloud config set account EMAIL@gmail.com`);
  console.log(`   4. Then run: pnpm enable:gcp-apis`);
  
} catch (error: any) {
  console.error(`❌ Error: ${error.message}`);
  console.log(`\n💡 Make sure gcloud is installed and authenticated:`);
  console.log(`   gcloud auth login`);
}

