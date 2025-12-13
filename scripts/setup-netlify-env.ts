/**
 * Setup Netlify Environment Variables
 * Sets multiple environment variables on Netlify from local .env files
 */

import { config } from 'dotenv';
import { execSync } from 'child_process';

// Load .env files
config({ path: '.env' });
config({ path: '.env.local' });
config({ path: '.env.production' });

async function setupNetlifyEnv() {
  console.log('🔧 Setting up Netlify Environment Variables...\n');

  const token = process.env.NETLIFY_TOKEN;
  if (!token) {
    console.error('❌ NETLIFY_TOKEN not set');
    process.exit(1);
  }

  const siteName = process.env.NETLIFY_SITE_NAME || 'dreamnet-hub';
  const apiBase = 'https://api.netlify.com/api/v1';

  console.log(`📡 Fetching site info for: ${siteName}...`);

  try {
    // Get site info
    const sitesResponse = await fetch(`${apiBase}/sites?name=${encodeURIComponent(siteName)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!sitesResponse.ok) {
      throw new Error(`Failed to fetch sites: ${sitesResponse.statusText}`);
    }

    const sites = await sitesResponse.json();
    const site = sites.find((s: any) => s.name === siteName || s.ssl_url?.includes(siteName));

    if (!site) {
      console.error(`❌ Site ${siteName} not found`);
      process.exit(1);
    }

    console.log(`✅ Found site: ${site.name} (${site.id})\n`);

    // Get current environment variables
    const envResponse = await fetch(`${apiBase}/sites/${site.id}/env`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!envResponse.ok) {
      throw new Error(`Failed to fetch env vars: ${envResponse.statusText}`);
    }

    const envVars = await envResponse.json();
    const existingKeys = new Set(envVars.map((env: any) => env.key));

    // Variables to set (from local .env)
    const varsToSet: Array<{ key: string; value: string }> = [];

    // Database
    if (process.env.DATABASE_URL && !existingKeys.has('DATABASE_URL')) {
      varsToSet.push({ key: 'DATABASE_URL', value: process.env.DATABASE_URL });
    }

    // Contentful
    if (process.env.CONTENTFUL_SPACE_ID && !existingKeys.has('CONTENTFUL_SPACE_ID')) {
      varsToSet.push({ key: 'CONTENTFUL_SPACE_ID', value: process.env.CONTENTFUL_SPACE_ID });
    }
    if (process.env.CONTENTFUL_ACCESS_TOKEN && !existingKeys.has('CONTENTFUL_ACCESS_TOKEN')) {
      varsToSet.push({ key: 'CONTENTFUL_ACCESS_TOKEN', value: process.env.CONTENTFUL_ACCESS_TOKEN });
    }
    if (process.env.CONTENTFUL_ENVIRONMENT && !existingKeys.has('CONTENTFUL_ENVIRONMENT')) {
      varsToSet.push({ key: 'CONTENTFUL_ENVIRONMENT', value: process.env.CONTENTFUL_ENVIRONMENT });
    }
    if (process.env.CONTENTFUL_PREVIEW_TOKEN && !existingKeys.has('CONTENTFUL_PREVIEW_TOKEN')) {
      varsToSet.push({ key: 'CONTENTFUL_PREVIEW_TOKEN', value: process.env.CONTENTFUL_PREVIEW_TOKEN });
    }

    // Jamsocket
    if (process.env.JAMSOCKET_API_KEY && !existingKeys.has('JAMSOCKET_API_KEY')) {
      varsToSet.push({ key: 'JAMSOCKET_API_KEY', value: process.env.JAMSOCKET_API_KEY });
    }

    if (varsToSet.length === 0) {
      console.log('✅ All environment variables are already set on Netlify');
      console.log('\n📋 Current environment variables:');
      envVars.forEach((env: any) => {
        const value = env.values?.[0]?.value || '***';
        const preview = value.length > 50 ? value.substring(0, 50) + '...' : value;
        console.log(`   ${env.key}: ${preview}`);
      });
      return;
    }

    console.log(`📝 Found ${varsToSet.length} variable(s) to set:\n`);
    varsToSet.forEach(v => {
      const preview = v.value.length > 30 ? v.value.substring(0, 30) + '...' : v.value;
      console.log(`   ${v.key}: ${preview}`);
    });
    console.log('');

    // Try to set via Netlify CLI first (more reliable)
    let cliSuccess = true;
    for (const { key, value } of varsToSet) {
      try {
        console.log(`🔧 Setting ${key} via Netlify CLI...`);
        
        // Set for production
        execSync(`netlify env:set ${key} "${value}" --context production --site ${site.id}`, {
          encoding: 'utf-8',
          env: { ...process.env, NETLIFY_AUTH_TOKEN: token },
          stdio: 'pipe',
        });
        
        // Set for deploy previews
        execSync(`netlify env:set ${key} "${value}" --context deploy-preview --site ${site.id}`, {
          encoding: 'utf-8',
          env: { ...process.env, NETLIFY_AUTH_TOKEN: token },
          stdio: 'pipe',
        });
        
        console.log(`   ✅ ${key} set successfully\n`);
      } catch (error: any) {
        console.log(`   ⚠️  CLI failed for ${key}, will try manual instructions\n`);
        cliSuccess = false;
      }
    }

    if (!cliSuccess) {
      console.log('\n💡 Some variables couldn\'t be set via CLI. Please set them manually:');
      console.log(`   1. Go to: https://app.netlify.com/sites/${site.name}/settings/env`);
      console.log('   2. Click "Add a variable" for each:');
      varsToSet.forEach(v => {
        const preview = v.value.length > 50 ? v.value.substring(0, 50) + '...' : v.value;
        console.log(`      - Key: ${v.key}, Value: ${preview}`);
      });
      console.log('   3. Scope: Production and Deploy Preview');
      console.log('   4. Save');
    } else {
      console.log('✅ All environment variables set successfully!');
      console.log('   Next deployment will use these variables');
    }

    // Show final status
    console.log('\n📋 Current environment variables:');
    const finalEnvResponse = await fetch(`${apiBase}/sites/${site.id}/env`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (finalEnvResponse.ok) {
      const finalEnvVars = await finalEnvResponse.json();
      finalEnvVars.forEach((env: any) => {
        const value = env.values?.[0]?.value || '***';
        const preview = value.length > 50 ? value.substring(0, 50) + '...' : value;
        console.log(`   ${env.key}: ${preview}`);
      });
    }

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

setupNetlifyEnv();
