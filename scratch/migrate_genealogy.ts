import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root
dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not found in environment.");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    console.log("Adding columns to swarm_agents...");
    await client.query(`ALTER TABLE "swarm_agents" ADD COLUMN IF NOT EXISTS "parent_id" varchar;`);
    await client.query(`ALTER TABLE "swarm_agents" ADD COLUMN IF NOT EXISTS "license_level" integer DEFAULT 0;`);
    await client.query(`ALTER TABLE "swarm_agents" ADD COLUMN IF NOT EXISTS "workspace_id" varchar;`);
    await client.query(`ALTER TABLE "swarm_agents" ADD COLUMN IF NOT EXISTS "maturation" jsonb DEFAULT '{"skills": [], "isMature": false, "registrationDate": 0, "mentors": []}'::jsonb;`);
    
    console.log("Creating agent_licenses table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "agent_licenses" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "agent_id" varchar NOT NULL,
        "license_type" text NOT NULL,
        "issued_at" timestamp DEFAULT now() NOT NULL,
        "expires_at" timestamp,
        "revoked" boolean DEFAULT false NOT NULL,
        "metadata" jsonb DEFAULT '{}'::jsonb
      );
    `);
    console.log("✅ Database schema updated.");
  } catch (err) {
    console.error("❌ Failed to update schema:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
