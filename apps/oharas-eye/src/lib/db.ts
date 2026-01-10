import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from "@dreamnet/shared"; // Point to shared schema

const connectionString = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

if (!connectionString) {
    console.warn('DATABASE_URL is not set for the Mini-App. Database features will be disabled.');
}

const pool = new Pool({
    connectionString: connectionString || "postgres://localhost:5432/placeholder"
});
export const db = drizzle(pool, { schema });
