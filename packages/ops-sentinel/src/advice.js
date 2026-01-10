/**
 * Advice Functions
 * Return plain JSON objects for build/deploy plans
 */
/**
 * Get frontend build plan for Vercel
 */
export function getFrontendBuildPlan(contract) {
    return {
        steps: [
            {
                name: 'Install dependencies',
                command: contract.frontend.installCommand,
                description: 'Install client workspace dependencies',
            },
            {
                name: 'Build',
                command: contract.frontend.buildCommand,
                description: 'Build production frontend bundle',
            },
        ],
        outputDirectory: contract.frontend.outputDirectory,
        environment: {
            NODE_ENV: 'production',
        },
    };
}
/**
 * Get backend deploy plan for Railway
 */
export function getBackendDeployPlan(contract) {
    return {
        platform: 'railway',
        steps: [
            {
                name: 'Install dependencies',
                command: contract.backend.installCommand,
                description: 'Install all workspace dependencies',
            },
            {
                name: 'Build',
                command: contract.backend.buildCommand,
                description: 'Build server workspace',
            },
            {
                name: 'Start',
                command: contract.backend.startCommand,
                description: 'Start production server',
            },
        ],
        environment: {
            NODE_ENV: 'production',
        },
    };
}
/**
 * Get integration configuration
 */
export function getIntegrationConfig(contract, name) {
    const integration = contract.integrations.find((i) => i.name.toLowerCase() === name.toLowerCase());
    return integration || null;
}
/**
 * Get all integrations by category
 */
export function getIntegrationsByCategory(contract, category) {
    return contract.integrations.filter((i) => i.category === category);
}
/**
 * Get required environment variables for a scope
 */
export function getRequiredEnvVars(contract, scope) {
    return contract.envVars
        .filter((ev) => ev.scope === scope || ev.scope === 'both')
        .filter((ev) => ev.required)
        .map((ev) => ev.name);
}
//# sourceMappingURL=advice.js.map