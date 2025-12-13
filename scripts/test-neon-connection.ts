/**
 * Test Neon Database Connection
 * Verifies database connectivity and integration status
 */

import { config } from 'dotenv';

// Load .env files
config({ path: '.env' });
config({ path: '.env.local' });
config({ path: '.env.production' });

async function testNeonConnection() {
  console.log('🧪 Testing Neon Database Connection...\n');

  const netlifyDbUrl = process.env.NETLIFY_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL;

  console.log('📋 Environment Check:');
  console.log(`   NETLIFY_DATABASE_URL: ${netlifyDbUrl ? '✅ Set' : '❌ Not set'}`);
  console.log(`   DATABASE_URL: ${databaseUrl ? '✅ Set' : '❌ Not set'}`);
  
  if (netlifyDbUrl) {
    console.log(`   NETLIFY_DATABASE_URL length: ${netlifyDbUrl.length}`);
  }
  if (databaseUrl) {
    const preview = databaseUrl.substring(0, 50) + '...';
    console.log(`   DATABASE_URL preview: ${preview}`);
  }
  console.log('');

  if (!netlifyDbUrl && !databaseUrl) {
    console.error('❌ No database URL found');
    console.log('\n💡 Set one of:');
    console.log('   - NETLIFY_DATABASE_URL (for Netlify Neon integration)');
    console.log('   - DATABASE_URL (for standard Neon/PostgreSQL)');
    process.exit(1);
  }

  try {
    // Test Netlify Neon integration if available
    if (netlifyDbUrl) {
      console.log('🔄 Testing Netlify Neon integration...');
      try {
        const { neon } = await import('@netlify/neon');
        const sql = neon();
        
        const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
        console.log('✅ Netlify Neon connection successful!');
        console.log(`   Current time: ${result[0].current_time}`);
        console.log(`   PostgreSQL version: ${result[0].pg_version.substring(0, 50)}...`);
        
        // Test a simple query
        const testResult = await sql`SELECT 1 as test_value`;
        console.log(`   Test query result: ${testResult[0].test_value}`);
        
        return;
      } catch (netlifyError: any) {
        console.log(`   ⚠️  Netlify SDK error: ${netlifyError.message}`);
        console.log('   Falling back to standard connection...\n');
      }
    }

    // Test standard Neon connection
    if (databaseUrl) {
      console.log('🔄 Testing standard Neon/PostgreSQL connection...');
      
      const isNeon = databaseUrl.includes('neon.tech');
      
      if (isNeon) {
        const { Pool, neonConfig } = await import('@neondatabase/serverless');
        const ws = await import("ws");
        neonConfig.webSocketConstructor = ws.default;
        
        const pool = new Pool({ connectionString: databaseUrl });
        
        const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
        console.log('✅ Neon connection successful!');
        console.log(`   Current time: ${result.rows[0].current_time}`);
        console.log(`   PostgreSQL version: ${result.rows[0].pg_version.substring(0, 50)}...`);
        
        await pool.end();
      } else {
        const { Pool } = await import('pg');
        const pool = new Pool({ connectionString: databaseUrl });
        
        const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
        console.log('✅ PostgreSQL connection successful!');
        console.log(`   Current time: ${result.rows[0].current_time}`);
        console.log(`   PostgreSQL version: ${result.rows[0].pg_version.substring(0, 50)}...`);
        
        await pool.end();
      }
    }

    console.log('\n✅ Database connection test completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Database connection test failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 DNS resolution failed - check your database host');
    } else if (error.message.includes('password') || error.message.includes('authentication')) {
      console.error('\n💡 Authentication failed - check your database credentials');
    } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Connection refused - check if database is accessible');
    }
    
    process.exit(1);
  }
}

testNeonConnection();

