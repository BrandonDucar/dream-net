import type {
  WolfContext,
  WolfSignal,
  WolfPackStatus,
} from './types.js';
import { runWolfPackCycle, wolfPackStatus } from './engine/wolfPackEngine.js';
import { TargetTracker } from './trackers/targetTracker.js';

export const WolfPack = {
  run(context: WolfContext): { signals: WolfSignal[]; strikes: any[] } {
    return runWolfPackCycle(context);
  },

  status(): WolfPackStatus {
    return wolfPackStatus();
  },

  listTargets(): string[] {
    return TargetTracker.listTargets();
  },

  clearTarget(targetId: string) {
    TargetTracker.clearTarget(targetId);
  },

  clearAllTargets() {
    TargetTracker.clearAll();
  },

  async createAgent(meta: any): Promise<{ id: string; ok: boolean }> {
    console.log(`[WolfPack] Creating agent with meta:`, meta);
    return { id: `wolf-${Math.random().toString(36).slice(2, 9)}`, ok: true };
  },

  listAgents(): any[] {
    return [];
  },

  async assignTask(agentId: string, task: any): Promise<{ ok: boolean }> {
    console.log(`[WolfPack] Assigning task to ${agentId}:`, task);
    return { ok: true };
  },
};

export * from './types.js';
export default WolfPack;

