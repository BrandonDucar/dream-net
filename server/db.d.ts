import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
export declare const pool: Pool | null;
export declare const db: ReturnType<typeof drizzle> | null;
export declare function getDb(): ReturnType<typeof drizzle>;
export declare function getPool(): Pool;
export declare function isDbAvailable(): boolean;
export declare function getDbStatus(): {
    initialized: boolean;
    available: boolean;
    hasUrl: boolean;
};
export declare const mongoDb: {
    collection: (name: string) => {
        insertOne: (document: any) => Promise<{
            insertedId: string;
        }>;
        find: (query: any) => {
            toArray: () => Promise<never[]>;
        };
    };
};
