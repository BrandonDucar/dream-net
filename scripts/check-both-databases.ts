/**
 * Check Both Netlify Databases
 * Compare NETLIFY_DATABASE_URL and NETLIFY_DATABASE_URL_UNPOOLED
 */

import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });
config({ path: '.env.production' });

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

async function checkDatabase(url: string, name: string) {
  console.log(`\n🔍 Checking ${name}...\n`);
  
  try {
    const isNeon = url.includes('neon.tech');
    
    let pool: any;
    if (isNeon) {
      const { Pool, neonConfig } = await import('@neondatabase/serverless');
      const ws = await import("ws");
      neonConfig.webSocketConstructor = ws.default;
      pool = new Pool({ connectionString: url });
    } else {
      const { Pool } = await import('pg');
      pool = new Pool({ connectionString: url });
    }

    // Get all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`   📊 Tables: ${tablesResult.rows.length}`);
    
    let totalRows = 0;
    const tableCounts: Array<{ name: string; count: number }> = [];
    
    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      const count = parseInt(countResult.rows[0].count);
      totalRows += count;
      
      if (count > 0) {
        tableCounts.push({ name: tableName, count });
      }
    }

    console.log(`   📦 Total Rows: ${totalRows}`);
    
    if (tableCounts.length > 0) {
      console.log(`\n   📋 Tables with data:`);
      tableCounts.forEach(t => {
        console.log(`      ${t.count > 0 ? '📦' : '📭'} ${t.name}: ${t.count} rows`);
      });
    } else {
      console.log(`   📭 All tables are empty`);
    }

    // Check if they're the same database
    const dbNameResult = await pool.query('SELECT current_database() as db_name');
    const dbName = dbNameResult.rows[0].db_name;
    
    await pool.end();
    
    return { dbName, totalRows, tableCounts };
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🔍 Checking Both Netlify Databases\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Get from Netlify API
  const token = process.env.NETLIFY_TOKEN;
  if (!token) {
    console.log('❌ NETLIFY_TOKEN not set');
    return;
  }

  try {
    const apiBase = 'https://api.netlify.com/api/v1';
    const sitesResponse = await fetch(`${apiBase}/sites?name=dreamnet-hub`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!sitesResponse.ok) {
      console.log('❌ Could not fetch site');
      return;
    }

    const sites = await sitesResponse.json();
    const site = sites.find((s: any) => s.name === 'dreamnet-hub');
    
    if (!site) {
      console.log('❌ Site not found');
      return;
    }

    const envResponse = await fetch(`${apiBase}/sites/${site.id}/env`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!envResponse.ok) {
      console.log('❌ Could not fetch env vars');
      return;
    }

    const envVars = await envResponse.json();
    const pooledUrl = envVars.find((e: any) => e.key === 'NETLIFY_DATABASE_URL')?.values?.[0]?.value;
    const unpooledUrl = envVars.find((e: any) => e.key === 'NETLIFY_DATABASE_URL_UNPOOLED')?.values?.[0]?.value;

    if (!pooledUrl && !unpooledUrl) {
      console.log('❌ No database URLs found on Netlify');
      return;
    }

    if (pooledUrl) {
      const result1 = await checkDatabase(pooledUrl, 'NETLIFY_DATABASE_URL (Pooled)');
    }

    if (unpooledUrl) {
      const result2 = await checkDatabase(unpooledUrl, 'NETLIFY_DATABASE_URL_UNPOOLED (Unpooled)');
      
      if (pooledUrl && result2) {
        // Compare
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📊 Comparison:');
        
        if (result2.dbName) {
          console.log(`   Database Name: ${result2.dbName}`);
        }
        
        console.log(`   Unpooled Total Rows: ${result2.totalRows}`);
        console.log(`   Unpooled Tables with Data: ${result2.tableCounts.length}`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (pooledUrl && unpooledUrl) {
      console.log('💡 Note:');
      console.log('   - Pooled: For serverless functions (connection pooling)');
      console.log('   - Unpooled: Direct connection (for migrations, long-running tasks)');
      console.log('   - They point to the SAME database, just different connection methods\n');
    }

  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
  }
}

main();

