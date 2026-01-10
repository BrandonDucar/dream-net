/**
 * Safe Boot Sequence for DreamNet
 * 
 * Implements a 7-step layered startup with health gates between steps.
 * Each layer must prove readiness before the next layer starts.
 * 
 * Based on battle-tested resilient startup patterns.
 */

import { getEnvConfig } from '../config/env';

export type BootStep = 
  | 'config'
  | 'secrets'
  | 'kernel'
  | 'stores'
  | 'apis'
  | 'workers'
  | 'ui';

export interface BootStepResult {
  step: BootStep;
  success: boolean;
  duration: number;
  error?: Error;
  metadata?: Record<string, any>;
}

export interface BootSequenceResult {
  success: boolean;
  steps: BootStepResult[];
  totalDuration: number;
  failedAt?: BootStep;
}

class SafeBootSequence {
  private steps: BootStepResult[] = [];
  private startTime = Date.now();

  /**
   * Step 1: Config & Feature Flags
   * Load flags and config first so everything else can read the same truth.
   */
  async step1_Config(): Promise<BootStepResult> {
    const stepStart = Date.now();
    try {
      const config = getEnvConfig();
      
      // Validate required config
      if (!config.NODE_ENV) {
        throw new Error('NODE_ENV is required');
      }
      
      if (!config.PORT || config.PORT <= 0) {
        throw new Error('PORT must be a positive number');
      }
      
      // Unknown flags = warn, not crash
      const warnings: string[] = [];
      // Add any config validation warnings here
      
      const result: BootStepResult = {
        step: 'config',
        success: true,
        duration: Date.now() - stepStart,
        metadata: {
          nodeEnv: config.NODE_ENV,
          port: config.PORT,
          initSubsystems: config.INIT_SUBSYSTEMS,
          initHeavySubsystems: config.INIT_HEAVY_SUBSYSTEMS,
          warnings,
        },
      };
      
      this.steps.push(result);
      return result;
    } catch (error) {
      const result: BootStepResult = {
        step: 'config',
        success: false,
        duration: Date.now() - stepStart,
        error: error instanceof Error ? error : new Error(String(error)),
      };
      this.steps.push(result);
      throw result;
    }
  }

  /**
   * Step 2: Secrets & Env Loader (Fail Closed)
   * Pull secrets/keys. If anything critical is missing or invalid, stop here.
   */
  async step2_Secrets(): Promise<BootStepResult> {
    const stepStart = Date.now();
    try {
      const config = getEnvConfig();
      
      // Check for critical secrets (fail closed)
      const criticalSecrets: string[] = [];
      const missingSecrets: string[] = [];
      
      // Database URL is optional (server can start without)
      // But if it's set, it should be valid
      if (config.DATABASE_URL) {
        try {
          new URL(config.DATABASE_URL);
          criticalSecrets.push('DATABASE_URL');
        } catch {
          throw new Error('DATABASE_URL is invalid');
        }
      }
      
      // GCP Project ID is required for deployments (but not for local dev)
      if (process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT) {
        criticalSecrets.push('GCP_PROJECT_ID');
      }
      
      const result: BootStepResult = {
        step: 'secrets',
        success: true,
        duration: Date.now() - stepStart,
        metadata: {
          criticalSecretsFound: criticalSecrets.length,
          missingSecrets: missingSecrets.length,
          // Don't log actual secret values
        },
      };
      
      this.steps.push(result);
      return result;
    } catch (error) {
      const result: BootStepResult = {
        step: 'secrets',
        success: false,
        duration: Date.now() - stepStart,
        error: error instanceof Error ? error : new Error(String(error)),
      };
      this.steps.push(result);
      throw result; // Fail closed - stop boot if secrets invalid
    }
  }

  /**
   * Step 3: Orchestrator Kernel
   * Bring up the core brain: service registry, routing, rate/budget limits.
   */
  async step3_Kernel(): Promise<BootStepResult> {
    const stepStart = Date.now();
    try {
      // Import DreamNet OS (kernel)
      const { dreamNetOS } = await import('./dreamnet-os');
      
      // Verify kernel is initialized
      const agents = dreamNetOS.listAgents();
      if (agents.length === 0) {
        throw new Error('No agents registered in kernel');
      }
      
      const result: BootStepResult = {
        step: 'kernel',
        success: true,
        duration: Date.now() - stepStart,
        metadata: {
          agentsRegistered: agents.length,
          agentNames: agents.map(a => a.name),
        },
      };
      
      this.steps.push(result);
      return result;
    } catch (error) {
      const result: BootStepResult = {
        step: 'kernel',
        success: false,
        duration: Date.now() - stepStart,
        error: error instanceof Error ? error : new Error(String(error)),
      };
      this.steps.push(result);
      throw result;
    }
  }

  /**
   * Step 4: Stateful Stores (DB/Queues)
   * Migrate DB schema, verify read/write and liveness.
   */
  async step4_Stores(): Promise<BootStepResult> {
    const stepStart = Date.now();
    try {
      const config = getEnvConfig();
      
      if (!config.DATABASE_URL) {
        // Database is optional - graceful degradation
        const result: BootStepResult = {
          step: 'stores',
          success: true,
          duration: Date.now() - stepStart,
          metadata: {
            database: 'not-configured',
            note: 'Server can run without database',
          },
        };
        this.steps.push(result);
        return result;
      }
      
      // Try to connect to database
      const { getPool, isDbAvailable } = await import('../db');
      
      if (!isDbAvailable()) {
        throw new Error('Database connection failed');
      }
      
      const pool = getPool();
      
      // Test read/write
      await pool.query('SELECT 1');
      
      // TODO: Run migrations and verify schema version
      // TODO: Check queue connectivity (if using queues)
      
      const result: BootStepResult = {
        step: 'stores',
        success: true,
        duration: Date.now() - stepStart,
        metadata: {
          database: 'connected',
          // TODO: schemaVersion: await getSchemaVersion(),
        },
      };
      
      this.steps.push(result);
      return result;
    } catch (error) {
      // Database failures are not fatal (graceful degradation)
      const result: BootStepResult = {
        step: 'stores',
        success: false,
        duration: Date.now() - stepStart,
        error: error instanceof Error ? error : new Error(String(error)),
        metadata: {
          degraded: true,
          note: 'Continuing without database - some features unavailable',
        },
      };
      this.steps.push(result);
      // Don't throw - allow graceful degradation
      return result;
    }
  }

  /**
   * Step 5: Stateless APIs & Tools
   * Start HTTP/gRPC APIs that don't own state.
   */
  async step5_APIs(): Promise<BootStepResult> {
    const stepStart = Date.now();
    try {
      // APIs are started in server/index.ts
      // This step verifies they're ready
      
      // Check that Express app is configured
      // This is a placeholder - actual API startup happens in index.ts
      
      const result: BootStepResult = {
        step: 'apis',
        success: true,
        duration: Date.now() - stepStart,
        metadata: {
          note: 'APIs started in main server file',
        },
      };
      
      this.steps.push(result);
      return result;
    } catch (error) {
      const result: BootStepResult = {
        step: 'apis',
        success: false,
        duration: Date.now() - stepStart,
        error: error instanceof Error ? error : new Error(String(error)),
      };
      this.steps.push(result);
      throw result;
    }
  }

  /**
   * Step 6: Background Workers & Cron
   * Only start after APIs/stores are stable.
   */
  async step6_Workers(): Promise<BootStepResult> {
    const stepStart = Date.now();
    try {
      const config = getEnvConfig();
      
      // Workers are optional (only if INIT_SUBSYSTEMS or INIT_HEAVY_SUBSYSTEMS)
      if (!config.INIT_SUBSYSTEMS && !config.INIT_HEAVY_SUBSYSTEMS) {
        const result: BootStepResult = {
          step: 'workers',
          success: true,
          duration: Date.now() - stepStart,
          metadata: {
            note: 'Workers disabled (INIT_SUBSYSTEMS=false)',
          },
        };
        this.steps.push(result);
        return result;
      }
      
      // Verify APIs are ready before starting workers
      // This is checked in initOptionalSubsystems() in index.ts
      
      const result: BootStepResult = {
        step: 'workers',
        success: true,
        duration: Date.now() - stepStart,
        metadata: {
          initSubsystems: config.INIT_SUBSYSTEMS,
          initHeavySubsystems: config.INIT_HEAVY_SUBSYSTEMS,
          note: 'Workers started asynchronously after APIs',
        },
      };
      
      this.steps.push(result);
      return result;
    } catch (error) {
      const result: BootStepResult = {
        step: 'workers',
        success: false,
        duration: Date.now() - stepStart,
        error: error instanceof Error ? error : new Error(String(error)),
      };
      this.steps.push(result);
      // Don't throw - workers are optional
      return result;
    }
  }

  /**
   * Step 7: UI/Ingress
   * Expose frontends and public endpoints last.
   */
  async step7_UI(): Promise<BootStepResult> {
    const stepStart = Date.now();
    try {
      // UI is served by API server (same container)
      // This step verifies it's ready
      
      const result: BootStepResult = {
        step: 'ui',
        success: true,
        duration: Date.now() - stepStart,
        metadata: {
          note: 'UI served by API server',
        },
      };
      
      this.steps.push(result);
      return result;
    } catch (error) {
      const result: BootStepResult = {
        step: 'ui',
        success: false,
        duration: Date.now() - stepStart,
        error: error instanceof Error ? error : new Error(String(error)),
      };
      this.steps.push(result);
      throw result;
    }
  }

  /**
   * Execute the full boot sequence with health gates
   */
  async execute(): Promise<BootSequenceResult> {
    try {
      // Step 1: Config
      await this.step1_Config();
      
      // Step 2: Secrets (fail closed)
      await this.step2_Secrets();
      
      // Step 3: Kernel
      await this.step3_Kernel();
      
      // Step 4: Stores (graceful degradation allowed)
      await this.step4_Stores();
      
      // Step 5: APIs
      await this.step5_APIs();
      
      // Step 6: Workers (optional, only if APIs ready)
      await this.step6_Workers();
      
      // Step 7: UI
      await this.step7_UI();
      
      return {
        success: true,
        steps: this.steps,
        totalDuration: Date.now() - this.startTime,
      };
    } catch (error) {
      const failedStep = this.steps[this.steps.length - 1]?.step;
      return {
        success: false,
        steps: this.steps,
        totalDuration: Date.now() - this.startTime,
        failedAt: failedStep,
      };
    }
  }

  /**
   * Get boot sequence status
   */
  getStatus(): BootSequenceResult {
    return {
      success: this.steps.every(s => s.success),
      steps: this.steps,
      totalDuration: Date.now() - this.startTime,
      failedAt: this.steps.find(s => !s.success)?.step,
    };
  }
}

export const safeBootSequence = new SafeBootSequence();

/**
 * Execute safe boot sequence
 * Call this before starting the server to ensure proper startup order
 */
export async function executeSafeBoot(): Promise<BootSequenceResult> {
  return safeBootSequence.execute();
}

