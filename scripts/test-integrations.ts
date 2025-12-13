/**
 * Test All Integrations
 */

import { config } from 'dotenv';
import { getContentfulClient } from '../packages/contentful-core/src/index.js';
import { getJamsocketClient } from '../packages/jamsocket-core/src/index.js';
import { getUpstashRedisClient } from '../packages/upstash-redis-core/src/index.js';
import { getResendClient } from '../packages/resend-core/src/index.js';
import { getAlgoliaClient } from '../packages/algolia-core/src/index.js';
import { getCloudinaryClient } from '../packages/cloudinary-core/src/index.js';
import { createSentryIntegration } from '../packages/sentry-core/src/index.js';

// Load .env files
config({ path: '.env' });
config({ path: '.env.local' });
config({ path: '.env.production' });

async function testIntegrations() {
  console.log('🧪 Testing All Integrations...\n');

  const results: Array<{ name: string; status: '✅' | '⚠️' | '❌'; message: string }> = [];

  // Test Contentful
  console.log('📝 Testing Contentful...');
  const contentful = getContentfulClient();
  if (contentful) {
    try {
      const entries = await contentful.getEntries();
      results.push({ name: 'Contentful', status: '✅', message: `Connected (${entries.total} entries)` });
    } catch (error: any) {
      results.push({ name: 'Contentful', status: '❌', message: error.message });
    }
  } else {
    results.push({ name: 'Contentful', status: '⚠️', message: 'Not configured (needs CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN)' });
  }

  // Test Jamsocket
  console.log('🎮 Testing Jamsocket...');
  const jamsocket = getJamsocketClient();
  if (jamsocket) {
    try {
      const backends = await jamsocket.listBackends();
      results.push({ name: 'Jamsocket', status: '✅', message: `Connected (${backends.length} backends)` });
    } catch (error: any) {
      results.push({ name: 'Jamsocket', status: '❌', message: error.message });
    }
  } else {
    results.push({ name: 'Jamsocket', status: '⚠️', message: 'Not configured (needs JAMSOCKET_API_KEY)' });
  }

  // Test Upstash Redis
  console.log('💾 Testing Upstash Redis...');
  const redis = getUpstashRedisClient();
  if (redis) {
    try {
      await redis.set('test', 'value', { ex: 10 });
      const value = await redis.get('test');
      await redis.del('test');
      results.push({ name: 'Upstash Redis', status: '✅', message: 'Connected and working' });
    } catch (error: any) {
      results.push({ name: 'Upstash Redis', status: '❌', message: error.message });
    }
  } else {
    results.push({ name: 'Upstash Redis', status: '⚠️', message: 'Not configured (needs UPSTASH_REDIS_URL, UPSTASH_REDIS_TOKEN)' });
  }

  // Test Resend
  console.log('📧 Testing Resend...');
  const resend = getResendClient();
  if (resend) {
    results.push({ name: 'Resend', status: '✅', message: 'Client created (ready to send emails)' });
  } else {
    results.push({ name: 'Resend', status: '⚠️', message: 'Not configured (needs RESEND_API_KEY)' });
  }

  // Test Algolia
  console.log('🔍 Testing Algolia...');
  const algolia = getAlgoliaClient();
  if (algolia) {
    results.push({ name: 'Algolia', status: '✅', message: 'Client created (ready for search)' });
  } else {
    results.push({ name: 'Algolia', status: '⚠️', message: 'Not configured (needs ALGOLIA_APP_ID, ALGOLIA_API_KEY)' });
  }

  // Test Cloudinary
  console.log('🖼️  Testing Cloudinary...');
  const cloudinary = getCloudinaryClient();
  if (cloudinary) {
    results.push({ name: 'Cloudinary', status: '✅', message: 'Client created (ready for image uploads)' });
  } else {
    results.push({ name: 'Cloudinary', status: '⚠️', message: 'Not configured (needs CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)' });
  }

  // Test Sentry
  console.log('🐛 Testing Sentry...');
  try {
    createSentryIntegration();
    if (process.env.SENTRY_DSN) {
      results.push({ name: 'Sentry', status: '✅', message: 'Initialized (error tracking active)' });
    } else {
      results.push({ name: 'Sentry', status: '⚠️', message: 'Not configured (needs SENTRY_DSN)' });
    }
  } catch (error: any) {
    results.push({ name: 'Sentry', status: '❌', message: error.message });
  }

  // Summary
  console.log('\n📊 Integration Test Results:\n');
  results.forEach(result => {
    console.log(`   ${result.status} ${result.name}: ${result.message}`);
  });

  const configured = results.filter(r => r.status === '✅').length;
  const total = results.length;
  
  console.log(`\n✅ ${configured}/${total} integrations configured`);
  console.log('💡 Add missing environment variables to enable more integrations\n');
}

testIntegrations();

