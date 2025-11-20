/**
 * Validation Checks
 * Functions to validate repo setup against OPS_CONTRACT
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { OpsContract, FrontendConfig, BackendConfig } from './contracts.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate Vercel configuration
 */
export function validateVercelConfig(
  contract: OpsContract,
  repoRoot: string = process.cwd()
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const vercelJsonPath = join(repoRoot, 'vercel.json');
  if (!existsSync(vercelJsonPath)) {
    errors.push('vercel.json not found at repo root');
    return { valid: false, errors, warnings };
  }

  try {
    const vercelJson = JSON.parse(readFileSync(vercelJsonPath, 'utf-8'));
    const expected = contract.frontend;

    // Check rootDirectory
    if (vercelJson.rootDirectory !== expected.rootDirectory) {
      errors.push(
        `vercel.json rootDirectory must be "${expected.rootDirectory}", got "${vercelJson.rootDirectory}"`
      );
    }

    // Check installCommand
    if (vercelJson.installCommand !== expected.installCommand) {
      warnings.push(
        `vercel.json installCommand should be "${expected.installCommand}", got "${vercelJson.installCommand}"`
      );
    }

    // Check buildCommand
    if (vercelJson.buildCommand !== expected.buildCommand) {
      warnings.push(
        `vercel.json buildCommand should be "${expected.buildCommand}", got "${vercelJson.buildCommand}"`
      );
    }

    // Check outputDirectory
    if (vercelJson.outputDirectory !== expected.outputDirectory) {
      errors.push(
        `vercel.json outputDirectory must be "${expected.outputDirectory}", got "${vercelJson.outputDirectory}"`
      );
    }

    // Check rewrites
    if (!vercelJson.rewrites || !Array.isArray(vercelJson.rewrites)) {
      warnings.push('vercel.json missing rewrites array');
    } else {
      const apiRewrite = vercelJson.rewrites.find(
        (r: any) => r.source === '/api/:path*'
      );
      if (!apiRewrite) {
        warnings.push('vercel.json missing API rewrite rule');
      }
    }
  } catch (error: any) {
    errors.push(`Failed to parse vercel.json: ${error.message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate package.json scripts
 */
export function validatePackageScripts(
  contract: OpsContract,
  repoRoot: string = process.cwd()
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const rootPackageJsonPath = join(repoRoot, 'package.json');
  if (!existsSync(rootPackageJsonPath)) {
    errors.push('package.json not found at repo root');
    return { valid: false, errors, warnings };
  }

  try {
    const rootPackageJson = JSON.parse(readFileSync(rootPackageJsonPath, 'utf-8'));
    const scripts = rootPackageJson.scripts || {};

    // Check for required scripts
    if (!scripts.build) {
      warnings.push('Root package.json missing "build" script');
    }
    if (!scripts.start) {
      warnings.push('Root package.json missing "start" script');
    }
  } catch (error: any) {
    errors.push(`Failed to parse package.json: ${error.message}`);
  }

  // Check client package.json
  const clientPackageJsonPath = join(repoRoot, 'client', 'package.json');
  if (existsSync(clientPackageJsonPath)) {
    try {
      const clientPackageJson = JSON.parse(
        readFileSync(clientPackageJsonPath, 'utf-8')
      );
      const scripts = clientPackageJson.scripts || {};

      if (!scripts.build) {
        errors.push('client/package.json missing "build" script');
      }
    } catch (error: any) {
      warnings.push(`Failed to parse client/package.json: ${error.message}`);
    }
  } else {
    warnings.push('client/package.json not found');
  }

  // Check server package.json
  const serverPackageJsonPath = join(repoRoot, 'server', 'package.json');
  if (existsSync(serverPackageJsonPath)) {
    try {
      const serverPackageJson = JSON.parse(
        readFileSync(serverPackageJsonPath, 'utf-8')
      );
      const scripts = serverPackageJson.scripts || {};

      if (!scripts.build) {
        errors.push('server/package.json missing "build" script');
      }
      if (!scripts.start) {
        errors.push('server/package.json missing "start" script');
      }
    } catch (error: any) {
      warnings.push(`Failed to parse server/package.json: ${error.message}`);
    }
  } else {
    warnings.push('server/package.json not found');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate repo structure
 */
export function validateRepoStructure(
  repoRoot: string = process.cwd()
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredDirs = ['client', 'server', 'packages'];
  for (const dir of requiredDirs) {
    if (!existsSync(join(repoRoot, dir))) {
      errors.push(`Required directory "${dir}/" not found`);
    }
  }

  // Check for .vercelignore
  const vercelignorePath = join(repoRoot, '.vercelignore');
  if (!existsSync(vercelignorePath)) {
    warnings.push('.vercelignore not found (recommended to exclude apps/site-old)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate complete repo setup
 */
export function validateRepoSetup(
  contract: OpsContract,
  repoRoot: string = process.cwd()
): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Run all validations
  const structureResult = validateRepoStructure(repoRoot);
  allErrors.push(...structureResult.errors);
  allWarnings.push(...structureResult.warnings);

  const vercelResult = validateVercelConfig(contract, repoRoot);
  allErrors.push(...vercelResult.errors);
  allWarnings.push(...vercelResult.warnings);

  const scriptsResult = validatePackageScripts(contract, repoRoot);
  allErrors.push(...scriptsResult.errors);
  allWarnings.push(...scriptsResult.warnings);

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

