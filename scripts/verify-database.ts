#!/usr/bin/env tsx
/**
 * Verify Database Connectivity
 * Tests database connection and basic operations
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

async function verifyDatabase() {
  console.log('🔍 Verifying Database Connectivity...\n');

  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found in environment variables');
    console.log('\n💡 Database is optional - server can start without it');
    console.log('   Some features will be unavailable without database connection.');
    console.log('\n📝 To enable database:');
    console.log('   1. Set DATABASE_URL in Railway environment variables');
    console.log('   2. Or set DATABASE_URL locally in .env file');
    console.log('   3. Format: postgresql://user:password@host:port/database');
    return false;
  }

  console.log('✅ DATABASE_URL found');
  console.log(`   URL length: ${databaseUrl.length} characters`);
  console.log(`   Starts with: ${databaseUrl.substring(0, 20)}...\n`);

  try {
    console.log('🔌 Attempting to connect to database...');
    const pool = new Pool({ connectionString: databaseUrl });
    
    // Test connection with a simple query
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ Database connection successful!\n');
    console.log('📊 Database Info:');
    console.log(`   Current Time: ${result.rows[0].current_time}`);
    console.log(`   PostgreSQL Version: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}\n`);

    // Test if schema exists
    try {
      const schemaCheck = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        LIMIT 5
      `);
      
      if (schemaCheck.rows.length > 0) {
        console.log('✅ Database schema found:');
        schemaCheck.rows.forEach((row: any) => {
          console.log(`   - ${row.table_name}`);
        });
        console.log('');
      } else {
        console.log('⚠️  No tables found in public schema');
        console.log('   Database may need migrations run\n');
      }
    } catch (schemaError: any) {
      console.log('⚠️  Could not check schema:', schemaError.message);
    }

    await pool.end();
    console.log('✅ Database verification complete!');
    return true;

  } catch (error: any) {
    console.error('❌ Database connection failed!');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Connection refused - check:');
      console.log('   - Database host is correct');
      console.log('   - Database is running');
      console.log('   - Firewall allows connections');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Authentication failed - check:');
      console.log('   - Username and password are correct');
      console.log('   - Database user has proper permissions');
    } else if (error.message.includes('does not exist')) {
      console.log('💡 Database not found - check:');
      console.log('   - Database name is correct');
      console.log('   - Database has been created');
    } else {
      console.log('💡 Check DATABASE_URL format:');
      console.log('   postgresql://user:password@host:port/database');
    }
    
    return false;
  }
}

verifyDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Verification script error:', error);
    process.exit(1);
  });

