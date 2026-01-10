export declare const pool: any;
export declare const db: any;
export declare function getDb(): any;
export declare function getPool(): any;
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
