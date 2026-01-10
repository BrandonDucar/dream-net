/**
 * Advice Functions
 * Return plain JSON objects for build/deploy plans
 */

import type { OpsContract, IntegrationDescriptor } from './contracts.js';

export interface BuildPlan {
  steps: Array<{
    name: string;
    command: string;
    description: string;
  }>;
  outputDirectory: string;
  environment: Record<string, string>;
}

export interface DeployPlan {
  platform: 'vercel' | 'railway';
  steps: Array<{
    name: string;
    command: string;
    description: string;
  }>;
  environment: Record<string, string>;
}

/**
 * Get frontend build plan for Vercel
 */
export function getFrontendBuildPlan(contract: OpsContract): BuildPlan {
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
export function getBackendDeployPlan(contract: OpsContract): DeployPlan {
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
export function getIntegrationConfig(
  contract: OpsContract,
  name: string
): IntegrationDescriptor | null {
  const integration = contract.integrations.find(
    (i) => i.name.toLowerCase() === name.toLowerCase()
  );
  return integration || null;
}

/**
 * Get all integrations by category
 */
export function getIntegrationsByCategory(
  contract: OpsContract,
  category: IntegrationDescriptor['category']
): IntegrationDescriptor[] {
  return contract.integrations.filter((i) => i.category === category);
}

/**
 * Get required environment variables for a scope
 */
export function getRequiredEnvVars(
  contract: OpsContract,
  scope: 'frontend' | 'backend' | 'both'
): string[] {
  return contract.envVars
    .filter((ev) => ev.scope === scope || ev.scope === 'both')
    .filter((ev) => ev.required)
    .map((ev) => ev.name);
}

