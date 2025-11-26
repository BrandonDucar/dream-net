/**
 * 🧠 DreamNet Brain Integration
 * 
 * Hooks Super Brain and Drive Engine to all systems:
 * - Starbridge events → Super Brain
 * - Drive Engine → Packs
 * - Super Brain → Action Executor
 * - Cursor → Super Brain (query interface)
 */

import { superBrain } from "./SuperBrain";
import { driveEngine } from "./DriveEngine";
import { biomimeticIntegration } from "./BiomimeticIntegration";
import { subscribeToTopics } from "../starbridge";
import { StarbridgeTopic } from "../starbridge/types";
import { wolfPack } from "../agents/WolfPack";
import type { StarbridgeEvent } from "../starbridge/types";

export class BrainIntegration {
  private isIntegrated: boolean = false;

  /**
   * Initialize and hook everything together
   */
  async initialize(): Promise<void> {
    if (this.isIntegrated) {
      console.warn("🧠 [Brain Integration] Already integrated");
      return;
    }

    console.log("🧠 [Brain Integration] Initializing...");

    // 1. Hook Starbridge events to Super Brain
    this.hookStarbridgeToBrain();

    // 2. Hook Drive Engine to packs
    this.hookDriveEngineToPacks();

    // 3. Initialize Biomimetic Integration (hooks ALL systems)
    biomimeticIntegration.initialize().catch((err) => {
      console.warn("🧬 [Brain Integration] Biomimetic integration warning:", err.message);
    });

    // 4. Start Super Brain watching
    superBrain.startWatching();

    // 5. Start Drive Engine cycle
    this.startDriveEngineCycle();

    this.isIntegrated = true;
    console.log("✅ [Brain Integration] Fully integrated!");
  }

  /**
   * Hook Starbridge events to Super Brain
   */
  private hookStarbridgeToBrain(): void {
    console.log("🔗 [Brain Integration] Hooking Starbridge → Super Brain");

    // Actually subscribe to Starbridge event stream
    const { subscribeToTopics } = require("../starbridge");
    const { StarbridgeTopic } = require("../starbridge/types");

    // Subscribe to ALL topics so Super Brain sees everything
    subscribeToTopics(
      [
        StarbridgeTopic.System,
        StarbridgeTopic.Deploy,
        StarbridgeTopic.Governor,
        StarbridgeTopic.Economy,
        StarbridgeTopic.Vault,
      ],
      (event: StarbridgeEvent) => {
        // Feed every event to Super Brain
        superBrain.addEvent(event);
      }
    );

    console.log("✅ [Brain Integration] Starbridge → Super Brain connected (all topics)");
  }

  /**
   * Manually add event to Super Brain (called by Starbridge or other systems)
   */
  addEventToBrain(event: StarbridgeEvent): void {
    superBrain.addEvent(event);
  }

  /**
   * Hook Drive Engine to packs
   */
  private hookDriveEngineToPacks(): void {
    console.log("🔗 [Brain Integration] Hooking Drive Engine → Packs");

    // Update Drive Engine with pack statuses periodically
    setInterval(() => {
      this.updatePackStatuses();
    }, 60000); // Every minute
  }

  /**
   * Update pack statuses in Drive Engine
   */
  private updatePackStatuses(): void {
    try {
      // Update Wolf Pack status
      const wolfPackStatus = wolfPack.getStatus?.();
      if (wolfPackStatus) {
        driveEngine.updatePackStatus("wolf-pack", {
          opportunities: wolfPackStatus.opportunities || [],
          lastActionAt: wolfPackStatus.lastRunAt,
          successRate: wolfPackStatus.successRate || 0.5,
        });
      }

      // Update other packs as they become available
      // whalePack, orcaPack, shieldCore, etc.
    } catch (error: any) {
      console.error("🧠 [Brain Integration] Error updating pack statuses:", error.message);
    }
  }

  /**
   * Start Drive Engine cycle
   */
  private startDriveEngineCycle(): void {
    console.log("🚀 [Brain Integration] Starting Drive Engine cycle");

    // Generate actions for packs periodically
    setInterval(() => {
      this.generatePackActions();
    }, 300000); // Every 5 minutes
  }

  /**
   * Generate actions for packs based on drive
   */
  private generatePackActions(): void {
    const packIds = ["wolf-pack", "whale-pack", "orca-pack", "shield-core"];

    for (const packId of packIds) {
      try {
        // Get context for pack
        const context = this.getPackContext(packId);

        // Generate actions
        const actions = driveEngine.generateActions(packId, context);

        // Process actions through Super Brain
        for (const action of actions) {
          this.processDriveAction(action);
        }
      } catch (error: any) {
        console.error(`🧠 [Brain Integration] Error generating actions for ${packId}:`, error.message);
      }
    }
  }

  /**
   * Get context for a pack
   */
  private getPackContext(packId: string): Record<string, any> {
    const context: Record<string, any> = {};

    if (packId === "wolf-pack") {
      const status = wolfPack.getStatus?.();
      context.opportunitiesAvailable = status?.opportunities?.length || 0;
      context.recentActionsCount = status?.recentActions || 0;
      context.velocity = 0.5; // Actions per hour (could be calculated)
      context.consistency = 0.7; // How regular actions are
      context.resourcesAvailable = true;
    }

    // Add context for other packs as needed

    return context;
  }

  /**
   * Process drive action through Super Brain
   */
  private async processDriveAction(action: DriveAction): Promise<void> {
    console.log(`🧠 [Brain Integration] Processing drive action: ${action.actionType} for ${action.packId}`);

    // Create a synthetic event for Super Brain to process
    const event: StarbridgeEvent = {
      id: `drive-${action.actionId}`,
      type: `drive.${action.actionType}`,
      source: action.packId,
      topic: "System" as any,
      ts: new Date(),
      payload: {
        actionId: action.actionId,
        packId: action.packId,
        actionType: action.actionType,
        context: action.context,
      },
    };

    // Add to Super Brain
    superBrain.addEvent(event);
  }

  /**
   * Query Super Brain (for AI assistants like Cursor)
   */
  async queryBrain(question: string, context?: Record<string, any>): Promise<any> {
    const query = {
      queryId: `query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question,
      context,
      timestamp: Date.now(),
    };

    return await superBrain.query(query);
  }

  /**
   * Get integration status
   */
  getStatus(): {
    isIntegrated: boolean;
    brainStatus: any;
    driveStatus: any;
    biomimeticStatus: any;
  } {
    return {
      isIntegrated: this.isIntegrated,
      brainStatus: superBrain.getStatus(),
      driveStatus: driveEngine.getDriveStatus(),
      biomimeticStatus: biomimeticIntegration.getStatus(),
    };
  }
}

// Singleton instance
export const brainIntegration = new BrainIntegration();

