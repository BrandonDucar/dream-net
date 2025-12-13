/**
 * Check Database Contents
 * See what's actually in the Neon database
 */

import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });
config({ path: '.env.production' });

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

async function checkDatabase() {
  console.log('🔍 Checking DreamNet Database Contents...\n');

  const dbUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
  if (!dbUrl) {
    console.log('❌ No database URL found');
    return;
  }

  const isNeon = dbUrl.includes('neon.tech');

  try {
    let pool: any;
    
    if (isNeon) {
      const { Pool, neonConfig } = await import('@neondatabase/serverless');
      const ws = await import("ws");
      neonConfig.webSocketConstructor = ws.default;
      pool = new Pool({ connectionString: dbUrl });
    } else {
      const { Pool } = await import('pg');
      pool = new Pool({ connectionString: dbUrl });
    }

    console.log('📊 Database Schema:\n');

    // Get all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  No tables found - database is empty');
      console.log('   💡 Run migrations to create tables: pnpm db:push\n');
    } else {
      console.log(`   Found ${tablesResult.rows.length} tables:\n`);
      
      for (const row of tablesResult.rows) {
        const tableName = row.table_name;
        
        // Get row count
        const countResult = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const count = parseInt(countResult.rows[0].count);
        
        // Get columns
        const columnsResult = await pool.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position;
        `, [tableName]);
        
        const icon = count > 0 ? '📦' : '📭';
        console.log(`   ${icon} ${tableName}: ${count} rows`);
        console.log(`      Columns: ${columnsResult.rows.map((r: any) => r.column_name).join(', ')}`);
        
        // Show sample data if exists
        if (count > 0 && count <= 5) {
          const sampleResult = await pool.query(`SELECT * FROM ${tableName} LIMIT 3`);
          console.log(`      Sample data:`);
          sampleResult.rows.forEach((r: any, i: number) => {
            const preview = JSON.stringify(r).substring(0, 100);
            console.log(`         ${i + 1}. ${preview}...`);
          });
        } else if (count > 5) {
          const sampleResult = await pool.query(`SELECT * FROM ${tableName} LIMIT 1`);
          console.log(`      Sample: ${JSON.stringify(sampleResult.rows[0]).substring(0, 80)}...`);
        }
        console.log('');
      }
    }

    // Check for migrations
    const migrationsResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%migration%' OR table_name LIKE '%drizzle%';
    `);

    if (migrationsResult.rows.length > 0) {
      console.log('📋 Migration Tables:');
      migrationsResult.rows.forEach((row: any) => {
        console.log(`   - ${row.table_name}`);
      });
      console.log('');
    }

    // Total summary
    let totalRows = 0;
    for (const row of tablesResult.rows) {
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM ${row.table_name}`);
      totalRows += parseInt(countResult.rows[0].count);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📊 Database Summary:`);
    console.log(`   Tables: ${tablesResult.rows.length}`);
    console.log(`   Total Rows: ${totalRows}`);
    console.log(`   Status: ${totalRows === 0 ? 'Empty (ready for data)' : 'Has data'}\n`);

    if (totalRows === 0) {
      console.log('💡 Database is empty - this is normal for a fresh setup!');
      console.log('💡 Tables will be created automatically when DreamNet starts');
      console.log('💡 Or run migrations manually: pnpm db:push\n');
    }

    await pool.end();
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('\n💡 Database is empty - tables need to be created');
      console.log('💡 Run: pnpm db:push to create schema\n');
    }
  }
}

checkDatabase();

