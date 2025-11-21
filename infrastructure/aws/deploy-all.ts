#!/usr/bin/env tsx
/**
 * AWS Deployment Script
 * 
 * Deploys DreamNet to AWS:
 * - Frontend: S3 + CloudFront (static hosting)
 * - Backend: App Runner (containerized service)
 * 
 * Usage: pnpm deploy:aws
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const S3_BUCKET = process.env.AWS_S3_BUCKET || `dreamnet-frontend-${Date.now()}`;
const CLOUDFRONT_DISTRIBUTION = process.env.AWS_CLOUDFRONT_DISTRIBUTION || '';
const APP_RUNNER_SERVICE = process.env.AWS_APP_RUNNER_SERVICE || 'dreamnet-backend';
const ECR_REPOSITORY = process.env.AWS_ECR_REPOSITORY || 'dreamnet';
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID || '';

console.log('🚀 Starting AWS deployment...\n');
console.log(`📋 Configuration:`);
console.log(`   Region: ${AWS_REGION}`);
console.log(`   S3 Bucket: ${S3_BUCKET}`);
console.log(`   App Runner Service: ${APP_RUNNER_SERVICE}`);
console.log(`   ECR Repository: ${ECR_REPOSITORY}\n`);

// Step 1: Verify AWS CLI is installed
console.log('🔍 Checking AWS CLI...');
try {
  execSync('aws --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Error: AWS CLI not found. Please install it:');
  console.error('   https://aws.amazon.com/cli/');
  process.exit(1);
}

// Step 2: Verify AWS credentials
console.log('🔍 Verifying AWS credentials...');
try {
  execSync('aws sts get-caller-identity', { stdio: 'pipe' });
  console.log('✅ AWS credentials verified\n');
} catch (error) {
  console.error('❌ Error: AWS credentials not configured. Run: aws configure');
  process.exit(1);
}

// Step 3: Build frontend
console.log('📦 Building frontend...');
try {
  execSync('pnpm --filter client build', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ Frontend built successfully\n');
} catch (error) {
  console.error('❌ Frontend build failed');
  process.exit(1);
}

// Step 4: Deploy frontend to S3 + CloudFront
console.log('☁️  Deploying frontend to S3...');
try {
  // Create S3 bucket if it doesn't exist
  try {
    execSync(`aws s3api head-bucket --bucket ${S3_BUCKET} --region ${AWS_REGION}`, { stdio: 'pipe' });
    console.log(`   Bucket ${S3_BUCKET} already exists`);
  } catch {
    console.log(`   Creating bucket ${S3_BUCKET}...`);
    execSync(
      `aws s3api create-bucket --bucket ${S3_BUCKET} --region ${AWS_REGION} --create-bucket-configuration LocationConstraint=${AWS_REGION}`,
      { stdio: 'inherit' }
    );
  }
  
  // Enable static website hosting
  const websiteConfig = {
    IndexDocument: { Suffix: 'index.html' },
    ErrorDocument: { Key: 'index.html' }
  };
  writeFileSync('/tmp/website-config.json', JSON.stringify(websiteConfig));
  execSync(
    `aws s3api put-bucket-website --bucket ${S3_BUCKET} --website-configuration file:///tmp/website-config.json`,
    { stdio: 'inherit' }
  );
  
  // Upload frontend files
  const distPath = join(process.cwd(), 'client', 'dist');
  execSync(
    `aws s3 sync ${distPath} s3://${S3_BUCKET}/ --delete --region ${AWS_REGION}`,
    { stdio: 'inherit' }
  );
  
  console.log('✅ Frontend deployed to S3\n');
} catch (error) {
  console.error('❌ Frontend deployment failed');
  process.exit(1);
}

// Step 5: Create/update CloudFront distribution
console.log('🌐 Setting up CloudFront distribution...');
try {
  if (CLOUDFRONT_DISTRIBUTION) {
    // Invalidate existing distribution
    execSync(
      `aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION} --paths "/*"`,
      { stdio: 'inherit' }
    );
    console.log(`✅ CloudFront cache invalidated\n`);
  } else {
    console.log('⚠️  CLOUDFRONT_DISTRIBUTION not set. Skipping CloudFront setup.');
    console.log('   Frontend available at: http://' + S3_BUCKET + '.s3-website-' + AWS_REGION + '.amazonaws.com');
  }
} catch (error) {
  console.error('⚠️  CloudFront setup failed (non-critical)');
}

// Step 6: Build and push Docker image to ECR
console.log('🐳 Building and pushing Docker image to ECR...');
try {
  if (!AWS_ACCOUNT_ID) {
    const accountId = execSync('aws sts get-caller-identity --query Account --output text', {
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim();
    console.log(`   Detected AWS Account ID: ${accountId}`);
  }
  
  const accountId = AWS_ACCOUNT_ID || execSync('aws sts get-caller-identity --query Account --output text', {
    encoding: 'utf-8',
    stdio: 'pipe'
  }).trim();
  
  const ecrUri = `${accountId}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}`;
  
  // Login to ECR
  execSync(`aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ecrUri}`, {
    stdio: 'inherit'
  });
  
  // Create repository if it doesn't exist
  try {
    execSync(`aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${AWS_REGION}`, { stdio: 'pipe' });
  } catch {
    console.log(`   Creating ECR repository ${ECR_REPOSITORY}...`);
    execSync(`aws ecr create-repository --repository-name ${ECR_REPOSITORY} --region ${AWS_REGION}`, { stdio: 'inherit' });
  }
  
  // Build and push image
  const imageTag = `${ecrUri}:latest`;
  execSync(`docker build -t ${imageTag} -f server/Dockerfile .`, { stdio: 'inherit' });
  execSync(`docker push ${imageTag}`, { stdio: 'inherit' });
  
  console.log('✅ Docker image pushed to ECR\n');
  
  // Step 7: Deploy to App Runner
  console.log('🚀 Deploying backend to App Runner...');
  
  const appRunnerConfig = {
    serviceName: APP_RUNNER_SERVICE,
    sourceConfiguration: {
      imageRepository: {
        imageIdentifier: imageTag,
        imageConfiguration: {
          port: '8080',
          runtimeEnvironmentVariables: loadEnvVars()
        }
      },
      autoDeploymentsEnabled: true
    },
    instanceConfiguration: {
      cpu: '2 vCPU',
      memory: '4 GB'
    }
  };
  
  const configPath = '/tmp/apprunner-config.json';
  writeFileSync(configPath, JSON.stringify(appRunnerConfig, null, 2));
  
  try {
    // Try to update existing service
    execSync(
      `aws apprunner update-service --service-arn $(aws apprunner list-services --query "ServiceSummaryList[?ServiceName=='${APP_RUNNER_SERVICE}'].ServiceArn" --output text) --source-configuration file://${configPath} --region ${AWS_REGION}`,
      { stdio: 'inherit' }
    );
    console.log('✅ App Runner service updated\n');
  } catch {
    // Create new service
    console.log('   Creating new App Runner service...');
    execSync(
      `aws apprunner create-service --service-name ${APP_RUNNER_SERVICE} --source-configuration file://${configPath} --instance-configuration file://${configPath} --region ${AWS_REGION}`,
      { stdio: 'inherit' }
    );
    console.log('✅ App Runner service created\n');
  }
  
} catch (error) {
  console.error('❌ Backend deployment failed');
  console.error('   Note: App Runner requires IAM permissions. Ensure your AWS user has:');
  console.error('   - apprunner:CreateService');
  console.error('   - apprunner:UpdateService');
  console.error('   - ecr:GetAuthorizationToken');
  console.error('   - ecr:BatchGetImage');
  process.exit(1);
}

// Step 8: Get service URLs
console.log('🔗 Retrieving service URLs...');
try {
  const serviceArn = execSync(
    `aws apprunner list-services --query "ServiceSummaryList[?ServiceName=='${APP_RUNNER_SERVICE}'].ServiceArn" --output text --region ${AWS_REGION}`,
    { encoding: 'utf-8', stdio: 'pipe' }
  ).trim();
  
  if (serviceArn) {
    const serviceUrl = execSync(
      `aws apprunner describe-service --service-arn ${serviceArn} --query "Service.ServiceUrl" --output text --region ${AWS_REGION}`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();
    
    console.log('\n✅ Deployment complete!');
    console.log(`\n🌐 Backend URL: ${serviceUrl}`);
    console.log(`\n🌐 Frontend URL: http://${S3_BUCKET}.s3-website-${AWS_REGION}.amazonaws.com`);
    if (CLOUDFRONT_DISTRIBUTION) {
      console.log(`\n🌐 CloudFront URL: https://${CLOUDFRONT_DISTRIBUTION}.cloudfront.net`);
    }
    console.log(`\n📊 View logs: aws apprunner list-operations --service-arn ${serviceArn} --region ${AWS_REGION}`);
  }
} catch (error) {
  console.error('⚠️  Could not retrieve service URLs. Check AWS console.');
}

function loadEnvVars(): Record<string, string> {
  const envVars: Record<string, string> = {};
  
  // Load from .env.aws if it exists
  const envAwsPath = join(process.cwd(), '.env.aws');
  if (existsSync(envAwsPath)) {
    const content = readFileSync(envAwsPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
  }
  
  // Also check for common env vars in process.env
  const commonVars = [
    'DATABASE_URL',
    'NODE_ENV',
    'PORT',
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'GMAIL_REFRESH_TOKEN',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'DISCORD_WEBHOOK_URL',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
    'ALLOWED_ORIGINS',
    'OPERATOR_WALLETS',
  ];
  
  for (const key of commonVars) {
    if (process.env[key] && !envVars[key]) {
      envVars[key] = process.env[key]!;
    }
  }
  
  return envVars;
}

