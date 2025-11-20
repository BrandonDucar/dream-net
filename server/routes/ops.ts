/**
 * OPS Contract API Routes
 * Exposes ops-sentinel functionality via HTTP API
 */

import express from 'express';
import {
  loadOpsContract,
  validateRepoSetup,
  getFrontendBuildPlan,
  getBackendDeployPlan,
  getIntegrationConfig,
  getIntegrationsByCategory,
  getRequiredEnvVars,
} from '@dreamnet/ops-sentinel';

const router = express.Router();

/**
 * GET /api/ops/contract
 * Get the OPS_CONTRACT definition
 */
router.get('/contract', async (req, res) => {
  try {
    const contract = loadOpsContract();
    res.json({
      success: true,
      contract: {
        version: contract.version,
        frontend: contract.frontend,
        backend: contract.backend,
        // Don't expose full integration/env details, just summary
        integrationCount: contract.integrations.length,
        envVarCount: contract.envVars.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ops/validate
 * Validate repo setup against OPS_CONTRACT
 */
router.get('/validate', async (req, res) => {
  try {
    const contract = loadOpsContract();
    const result = validateRepoSetup(contract);
    res.json({
      success: result.valid,
      valid: result.valid,
      errors: result.errors,
      warnings: result.warnings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ops/build-plan/frontend
 * Get frontend build plan for Vercel
 */
router.get('/build-plan/frontend', async (req, res) => {
  try {
    const contract = loadOpsContract();
    const plan = getFrontendBuildPlan(contract);
    res.json({
      success: true,
      plan,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ops/build-plan/backend
 * Get backend deploy plan for Railway
 */
router.get('/build-plan/backend', async (req, res) => {
  try {
    const contract = loadOpsContract();
    const plan = getBackendDeployPlan(contract);
    res.json({
      success: true,
      plan,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ops/integration/:name
 * Get integration configuration by name
 */
router.get('/integration/:name', async (req, res) => {
  try {
    const contract = loadOpsContract();
    const integration = getIntegrationConfig(contract, req.params.name);
    if (!integration) {
      return res.status(404).json({
        success: false,
        error: `Integration "${req.params.name}" not found`,
      });
    }
    res.json({
      success: true,
      integration: {
        name: integration.name,
        category: integration.category,
        codeLocations: integration.codeLocations,
        requiredEnvVars: integration.requiredEnvVars,
        status: integration.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ops/integrations/:category
 * Get all integrations by category
 */
router.get('/integrations/:category', async (req, res) => {
  try {
    const contract = loadOpsContract();
    const category = req.params.category as
      | 'Infra'
      | 'Blockchain'
      | 'Comms'
      | 'Payments'
      | 'AI'
      | 'Social'
      | 'Internal';
    const integrations = getIntegrationsByCategory(contract, category);
    res.json({
      success: true,
      category,
      integrations: integrations.map((i) => ({
        name: i.name,
        category: i.category,
        codeLocations: i.codeLocations,
        requiredEnvVars: i.requiredEnvVars,
        status: i.status,
      })),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ops/env-vars/:scope
 * Get required environment variables for a scope
 */
router.get('/env-vars/:scope', async (req, res) => {
  try {
    const contract = loadOpsContract();
    const scope = req.params.scope as 'frontend' | 'backend' | 'both';
    const envVars = getRequiredEnvVars(contract, scope);
    res.json({
      success: true,
      scope,
      envVars,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ops/status
 * Get system status summary
 */
router.get('/status', async (req, res) => {
  try {
    // Return system status summary
    res.json({
      success: true,
      dreams: 127,
      nodes: 45,
      agents: 6,
      clouds: 12,
      wallets: 89,
      apps: 8,
      status: 'online',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ops/agents
 * Get agent status list
 */
router.get('/agents', async (req, res) => {
  try {
    // Return agent status list
    // TODO: Connect to real agent registry
    res.json({
      success: true,
      agents: [
        {
          id: 'lucid',
          name: 'LUCID',
          codename: 'Logic Unification & Command Interface Daemon',
          status: 'online',
          scope: ['routing', 'orchestration'],
          description: 'Routes logic, detects failure patterns',
          trustScore: 95,
          lastAction: 'Processed dream routing request',
          lastActionAt: new Date().toISOString(),
          errorCount: 0,
        },
        {
          id: 'canvas',
          name: 'CANVAS',
          codename: 'Visual Layer Weaver',
          status: 'online',
          scope: ['frontend', 'ui'],
          description: 'Scaffolds and generates frontend dream components',
          trustScore: 88,
          lastAction: 'Generated UI component',
          lastActionAt: new Date().toISOString(),
          errorCount: 0,
        },
        {
          id: 'root',
          name: 'ROOT',
          codename: 'Subconscious Architect',
          status: 'online',
          scope: ['backend', 'schema'],
          description: 'Builds backend schemas, APIs, storage logic',
          trustScore: 92,
          lastAction: 'Created database schema',
          lastActionAt: new Date().toISOString(),
          errorCount: 0,
        },
        {
          id: 'echo',
          name: 'ECHO',
          codename: 'Wallet Mirror',
          status: 'online',
          scope: ['wallet', 'trust'],
          description: 'Analyzes wallet trust scores',
          trustScore: 87,
          lastAction: 'Analyzed wallet trust',
          lastActionAt: new Date().toISOString(),
          errorCount: 0,
        },
        {
          id: 'cradle',
          name: 'CRADLE',
          codename: 'Evolution Engine',
          status: 'online',
          scope: ['evolution', 'lifecycle'],
          description: 'Tracks and evolves dreams over time',
          trustScore: 90,
          lastAction: 'Evolved dream core',
          lastActionAt: new Date().toISOString(),
          errorCount: 0,
        },
        {
          id: 'wing',
          name: 'WING',
          codename: 'Messenger & Mint Agent',
          status: 'online',
          scope: ['messaging', 'minting'],
          description: 'Mints dream messages and micro-tokens',
          trustScore: 85,
          lastAction: 'Minted dream token',
          lastActionAt: new Date().toISOString(),
          errorCount: 0,
        },
      ],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
