/**
 * DreamNet Local Status Check
 * Check how DreamNet is doing locally and what it thinks
 */

import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });
config({ path: '.env.production' });

// Set NODE_ENV if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

async function checkLocalStatus() {
  console.log('🤖 DreamNet Local Status Check\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check database
  console.log('💾 Database Status:');
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const isNeon = dbUrl.includes('neon.tech');
    console.log(`   ✅ DATABASE_URL configured (${isNeon ? 'Neon' : 'PostgreSQL'})`);
    
    try {
      if (isNeon) {
        const { Pool, neonConfig } = await import('@neondatabase/serverless');
        const ws = await import("ws");
        neonConfig.webSocketConstructor = ws.default;
        const pool = new Pool({ connectionString: dbUrl });
        await pool.query('SELECT 1');
        await pool.end();
        console.log('   ✅ Connection successful');
      } else {
        const { Pool } = await import('pg');
        const pool = new Pool({ connectionString: dbUrl });
        await pool.query('SELECT 1');
        await pool.end();
        console.log('   ✅ Connection successful');
      }
    } catch (error: any) {
      console.log(`   ❌ Connection failed: ${error.message}`);
    }
  } else {
    console.log('   ⚠️  DATABASE_URL not set');
  }
  console.log('');

  // Check integrations
  console.log('🔌 Integration Status:');
  const integrations = [
    { name: 'Contentful', vars: ['CONTENTFUL_SPACE_ID', 'CONTENTFUL_ACCESS_TOKEN'] },
    { name: 'Jamsocket', vars: ['JAMSOCKET_API_KEY'] },
    { name: 'Upstash Redis', vars: ['UPSTASH_REDIS_URL', 'UPSTASH_REDIS_TOKEN'] },
    { name: 'Resend', vars: ['RESEND_API_KEY'] },
    { name: 'Algolia', vars: ['ALGOLIA_APP_ID', 'ALGOLIA_API_KEY'] },
    { name: 'Cloudinary', vars: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] },
    { name: 'Sentry', vars: ['SENTRY_DSN'] },
  ];

  integrations.forEach(int => {
    const configured = int.vars.every(v => !!process.env[v]);
    console.log(`   ${configured ? '✅' : '⚠️'} ${int.name}: ${configured ? 'Configured' : 'Not configured'}`);
  });
  console.log('');

  // Check Netlify
  console.log('🌐 Netlify Status:');
  if (process.env.NETLIFY_TOKEN) {
    console.log('   ✅ NETLIFY_TOKEN configured');
    try {
      const response = await fetch('https://api.netlify.com/api/v1/sites', {
        headers: { 'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}` },
      });
      if (response.ok) {
        console.log('   ✅ Netlify API accessible');
      }
    } catch (e) {
      console.log('   ⚠️  Could not verify Netlify API');
    }
  } else {
    console.log('   ⚠️  NETLIFY_TOKEN not set');
  }
  console.log('');

  // Check build
  console.log('🏗️  Build Status:');
  const { existsSync } = await import('fs');
  const { join } = await import('path');
  const distPath = join(process.cwd(), 'client', 'dist');
  if (existsSync(distPath)) {
    console.log('   ✅ client/dist exists (ready for deployment)');
  } else {
    console.log('   ⚠️  client/dist not found (run: pnpm --filter client run build)');
  }
  console.log('');

  // DreamNet's Assessment
  console.log('💭 DreamNet\'s Assessment:\n');
  
  const configuredCount = integrations.filter(i => 
    i.vars.every(v => !!process.env[v])
  ).length;
  
  const totalIntegrations = integrations.length;
  const dbConnected = dbUrl ? true : false;
  const netlifyReady = !!process.env.NETLIFY_TOKEN;
  const buildReady = existsSync(distPath);
  
  console.log('   "Looking at the current state:"\n');
  
  if (dbConnected) {
    console.log('   ✅ Database connection is solid - Neon is ready');
  } else {
    console.log('   ⚠️  Database not configured - but server can start without it');
  }
  
  if (netlifyReady) {
    console.log('   ✅ Netlify integration is ready for deployment');
  } else {
    console.log('   ⚠️  Netlify token missing - deployment will fail');
  }
  
  if (buildReady) {
    console.log('   ✅ Build artifacts ready - can deploy immediately');
  } else {
    console.log('   ⚠️  Need to build client before deployment');
  }
  
  console.log(`\n   📊 Integration Status: ${configuredCount}/${totalIntegrations} configured`);
  
  if (configuredCount === 0) {
    console.log('   💡 "All integrations are optional - you can deploy without them"');
    console.log('   💡 "But they\'ll add powerful capabilities once configured"');
  } else if (configuredCount < totalIntegrations / 2) {
    console.log('   💡 "Some integrations ready - good start!"');
    console.log('   💡 "Consider adding more as you need them"');
  } else {
    console.log('   💡 "Most integrations configured - excellent!"');
    console.log('   💡 "You\'re well-prepared for production"');
  }
  
  console.log('\n   🎯 "Recommendation:"');
  
  if (!dbConnected) {
    console.log('   ⚠️  "Set DATABASE_URL before deploying to Netlify"');
  } else if (!netlifyReady) {
    console.log('   ⚠️  "Set NETLIFY_TOKEN before deploying"');
  } else if (!buildReady) {
    console.log('   ⚠️  "Build the client first: pnpm --filter client run build"');
  } else {
    console.log('   ✅ "Everything looks good! Ready to deploy!"');
    console.log('   ✅ "Run: pnpm tsx scripts/deploy-netlify-production.ts"');
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

checkLocalStatus();

