/**
 * Validation Checks
 * Functions to validate repo setup against OPS_CONTRACT
 */
import type { OpsContract } from './contracts.js';
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
/**
 * Validate Vercel configuration
 */
export declare function validateVercelConfig(contract: OpsContract, repoRoot?: string): ValidationResult;
/**
 * Validate package.json scripts
 */
export declare function validatePackageScripts(contract: OpsContract, repoRoot?: string): ValidationResult;
/**
 * Validate repo structure
 */
export declare function validateRepoStructure(repoRoot?: string): ValidationResult;
/**
 * Validate complete repo setup
 */
export declare function validateRepoSetup(contract: OpsContract, repoRoot?: string): ValidationResult;
//# sourceMappingURL=checks.d.ts.map