/**
 * Setup Netlify Database Environment Variables
 * Connects Neon/Liquid Metal to DreamNet
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load .env files
config({ path: '.env' });
config({ path: '.env.local' });
config({ path: '.env.production' });

async function setupNetlifyDatabase() {
  console.log('🔧 Setting up Netlify Database Connection...\n');

  const token = process.env.NETLIFY_TOKEN;
  if (!token) {
    console.error('❌ NETLIFY_TOKEN not set');
    process.exit(1);
  }

  const siteName = process.env.NETLIFY_SITE_NAME || 'dreamnet-hub';
  const databaseUrl = process.env.DATABASE_URL_TO_SET || process.env.DATABASE_URL;
  
  if (databaseUrl) {
    console.log(`✅ Found DATABASE_URL in environment (length: ${databaseUrl.length})`);
  }
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
    const hasDatabaseUrl = envVars.some((env: any) => env.key === 'DATABASE_URL');

    if (hasDatabaseUrl) {
      console.log('✅ DATABASE_URL already configured');
      const dbUrl = envVars.find((env: any) => env.key === 'DATABASE_URL');
      console.log(`   Value: ${dbUrl?.values?.[0]?.value?.substring(0, 30)}...`);
    } else {
      console.log('⚠️  DATABASE_URL not found');
      
      // Try to get from Neon/Liquid Metal integration
      console.log('\n🔍 Checking for Neon/Liquid Metal integrations...');
      
      // Check if we can get database connection from integrations
      // Note: Netlify API doesn't expose integration secrets directly
      // User needs to add DATABASE_URL manually or provide connection string
      
      console.log('\n📝 To add DATABASE_URL via API, provide your connection string:');
      console.log('   pnpm tsx scripts/setup-netlify-database.ts --set "postgresql://..."');
      console.log('\n📝 Or add manually:');
      console.log('1. Go to: https://app.netlify.com/sites/dreamnet-hub/settings/env');
      console.log('2. Click "Add a variable"');
      console.log('3. Key: DATABASE_URL');
      console.log('4. Value: Your Neon/Liquid Metal connection string');
      console.log('5. Scope: Production (and Preview if needed)');
      console.log('6. Save');
      console.log('\n💡 Connection string format:');
      console.log('   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require');
      console.log('\n💡 You can find it in:');
      console.log('   - Neon Dashboard → Your Project → Connection Details');
      console.log('   - Netlify Dashboard → Integrations → Neon/Liquid Metal');
    }

      // If DATABASE_URL is provided (from env or parameter), set it
      if (databaseUrl && !hasDatabaseUrl) {
        console.log('\n🔧 Found DATABASE_URL in environment, setting it on Netlify...');
        
        // Use Netlify CLI to set environment variable (more reliable)
        const { execSync } = await import('child_process');
        
        try {
          console.log('   Using Netlify CLI to set DATABASE_URL...');
          
          // Set for production
          execSync(`netlify env:set DATABASE_URL "${databaseUrl}" --context production --site ${site.id}`, {
            encoding: 'utf-8',
            env: { ...process.env, NETLIFY_AUTH_TOKEN: token },
            stdio: 'pipe',
          });
          
          // Set for deploy previews
          execSync(`netlify env:set DATABASE_URL "${databaseUrl}" --context deploy-preview --site ${site.id}`, {
            encoding: 'utf-8',
            env: { ...process.env, NETLIFY_AUTH_TOKEN: token },
            stdio: 'pipe',
          });
          
          console.log('✅ DATABASE_URL set successfully via CLI!');
          console.log('   Next deployment will connect to Neon/Liquid Metal');
        } catch (cliError: any) {
          console.log('   CLI method failed, trying API...');
          
          // Fallback to API (may require different endpoint format)
          const setEnvResponse = await fetch(`${apiBase}/sites/${site.id}/env`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              key: 'DATABASE_URL',
              values: [
                {
                  value: databaseUrl,
                  context: 'production',
                },
                {
                  value: databaseUrl,
                  context: 'deploy-preview',
                },
              ],
            }),
          });

          if (setEnvResponse.ok) {
            console.log('✅ DATABASE_URL set successfully via API!');
          } else {
            const error = await setEnvResponse.text();
            console.error('❌ Failed to set DATABASE_URL via API:', error);
            console.log('\n💡 Please set it manually:');
            console.log(`   1. Go to: https://app.netlify.com/sites/${site.name}/settings/env`);
            console.log('   2. Click "Add a variable"');
            console.log('   3. Key: DATABASE_URL');
            console.log(`   4. Value: ${databaseUrl.substring(0, 50)}...`);
            console.log('   5. Scope: Production and Deploy Preview');
            console.log('   6. Save');
          }
        }
      }

      console.log('\n📋 Current environment variables:');
      const updatedEnvVars = databaseUrl && !hasDatabaseUrl 
        ? await fetch(`${apiBase}/sites/${site.id}/env`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }).then(r => r.json())
        : envVars;
      
      updatedEnvVars.forEach((env: any) => {
        const value = env.values?.[0]?.value || '***';
        const preview = value.length > 50 ? value.substring(0, 50) + '...' : value;
        console.log(`   ${env.key}: ${preview}`);
      });

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

setupNetlifyDatabase();

