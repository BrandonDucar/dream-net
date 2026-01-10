/**
 * Deploy to Vercel Production
 */

import { execSync } from 'child_process';

console.log('🚀 Deploying to Vercel Production...\n');

try {
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch {
    console.log('📦 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Build
  console.log('📦 Building for Vercel...');
  execSync('pnpm run vercel-build', { stdio: 'inherit' });

  // Deploy
  console.log('\n🚀 Deploying to Vercel...');
  execSync('vercel --prod --yes', { stdio: 'inherit' });

  console.log('\n✅ Deployment complete!');
  console.log('🌐 Your app should be live at: https://dreamnet.ink');
} catch (error: any) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

