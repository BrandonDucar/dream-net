/**
 * Deployment Wrapper - Wraps Deployment functionality with governance and event emission
 * 
 * Phase I: Event emission for deployment operations.
 * Phase II: Full policy enforcement, advanced deployment analytics.
 */

import type { DreamEventBus } from "../dreamnet-event-bus/DreamEventBus.js";
import { createDeploymentEvent } from "../dreamnet-event-bus/EventEnvelope.js";
import { generateCorrelationId } from "../utils/correlationId.js";
import type { DeploymentConfig, DeploymentResult } from "../../packages/deployment-core/src/index.js";

export interface DeployParams {
  config: DeploymentConfig;
  callerId?: string;
  correlationId?: string;
}

export interface DeployResult extends DeploymentResult {
  correlationId: string;
  emittedEvents: string[];
}

/**
 * Deployment Wrapper - Wraps Deployment functionality
 */
export class DeploymentWrapper {
  private eventBus: DreamEventBus | null = null;

  constructor(eventBus?: DreamEventBus) {
    this.eventBus = eventBus ?? null;
  }

  /**
   * Set the event bus for event emission
   */
  setEventBus(eventBus: DreamEventBus): void {
    this.eventBus = eventBus;
  }

  /**
   * Deploy with event emission
   */
  async deploy(params: DeployParams): Promise<DeployResult> {
    const correlationId = params.correlationId ?? generateCorrelationId();
    const emittedEvents: string[] = [];

    // Emit: Deployment.Initiated
    if (this.eventBus) {
      const initiatedEvent = createDeploymentEvent(
        "Initiated",
        "DeploymentWrapper",
        {
          platform: params.config.platform,
          projectName: params.config.projectName,
          sourceDirectory: params.config.sourceDirectory,
          callerId: params.callerId,
        },
        correlationId
      );
      this.eventBus.publish(initiatedEvent);
      emittedEvents.push(initiatedEvent.id);
    }

    // Import and call deployment manager
    try {
      const { getDeploymentManager } = await import("../../packages/deployment-core/src/index.js");
      const manager = getDeploymentManager();
      const result = await manager.deploy(params.config);

      // Emit: Deployment.Completed or Deployment.Failed
      if (this.eventBus) {
        const completedEvent = createDeploymentEvent(
          result.success ? "Completed" : "Failed",
          "DeploymentWrapper",
          {
            platform: result.platform,
            projectName: params.config.projectName,
            deploymentId: result.deploymentId,
            url: result.url,
            success: result.success,
            error: result.error,
            callerId: params.callerId,
          },
          correlationId
        );
        this.eventBus.publish(completedEvent);
        emittedEvents.push(completedEvent.id);
      }

      return {
        ...result,
        correlationId,
        emittedEvents,
      };
    } catch (error: any) {
      // Emit: Deployment.Failed
      if (this.eventBus) {
        const failedEvent = createDeploymentEvent(
          "Failed",
          "DeploymentWrapper",
          {
            platform: params.config.platform,
            projectName: params.config.projectName,
            error: error.message,
            callerId: params.callerId,
          },
          correlationId
        );
        this.eventBus.publish(failedEvent);
        emittedEvents.push(failedEvent.id);
      }

      return {
        success: false,
        platform: params.config.platform,
        error: error.message,
        correlationId,
        emittedEvents,
      };
    }
  }

  /**
   * Get deployment status with event emission
   */
  async getStatus(
    deploymentId: string,
    platform: string,
    correlationId?: string
  ): Promise<DeploymentResult & { correlationId: string; emittedEvents: string[] }> {
    const corrId = correlationId ?? generateCorrelationId();
    const emittedEvents: string[] = [];

    try {
      const { getDeploymentManager } = await import("../../packages/deployment-core/src/index.js");
      const manager = getDeploymentManager();
      const provider = manager.getProvider(platform as any);
      
      if (!provider) {
        throw new Error(`Platform ${platform} not found`);
      }

      const result = await provider.getStatus(deploymentId);

      // Emit: Deployment.StatusChecked
      if (this.eventBus) {
        const statusEvent = createDeploymentEvent(
          "StatusChecked",
          "DeploymentWrapper",
          {
            deploymentId,
            platform,
            success: result.success,
            url: result.url,
          },
          corrId
        );
        this.eventBus.publish(statusEvent);
        emittedEvents.push(statusEvent.id);
      }

      return {
        ...result,
        correlationId: corrId,
        emittedEvents,
      };
    } catch (error: any) {
      return {
        success: false,
        platform: platform as any,
        error: error.message,
        correlationId: corrId,
        emittedEvents,
      };
    }
  }

  /**
   * List deployments with event emission
   */
  async listDeployments(
    platform?: string,
    correlationId?: string
  ): Promise<(DeploymentResult & { correlationId: string; emittedEvents: string[] })[]> {
    const corrId = correlationId ?? generateCorrelationId();
    const emittedEvents: string[] = [];

    try {
      const { getDeploymentManager } = await import("../../packages/deployment-core/src/index.js");
      const manager = getDeploymentManager();
      
      let results: DeploymentResult[];
      if (platform) {
        const provider = manager.getProvider(platform as any);
        if (!provider) {
          throw new Error(`Platform ${platform} not found`);
        }
        results = await provider.listDeployments();
      } else {
        // List from all platforms
        const allResults: DeploymentResult[] = [];
        const platforms = manager.listAvailablePlatforms();
        for (const plat of platforms) {
          const provider = manager.getProvider(plat);
          if (provider) {
            try {
              const platformResults = await provider.listDeployments();
              allResults.push(...platformResults);
            } catch (error: any) {
              // Continue with other platforms
              console.warn(`[DeploymentWrapper] Failed to list deployments for ${plat}:`, error.message);
            }
          }
        }
        results = allResults;
      }

      // Emit: Deployment.Listed
      if (this.eventBus) {
        const listedEvent = createDeploymentEvent(
          "Listed",
          "DeploymentWrapper",
          {
            platform,
            count: results.length,
          },
          corrId
        );
        this.eventBus.publish(listedEvent);
        emittedEvents.push(listedEvent.id);
      }

      return results.map(result => ({
        ...result,
        correlationId: corrId,
        emittedEvents,
      }));
    } catch (error: any) {
      return [{
        success: false,
        platform: platform as any,
        error: error.message,
        correlationId: corrId,
        emittedEvents,
      }];
    }
  }

  /**
   * Get wrapper status
   */
  getStatus(): {
    activeDeployments: number;
    queuedDeployments: number;
    timestamp: number;
  } {
    // Phase I: Return basic status
    // Phase II: Can track actual deployments
    return {
      activeDeployments: 0, // Phase I: not tracking
      queuedDeployments: 0, // Phase I: not tracking
      timestamp: Date.now(),
    };
  }
}

