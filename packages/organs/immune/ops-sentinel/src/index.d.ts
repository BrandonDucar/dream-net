/**
 * @dreamnet/ops-sentinel
 * Enforces DreamNet OPS_CONTRACT at runtime and in CI
 */
export { loadOpsContract, type OpsContract, type FrontendConfig, type BackendConfig, type IntegrationDescriptor, type EnvVarDescriptor, } from './contracts.js';
export { validateVercelConfig, validatePackageScripts, validateRepoStructure, validateRepoSetup, type ValidationResult, } from './checks.js';
export { getFrontendBuildPlan, getBackendDeployPlan, getIntegrationConfig, getIntegrationsByCategory, getRequiredEnvVars, type BuildPlan, type DeployPlan, } from './advice.js';
//# sourceMappingURL=index.d.ts.map