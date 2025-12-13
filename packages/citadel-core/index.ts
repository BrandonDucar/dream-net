/**
 * Citadel Core
 * 
 * The Citadel - Strategic command center for DreamNet
 * Orchestrates the 8 Vertex AI agents (1-8) that generate snapshots, reports, and blueprints
 */

import { generateSnapshot } from "../../server/services/SnapshotGenerator.js";
import { runDroneDomeAnalysis } from "../../server/services/DroneDomeScanner.js";
import { runEventFabricAnalysis } from "../../server/services/EventFabricBuilder.js";
import { runDreamkeeperAnalysis } from "../../server/services/DreamkeeperArchitect.js";
import { validateDependencies } from "../../server/services/AgentHelpers.js";

export interface CitadelContext {
  // Optional: Can receive context from orchestrator if needed
  neuralMesh?: any;
}

export interface CitadelStatus {
  lastRun?: {
    cycleId: number;
    startedAt: number;
    finishedAt: number;
    durationMs: number;
    agentsRun: number[];
    errors?: string[];
  };
  totalRuns: number;
}

class CitadelStore {
  private status: CitadelStatus = {
    totalRuns: 0,
  };

  recordRun(cycleId: number, startedAt: number, finishedAt: number, agentsRun: number[], errors?: string[]): void {
    this.status = {
      lastRun: {
        cycleId,
        startedAt,
        finishedAt,
        durationMs: finishedAt - startedAt,
        agentsRun,
        errors,
      },
      totalRuns: this.status.totalRuns + 1,
    };
  }

  getStatus(): CitadelStatus {
    return { ...this.status };
  }
}

const store = new CitadelStore();

/**
 * Run Citadel agents in sequence
 * Only runs agents if their dependencies are available
 */
export async function runCitadelCycle(
  ctx?: CitadelContext
): Promise<{ agentsRun: number[]; errors: string[] }> {
  const startedAt = Date.now();
  const cycleId = store.getStatus().totalRuns + 1;
  const agentsRun: number[] = [];
  const errors: string[] = [];

  try {
    // Agent 1: Generate snapshot (no dependencies)
    try {
      await generateSnapshot();
      agentsRun.push(1);
      console.log(`✅ [Citadel] Agent 1 (Snapshot) completed`);
    } catch (error: any) {
      errors.push(`Agent 1: ${error.message}`);
      console.error(`❌ [Citadel] Agent 1 failed:`, error.message);
    }

    // Agent 2: Drone Dome Scanner (depends on Agent 1)
    try {
      const deps = await validateDependencies(2);
      if (deps.valid) {
        await runDroneDomeAnalysis();
        agentsRun.push(2);
        console.log(`✅ [Citadel] Agent 2 (Drone Dome) completed`);
      } else {
        console.log(`⏭️  [Citadel] Agent 2 skipped - missing dependencies: ${deps.missing.join(", ")}`);
      }
    } catch (error: any) {
      errors.push(`Agent 2: ${error.message}`);
      console.error(`❌ [Citadel] Agent 2 failed:`, error.message);
    }

    // Agent 3: Event Fabric Builder (depends on Agents 1, 2)
    try {
      const deps = await validateDependencies(3);
      if (deps.valid) {
        await runEventFabricAnalysis();
        agentsRun.push(3);
        console.log(`✅ [Citadel] Agent 3 (Event Fabric) completed`);
      } else {
        console.log(`⏭️  [Citadel] Agent 3 skipped - missing dependencies: ${deps.missing.join(", ")}`);
      }
    } catch (error: any) {
      errors.push(`Agent 3: ${error.message}`);
      console.error(`❌ [Citadel] Agent 3 failed:`, error.message);
    }

    // Agent 4: DreamKeeper Architect (depends on Agents 1, 2, 3)
    try {
      const deps = await validateDependencies(4);
      if (deps.valid) {
        await runDreamkeeperAnalysis();
        agentsRun.push(4);
        console.log(`✅ [Citadel] Agent 4 (DreamKeeper) completed`);
      } else {
        console.log(`⏭️  [Citadel] Agent 4 skipped - missing dependencies: ${deps.missing.join(", ")}`);
      }
    } catch (error: any) {
      errors.push(`Agent 4: ${error.message}`);
      console.error(`❌ [Citadel] Agent 4 failed:`, error.message);
    }

    // Note: Agents 5-8 can be added here following the same pattern
    // They will run automatically once their dependencies are available

  } catch (error: any) {
    errors.push(`Cycle error: ${error.message}`);
    console.error(`❌ [Citadel] Cycle error:`, error.message);
  }

  const finishedAt = Date.now();
  store.recordRun(cycleId, startedAt, finishedAt, agentsRun, errors.length > 0 ? errors : undefined);

  return { agentsRun, errors };
}

export const CitadelCore = {
  async run(context?: CitadelContext): Promise<{ agentsRun: number[]; errors: string[] }> {
    return runCitadelCycle(context);
  },

  getStatus(): CitadelStatus {
    return store.getStatus();
  },
};

export default CitadelCore;

