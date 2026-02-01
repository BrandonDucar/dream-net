/**
 * OPS_CONTRACT Type Definitions
 * Parsed representation of docs/OPS_CONTRACT.md
 */
export interface FrontendConfig {
    rootDirectory: string;
    installCommand: string;
    buildCommand: string;
    outputDirectory: string;
    rewrites: Array<{
        source: string;
        destination: string;
    }>;
}
export interface BackendConfig {
    serviceRoot: string;
    installCommand: string;
    buildCommand: string;
    startCommand: string;
}
export interface IntegrationDescriptor {
    name: string;
    category: 'Infra' | 'Blockchain' | 'Comms' | 'Payments' | 'AI' | 'Social' | 'Internal';
    codeLocations: string[];
    requiredEnvVars: string[];
    status: 'active' | 'planned' | 'deprecated';
}
export interface EnvVarDescriptor {
    name: string;
    required: boolean;
    description: string;
    scope: 'frontend' | 'backend' | 'both';
}
export interface OpsContract {
    version: string;
    frontend: FrontendConfig;
    backend: BackendConfig;
    integrations: IntegrationDescriptor[];
    envVars: EnvVarDescriptor[];
}
/**
 * Load the canonical OPS_CONTRACT definition
 */
export declare function loadOpsContract(): OpsContract;
//# sourceMappingURL=contracts.d.ts.map