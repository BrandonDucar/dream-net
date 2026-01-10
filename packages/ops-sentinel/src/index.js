/**
 * @dreamnet/ops-sentinel
 * Enforces DreamNet OPS_CONTRACT at runtime and in CI
 */
export { loadOpsContract, } from './contracts.js';
export { validateVercelConfig, validatePackageScripts, validateRepoStructure, validateRepoSetup, } from './checks.js';
export { getFrontendBuildPlan, getBackendDeployPlan, getIntegrationConfig, getIntegrationsByCategory, getRequiredEnvVars, } from './advice.js';
//# sourceMappingURL=index.js.map