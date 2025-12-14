/**
 * Pre-Deployment Test Suite
 * Tests everything before Netlify deployment with Neon and all integrations
 */

import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

// Load .env files
config({ path: '.env' });
config({ path: '.env.local' });
config({ path: '.env.production' });

// Set NODE_ENV if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

interface TestResult {
  name: string;
  status: '✅' | '⚠️' | '❌';
  message: string;
  critical: boolean;
}

const results: TestResult[] = [];

async function testDatabase() {
  console.log('💾 Testing Database (Neon)...');
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    results.push({
      name: 'Database Connection',
      status: '❌',
      message: 'DATABASE_URL not set in environment',
      critical: true,
    });
    return;
  }

  try {
    // Test connection directly
    const isNeon = dbUrl.includes('neon.tech');
    
    if (isNeon) {
      const { Pool, neonConfig } = await import('@neondatabase/serverless');
      const ws = await import("ws");
      neonConfig.webSocketConstructor = ws.default;
      
      const pool = new Pool({ connectionString: dbUrl });
      const result = await pool.query('SELECT NOW()');
      await pool.end();
      
      results.push({
        name: 'Database Connection',
        status: '✅',
        message: `Neon PostgreSQL connected (${result.rows[0].now})`,
        critical: true,
      });
    } else {
      const { Pool } = await import('pg');
      const pool = new Pool({ connectionString: dbUrl });
      const result = await pool.query('SELECT NOW()');
      await pool.end();
      
      results.push({
        name: 'Database Connection',
        status: '✅',
        message: `PostgreSQL connected (${result.rows[0].now})`,
        critical: true,
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Database Connection',
      status: '❌',
      message: `Connection failed: ${error.message}`,
      critical: true,
    });
  }
}

async function testNetlify() {
  console.log('🌐 Testing Netlify...');
  
  const token = process.env.NETLIFY_TOKEN;
  if (!token) {
    results.push({
      name: 'Netlify Token',
      status: '❌',
      message: 'NETLIFY_TOKEN not set',
      critical: true,
    });
    return;
  }

  try {
    const response = await fetch('https://api.netlify.com/api/v1/sites', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      results.push({
        name: 'Netlify API',
        status: '✅',
        message: 'API connection successful',
        critical: true,
      });
    } else {
      results.push({
        name: 'Netlify API',
        status: '❌',
        message: `API error: ${response.statusText}`,
        critical: true,
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Netlify API',
      status: '❌',
      message: error.message,
      critical: true,
    });
  }
}

async function testIntegrations() {
  console.log('🔌 Testing Integrations...');

  // Contentful
  const contentful = process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN;
  results.push({
    name: 'Contentful',
    status: contentful ? '✅' : '⚠️',
    message: contentful ? 'Configured' : 'Not configured (optional)',
    critical: false,
  });

  // Jamsocket
  const jamsocket = process.env.JAMSOCKET_API_KEY;
  results.push({
    name: 'Jamsocket',
    status: jamsocket ? '✅' : '⚠️',
    message: jamsocket ? 'Configured' : 'Not configured (optional)',
    critical: false,
  });

  // Upstash Redis
  const redis = process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN;
  results.push({
    name: 'Upstash Redis',
    status: redis ? '✅' : '⚠️',
    message: redis ? 'Configured' : 'Not configured (optional)',
    critical: false,
  });

  // Resend
  const resend = process.env.RESEND_API_KEY;
  results.push({
    name: 'Resend',
    status: resend ? '✅' : '⚠️',
    message: resend ? 'Configured' : 'Not configured (optional)',
    critical: false,
  });

  // Algolia
  const algolia = process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY;
  results.push({
    name: 'Algolia',
    status: algolia ? '✅' : '⚠️',
    message: algolia ? 'Configured' : 'Not configured (optional)',
    critical: false,
  });

  // Cloudinary
  const cloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;
  results.push({
    name: 'Cloudinary',
    status: cloudinary ? '✅' : '⚠️',
    message: cloudinary ? 'Configured' : 'Not configured (optional)',
    critical: false,
  });

  // Sentry
  const sentry = process.env.SENTRY_DSN;
  results.push({
    name: 'Sentry',
    status: sentry ? '✅' : '⚠️',
    message: sentry ? 'Configured' : 'Not configured (optional)',
    critical: false,
  });
}

async function testBuild() {
  console.log('🏗️  Testing Build...');
  
  const distPath = join(process.cwd(), 'client', 'dist');
  if (existsSync(distPath)) {
    results.push({
      name: 'Client Build',
      status: '✅',
      message: 'client/dist exists',
      critical: true,
    });
  } else {
    results.push({
      name: 'Client Build',
      status: '⚠️',
      message: 'client/dist not found - run: pnpm --filter client run build',
      critical: true,
    });
  }
}

async function testNetlifyEnvVars() {
  console.log('🔐 Testing Netlify Environment Variables...');
  
  const token = process.env.NETLIFY_TOKEN;
  if (!token) {
    results.push({
      name: 'Netlify Env Sync',
      status: '⚠️',
      message: 'Cannot check (NETLIFY_TOKEN not set)',
      critical: false,
    });
    return;
  }

  try {
    const apiBase = 'https://api.netlify.com/api/v1';
    const sitesResponse = await fetch(`${apiBase}/sites?name=dreamnet-hub`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!sitesResponse.ok) {
      results.push({
        name: 'Netlify Env Sync',
        status: '⚠️',
        message: 'Cannot fetch site info',
        critical: false,
      });
      return;
    }

    const sites = await sitesResponse.json();
    const site = sites.find((s: any) => s.name === 'dreamnet-hub');
    
    if (!site) {
      results.push({
        name: 'Netlify Env Sync',
        status: '⚠️',
        message: 'Site not found',
        critical: false,
      });
      return;
    }

    const envResponse = await fetch(`${apiBase}/sites/${site.id}/env`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (envResponse.ok) {
      const envVars = await envResponse.json();
      const keys = envVars.map((e: any) => e.key);
      
      // Check for either DATABASE_URL or NETLIFY_DATABASE_URL (Netlify's native Neon)
      const hasDatabase = keys.includes('DATABASE_URL') || keys.includes('NETLIFY_DATABASE_URL');
      const optional = ['CONTENTFUL_SPACE_ID', 'JAMSOCKET_API_KEY', 'UPSTASH_REDIS_URL', 'RESEND_API_KEY', 'ALGOLIA_APP_ID', 'CLOUDINARY_CLOUD_NAME', 'SENTRY_DSN'];
      
      const configuredOptional = optional.filter(o => keys.includes(o));
      
      if (hasDatabase) {
        const dbVar = keys.includes('NETLIFY_DATABASE_URL') ? 'NETLIFY_DATABASE_URL' : 'DATABASE_URL';
        results.push({
          name: 'Netlify Env Sync',
          status: '✅',
          message: `Database configured (${dbVar}) - ${configuredOptional.length}/${optional.length} optional integrations`,
          critical: true,
        });
      } else {
        results.push({
          name: 'Netlify Env Sync',
          status: '❌',
          message: 'Missing: DATABASE_URL or NETLIFY_DATABASE_URL',
          critical: true,
        });
      }
    }
  } catch (error: any) {
    results.push({
      name: 'Netlify Env Sync',
      status: '⚠️',
      message: error.message,
      critical: false,
    });
  }
}

async function askDreamNet() {
  console.log('\n🤖 Asking DreamNet for recommendations...\n');
  
  try {
    // Try public endpoint first
    const heartbeatResponse = await fetch('https://dreamnet.ink/api/heartbeat');
    
    if (heartbeatResponse.ok) {
      const heartbeat = await heartbeatResponse.json();
      console.log('💬 DreamNet says:\n');
      console.log('   "Hello! I\'m online and ready."\n');
      
      if (heartbeat.status === 'healthy') {
        console.log('   ✅ All systems operational');
      }
      
      // Try to get recommendations via chat endpoint if we have API key
      const apiKey = process.env.DREAMNET_API_KEY;
      if (apiKey) {
        try {
          const chatResponse = await fetch('https://dreamnet.ink/api/chatgpt-agent/chat', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: 'What recommendations do you have for deploying to Netlify with Neon and all integrations? What should we focus on?',
            }),
          });

          if (chatResponse.ok) {
            const chat = await chatResponse.json();
            console.log('   📋 Recommendations:\n');
            
            if (chat.suggestions && chat.suggestions.length > 0) {
              chat.suggestions.forEach((s: string, i: number) => {
                console.log(`   ${i + 1}. ${s}`);
              });
            }
            
            if (chat.actions && chat.actions.length > 0) {
              console.log('\n   🎯 Suggested Actions:');
              chat.actions.forEach((a: any, i: number) => {
                console.log(`   ${i + 1}. ${a.method} ${a.endpoint}`);
                if (a.description) {
                  console.log(`      ${a.description}`);
                }
              });
            }
          }
        } catch (error) {
          // API key might not be set, that's okay
        }
      } else {
        console.log('   💡 Set DREAMNET_API_KEY to get personalized recommendations');
      }
    } else {
      console.log('   ⚠️  DreamNet API not reachable (might be local only)');
    }
  } catch (error: any) {
    console.log(`   ⚠️  Could not reach DreamNet: ${error.message}`);
    console.log('   (This is okay if DreamNet is not deployed yet)');
  }
}

async function runTests() {
  console.log('🧪 Pre-Deployment Test Suite\n');
  console.log('Testing everything before Netlify deployment...\n');

  await testDatabase();
  await testNetlify();
  await testIntegrations();
  await testBuild();
  await testNetlifyEnvVars();

  // Summary
  console.log('\n📊 Test Results:\n');
  
  const critical = results.filter(r => r.critical);
  const passed = results.filter(r => r.status === '✅');
  const warnings = results.filter(r => r.status === '⚠️');
  const failed = results.filter(r => r.status === '❌');
  
  results.forEach(result => {
    const icon = result.critical ? '🔴' : '🟡';
    console.log(`   ${result.status} ${icon} ${result.name}: ${result.message}`);
  });

  console.log('\n📈 Summary:');
  console.log(`   ✅ Passed: ${passed.length}/${results.length}`);
  console.log(`   ⚠️  Warnings: ${warnings.length}`);
  console.log(`   ❌ Failed: ${failed.length}`);
  
  const criticalFailed = critical.filter(r => r.status === '❌');
  if (criticalFailed.length > 0) {
    console.log(`\n❌ Critical failures (must fix before deploy):`);
    criticalFailed.forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
    console.log('\n⚠️  Do not deploy until critical issues are resolved!\n');
    process.exit(1);
  } else {
    console.log('\n✅ All critical tests passed! Ready for deployment.\n');
  }

  // Ask DreamNet
  await askDreamNet();

  console.log('\n🚀 Ready to deploy!');
  console.log('   Run: pnpm tsx scripts/deploy-netlify-production.ts\n');
}

runTests();

