#!/usr/bin/env tsx
/**
 * Test AWS SDK Connectivity
 * 
 * Verifies:
 * - AWS CLI is installed
 * - AWS credentials are configured
 * - Can authenticate and access AWS services
 * 
 * Usage: pnpm tsx scripts/test-aws-sdk.ts
 */

import { execSync } from 'child_process';

console.log('🔍 Testing AWS SDK/CLI...\n');

// Configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

console.log(`📋 Configuration:`);
console.log(`   Region: ${AWS_REGION}\n`);

const results = {
  cliInstalled: false,
  credentialsConfigured: false,
  accountAccessible: false,
  s3Accessible: false,
  ecrAccessible: false,
  appRunnerAccessible: false,
  cloudFrontAccessible: false,
  errors: [] as string[]
};

// Test 1: Check AWS CLI installation
console.log('1️⃣ Testing AWS CLI Installation...');
try {
  const version = execSync('aws --version', { encoding: 'utf-8', stdio: 'pipe' }).trim();
  console.log(`   ✅ AWS CLI installed: ${version}`);
  results.cliInstalled = true;
} catch (error: any) {
  results.errors.push(`AWS CLI: ${error.message}`);
  console.error(`   ❌ AWS CLI not found: ${error.message}`);
  console.log('   💡 Install AWS CLI: https://aws.amazon.com/cli/');
}

// Test 2: Check credentials
console.log('\n2️⃣ Testing Credentials...');
try {
  const identity = JSON.parse(
    execSync('aws sts get-caller-identity', { encoding: 'utf-8', stdio: 'pipe' }).trim()
  );
  console.log(`   ✅ AWS credentials configured`);
  console.log(`      Account ID: ${identity.Account}`);
  console.log(`      User ARN: ${identity.Arn}`);
  console.log(`      User ID: ${identity.UserId}`);
  results.credentialsConfigured = true;
  results.accountAccessible = true;
} catch (error: any) {
  results.errors.push(`Credentials: ${error.message}`);
  console.error(`   ❌ AWS credentials not configured: ${error.message}`);
  console.log('   💡 To set up credentials:');
  console.log('      aws configure');
  console.log('      # OR set environment variables:');
  console.log('      export AWS_ACCESS_KEY_ID=your-key');
  console.log('      export AWS_SECRET_ACCESS_KEY=your-secret');
  console.log('      export AWS_REGION=us-east-1');
}

// Test 3: Test S3
console.log('\n3️⃣ Testing S3...');
try {
  const buckets = JSON.parse(
    execSync(`aws s3api list-buckets --region ${AWS_REGION}`, { 
      encoding: 'utf-8', 
      stdio: 'pipe' 
    }).trim()
  );
  console.log(`   ✅ S3 accessible`);
  console.log(`      Found ${buckets.Buckets?.length || 0} buckets`);
  if (buckets.Buckets && buckets.Buckets.length > 0) {
    buckets.Buckets.slice(0, 3).forEach((bucket: any) => {
      console.log(`      - ${bucket.Name} (created: ${bucket.CreationDate})`);
    });
  }
  results.s3Accessible = true;
} catch (error: any) {
  results.errors.push(`S3: ${error.message}`);
  console.error(`   ❌ Cannot access S3: ${error.message}`);
  console.log('   💡 Ensure:');
  console.log('      - Credentials have s3:ListAllMyBuckets permission');
}

// Test 4: Test ECR
console.log('\n4️⃣ Testing ECR (Elastic Container Registry)...');
try {
  const repos = JSON.parse(
    execSync(`aws ecr describe-repositories --region ${AWS_REGION}`, { 
      encoding: 'utf-8', 
      stdio: 'pipe' 
    }).trim()
  );
  console.log(`   ✅ ECR accessible`);
  console.log(`      Found ${repos.repositories?.length || 0} repositories`);
  if (repos.repositories && repos.repositories.length > 0) {
    repos.repositories.slice(0, 3).forEach((repo: any) => {
      console.log(`      - ${repo.repositoryName} (${repo.repositoryUri})`);
    });
  }
  results.ecrAccessible = true;
} catch (error: any) {
  results.errors.push(`ECR: ${error.message}`);
  console.error(`   ❌ Cannot access ECR: ${error.message}`);
  console.log('   💡 Ensure:');
  console.log('      - Credentials have ecr:DescribeRepositories permission');
}

// Test 5: Test App Runner
console.log('\n5️⃣ Testing App Runner...');
try {
  const services = JSON.parse(
    execSync(`aws apprunner list-services --region ${AWS_REGION}`, { 
      encoding: 'utf-8', 
      stdio: 'pipe' 
    }).trim()
  );
  console.log(`   ✅ App Runner accessible`);
  console.log(`      Found ${services.ServiceSummaryList?.length || 0} services`);
  if (services.ServiceSummaryList && services.ServiceSummaryList.length > 0) {
    services.ServiceSummaryList.slice(0, 3).forEach((service: any) => {
      console.log(`      - ${service.ServiceName} (${service.Status})`);
    });
  }
  results.appRunnerAccessible = true;
} catch (error: any) {
  results.errors.push(`App Runner: ${error.message}`);
  console.error(`   ❌ Cannot access App Runner: ${error.message}`);
  console.log('   💡 Ensure:');
  console.log('      - Credentials have apprunner:ListServices permission');
  console.log('      - App Runner is available in your region');
}

// Test 6: Test CloudFront
console.log('\n6️⃣ Testing CloudFront...');
try {
  const distributions = JSON.parse(
    execSync(`aws cloudfront list-distributions --region ${AWS_REGION}`, { 
      encoding: 'utf-8', 
      stdio: 'pipe' 
    }).trim()
  );
  console.log(`   ✅ CloudFront accessible`);
  const distCount = distributions.DistributionList?.Items?.length || 0;
  console.log(`      Found ${distCount} distributions`);
  if (distributions.DistributionList?.Items && distributions.DistributionList.Items.length > 0) {
    distributions.DistributionList.Items.slice(0, 3).forEach((dist: any) => {
      console.log(`      - ${dist.Id} (${dist.Status})`);
    });
  }
  results.cloudFrontAccessible = true;
} catch (error: any) {
  results.errors.push(`CloudFront: ${error.message}`);
  console.error(`   ❌ Cannot access CloudFront: ${error.message}`);
  console.log('   💡 Ensure:');
  console.log('      - Credentials have cloudfront:ListDistributions permission');
  console.log('      - Note: CloudFront is global, not region-specific');
}

// Summary
console.log('\n📊 Summary:');
console.log(`   CLI Installed: ${results.cliInstalled ? '✅' : '❌'}`);
console.log(`   Credentials Configured: ${results.credentialsConfigured ? '✅' : '❌'}`);
console.log(`   Account Accessible: ${results.accountAccessible ? '✅' : '❌'}`);
console.log(`   S3 Accessible: ${results.s3Accessible ? '✅' : '❌'}`);
console.log(`   ECR Accessible: ${results.ecrAccessible ? '✅' : '❌'}`);
console.log(`   App Runner Accessible: ${results.appRunnerAccessible ? '✅' : '❌'}`);
console.log(`   CloudFront Accessible: ${results.cloudFrontAccessible ? '✅' : '❌'}`);

if (results.errors.length > 0) {
  console.log('\n❌ Errors:');
  results.errors.forEach(err => console.log(`   - ${err}`));
}

const allPassed = results.cliInstalled && 
                  results.credentialsConfigured && 
                  results.accountAccessible && 
                  results.s3Accessible && 
                  results.ecrAccessible && 
                  results.appRunnerAccessible && 
                  results.cloudFrontAccessible;

if (allPassed) {
  console.log('\n✅ All AWS SDK/CLI tests passed!');
  console.log('\n🚀 Ready to deploy: pnpm deploy:aws');
} else {
  console.log('\n⚠️  Some tests failed. See above for details.');
  console.log('\n💡 Next Steps:');
  if (!results.cliInstalled) {
    console.log('   1. Install AWS CLI: https://aws.amazon.com/cli/');
  }
  if (!results.credentialsConfigured) {
    console.log('   2. Configure credentials:');
    console.log('      aws configure');
    console.log('      # OR set environment variables');
  }
  if (!results.s3Accessible || !results.ecrAccessible || !results.appRunnerAccessible) {
    console.log('   3. Ensure IAM permissions:');
    console.log('      - AmazonS3FullAccess (or custom policy)');
    console.log('      - AmazonEC2ContainerRegistryFullAccess');
    console.log('      - AWSAppRunnerFullAccess (or custom policy)');
    console.log('      - CloudFrontFullAccess (or custom policy)');
  }
  process.exit(1);
}

