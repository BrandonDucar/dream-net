#!/usr/bin/env node

/**
 * Lightweight migration helper.
 *
 * This script intentionally does not mutate the database.
 * It lists available SQL migration files so preview builds
 * can confirm the expected order without applying them.
 *
 * To apply migrations:
 *   psql "$NEON_DATABASE_URL" -f migrations/<file>.sql
 */

import { readdir } from "node:fs/promises";
import path from "node:path";

async function main() {
  const migrationsDir = path.resolve(process.cwd(), "migrations");
  try {
    const files = await readdir(migrationsDir);
    const sqlFiles = files.filter((file) => file.endsWith(".sql")).sort();

    console.log("🔍 DreamNet migration catalog (dry run):");
    if (sqlFiles.length === 0) {
      console.log("  No SQL migrations found.");
      return;
    }

    for (const file of sqlFiles) {
      console.log(`  - ${file}`);
    }

    console.log("\nNo database changes were applied. Use psql to run migrations manually.");
  } catch (error) {
    console.error("⚠️ Unable to read migrations directory:", (error instanceof Error ? error.message : error));
    process.exitCode = 1;
  }
}

main();
