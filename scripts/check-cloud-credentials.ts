#!/usr/bin/env tsx
/**
 * Check Cloud Credentials
 * 
 * Checks what cloud provider credentials are available
 * and what we can access
 */

console.log('🔍 Checking Cloud Credentials...\n');

// Google Cloud / Firebase
const googleCreds = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  FIREBASE_TOKEN: process.env.FIREBASE_TOKEN,
  GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
};

// AWS
const awsCreds = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
};

// Railway
const railwayCreds = {
  RAILWAY_TOKEN: process.env.RAILWAY_TOKEN,
};

console.log('📊 Available Credentials:\n');

console.log('🔵 Google Cloud / Firebase:');
let googleAvailable = false;
Object.entries(googleCreds).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const display = value ? (key.includes('SECRET') || key.includes('TOKEN') ? '***hidden***' : value.substring(0, 20) + '...') : 'not set';
  console.log(`  ${status} ${key}: ${display}`);
  if (value) googleAvailable = true;
});

console.log('\n🟠 AWS:');
let awsAvailable = false;
Object.entries(awsCreds).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const display = value ? (key.includes('SECRET') || key.includes('KEY') ? '***hidden***' : value) : 'not set';
  console.log(`  ${status} ${key}: ${display}`);
  if (value) awsAvailable = true;
});

console.log('\n🚂 Railway:');
let railwayAvailable = false;
Object.entries(railwayCreds).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const display = value ? '***hidden***' : 'not set';
  console.log(`  ${status} ${key}: ${display}`);
  if (value) railwayAvailable = true;
});

console.log('\n📋 Summary:');
console.log(`  Google Cloud: ${googleAvailable ? '✅ Available' : '❌ Not configured'}`);
console.log(`  AWS: ${awsAvailable ? '✅ Available' : '❌ Not configured'}`);
console.log(`  Railway: ${railwayAvailable ? '✅ Available' : '❌ Not configured'}`);

console.log('\n💡 What I Can Do:');
if (googleAvailable) {
  console.log('  ✅ Deploy to Google Cloud Run');
  console.log('  ✅ Use Firebase Hosting');
  console.log('  ✅ Access Google Cloud Storage');
  console.log('  ✅ Use Cloud SQL');
}
if (awsAvailable) {
  console.log('  ✅ Deploy to AWS Amplify');
  console.log('  ✅ Use AWS S3');
  console.log('  ✅ Use AWS Lambda');
  console.log('  ✅ Use AWS EC2');
}
if (railwayAvailable) {
  console.log('  ✅ Deploy to Railway');
  console.log('  ✅ Manage Railway projects');
}

console.log('\n📝 To Enable Access:');
if (!googleAvailable) {
  console.log('  Google Cloud:');
  console.log('    - Set GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)');
  console.log('    - Or set GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET');
  console.log('    - Or set FIREBASE_TOKEN for Firebase CLI');
}
if (!awsAvailable) {
  console.log('  AWS:');
  console.log('    - Set AWS_ACCESS_KEY_ID');
  console.log('    - Set AWS_SECRET_ACCESS_KEY');
  console.log('    - Set AWS_REGION (optional, defaults to us-east-1)');
}

console.log('\n🔐 Security Note:');
console.log('  - Credentials should be in .env file (not committed to git)');
console.log('  - For production, use Railway/Vercel environment variables');
console.log('  - Never commit credentials to repository');

