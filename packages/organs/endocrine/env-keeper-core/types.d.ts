/**
 * Env Keeper Core Types
 * Centralized environment variable management
 */
export interface EnvVariable {
    id: string;
    key: string;
    value: string;
    description?: string;
    category: EnvCategory;
    isSecret: boolean;
    required: boolean;
    defaultValue?: string;
    environments: Environment[];
    lastUsedAt?: number;
    createdAt: number;
    updatedAt: number;
    tags: string[];
}
export type EnvCategory = "api_keys" | "database" | "auth" | "services" | "deployment" | "monitoring" | "integrations" | "other";
export type Environment = "development" | "staging" | "production" | "local";
export interface EnvKeeperStatus {
    initialized: boolean;
    totalVars: number;
    secretsCount: number;
    categories: Record<EnvCategory, number>;
    lastSyncAt: number | null;
    syncSources: string[];
}
export interface EnvSyncSource {
    id: string;
    type: "vercel" | "aws_secrets" | "github_secrets" | "local" | "env_file";
    name: string;
    status: "connected" | "disconnected" | "error";
    lastSyncAt: number | null;
    varCount: number;
}
export interface EnvKeeperContext {
}
/**
 * Env Variable Sensitivity Classification
 */
export type EnvSensitivity = "public" | "internal" | "secret";
export interface EnvVarDescriptor {
    key: string;
    value?: string;
    sensitivity: EnvSensitivity;
    source: "process" | "file" | "runtime";
    lastUpdatedAt?: string;
}
/**
 * In-memory registry of classified env vars
 */
export declare const ENV_REGISTRY: Record<string, EnvVarDescriptor>;
//# sourceMappingURL=types.d.ts.map