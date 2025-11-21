#!/usr/bin/env tsx
/**
 * Verify AWS IAM Policy Attachment
 * 
 * Checks if policy is attached and permissions are working
 */

import { execSync } from 'child_process';

const USER_NAME = 'Dreamnet';
const POLICY_ARN = 'arn:aws:iam::001092882186:policy/Dreamnet';

console.log('🔍 Verifying AWS IAM Policy...\n');

// Check attached policies
console.log('📋 Checking attached policies...');
try {
  const attached = JSON.parse(
    execSync(`aws iam list-attached-user-policies --user-name ${USER_NAME}`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    })
  );
  
  const policy = attached.AttachedPolicies?.find((p: any) => p.PolicyArn === POLICY_ARN);
  
  if (policy) {
    console.log(`   ✅ Policy attached: ${policy.PolicyName}`);
    console.log(`      ARN: ${policy.PolicyArn}\n`);
  } else {
    console.log(`   ❌ Policy not found in attached policies`);
    console.log(`   Found policies:`, attached.AttachedPolicies?.map((p: any) => p.PolicyName));
    process.exit(1);
  }
} catch (error: any) {
  console.error(`   ❌ Failed to check policies: ${error.message}`);
  process.exit(1);
}

// Get policy document
console.log('📄 Checking policy document...');
try {
  const policyVersion = JSON.parse(
    execSync(`aws iam get-policy-version --policy-arn ${POLICY_ARN} --version-id $(aws iam get-policy --policy-arn ${POLICY_ARN} --query 'Policy.DefaultVersionId' --output text)`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    })
  );
  
  const statements = policyVersion.PolicyVersion.Document.Statement || [];
  console.log(`   ✅ Policy has ${statements.length} statements`);
  
  // Check for key permissions
  const allActions: string[] = [];
  statements.forEach((stmt: any) => {
    if (stmt.Action) {
      const actions = Array.isArray(stmt.Action) ? stmt.Action : [stmt.Action];
      allActions.push(...actions);
    }
  });
  
  const hasS3 = allActions.some((a: string) => a.includes('s3'));
  const hasECR = allActions.some((a: string) => a.includes('ecr'));
  const hasAppRunner = allActions.some((a: string) => a.includes('apprunner'));
  
  console.log(`   S3 permissions: ${hasS3 ? '✅' : '❌'}`);
  console.log(`   ECR permissions: ${hasECR ? '✅' : '❌'}`);
  console.log(`   App Runner permissions: ${hasAppRunner ? '✅' : '❌'}\n`);
  
} catch (error: any) {
  console.log(`   ⚠️  Could not read policy document: ${error.message}`);
  console.log(`   This might be a permissions issue - policy might need IAM read permissions\n`);
}

// Test actual permissions
console.log('🧪 Testing actual permissions...\n');

const tests = [
  { name: 'S3', command: 'aws s3 ls' },
  { name: 'ECR', command: 'aws ecr describe-repositories --region us-east-1' },
  { name: 'CloudFront', command: 'aws cloudfront list-distributions --query "DistributionList.Items[0].Id" --output text' },
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    execSync(test.command, { stdio: 'pipe', encoding: 'utf-8' });
    console.log(`   ✅ ${test.name}: Working`);
    passed++;
  } catch (error: any) {
    if (error.message.includes('AccessDenied')) {
      console.log(`   ⚠️  ${test.name}: Access Denied (permissions may still be propagating)`);
    } else if (error.message.includes('SubscriptionRequired')) {
      console.log(`   ⚠️  ${test.name}: Service requires subscription`);
    } else {
      console.log(`   ⚠️  ${test.name}: ${error.message.split('\n')[0]}`);
    }
    failed++;
  }
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('\n💡 If permissions are denied:');
  console.log('   1. Wait 1-2 minutes for propagation');
  console.log('   2. Check policy document has correct actions');
  console.log('   3. Verify policy is attached to user');
  console.log('   4. Try logging out/in: aws configure');
}

