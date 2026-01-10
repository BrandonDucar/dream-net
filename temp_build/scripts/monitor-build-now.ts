#!/usr/bin/env tsx
/**
 * Monitor Vercel Build - Accepts token as argument or env var
 */

const token = process.argv[2] || process.env.VERCEL_TOKEN;

if (!token) {
  console.error('❌ No Vercel token provided!');
  console.log('\nUsage:');
  console.log('  pnpm tsx scripts/monitor-build-now.ts YOUR_TOKEN');
  console.log('  Or set: $env:VERCEL_TOKEN="your_token"');
  console.log('\nGet token from: https://vercel.com/account/tokens');
  process.exit(1);
}

// Set it for the check script
process.env.VERCEL_TOKEN = token;

// Import and run the monitor
import('./monitor-vercel-build.ts').catch(() => {
  // If import fails, run check-vercel-status instead
  import('./check-vercel-status.ts');
});

