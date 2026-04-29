import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * 🛠️ DreamNet DB Setup
 * Ensures the Neon PostgreSQL database has all required tables.
 */

async function setup() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = new Pool({ connectionString: databaseUrl });

  console.log("🛠️ [DB Setup] Initializing database schema...");

  try {
    // 1. Guilds Table
    console.log("📦 Creating 'guilds' table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "guilds" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "charter" text,
        "leader_id" varchar,
        "member_count" integer DEFAULT 0,
        "metadata" jsonb DEFAULT '{}'::jsonb,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    // 2. Swarm Agents Table
    console.log("🐝 Creating 'swarm_agents' table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "swarm_agents" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" text NOT NULL,
        "type" text NOT NULL,
        "guild_id" text,
        "status" text DEFAULT 'idle',
        "wallet_address" text,
        "capabilities" text[] DEFAULT '{}'::text[],
        "last_heartbeat" timestamp DEFAULT now(),
        "metadata" jsonb DEFAULT '{}'::jsonb,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    // 3. API Keys Table
    console.log("🔑 Creating 'dreamnet_api_keys' table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "dreamnet_api_keys" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "key_hash" text NOT NULL UNIQUE,
        "key_prefix" text NOT NULL,
        "user_id" varchar,
        "wallet_address" text,
        "name" text NOT NULL,
        "description" text,
        "permissions" jsonb DEFAULT '[]'::jsonb,
        "rate_limit" integer DEFAULT 1000,
        "last_used_at" timestamp,
        "expires_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "revoked_at" timestamp,
        "created_by" text
      );
    `);

    console.log("✅ [DB Setup] Schema initialization complete.");
  } catch (error) {
    console.error("❌ [DB Setup] Failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setup();
