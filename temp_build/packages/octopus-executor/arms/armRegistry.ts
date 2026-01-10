import type { OctopusArmConfig, OctopusArmId, OctopusArmStatus, OctopusTask, OctopusContext } from "../types";

export type OctopusArmHandler = (task: OctopusTask, ctx: OctopusContext) => Promise<void> | void;

type ArmState = {
  config: OctopusArmConfig;
  handler: OctopusArmHandler;
  status: OctopusArmStatus;
};

const armStateMap: Map<OctopusArmId, ArmState> = new Map();

export const ArmRegistry = {
  registerArm(config: OctopusArmConfig, handler: OctopusArmHandler) {
    const existing = armStateMap.get(config.id);

    const state: ArmState = {
      config,
      handler,
      status: existing?.status ?? {
        id: config.id,
        enabled: config.enabled,
        activeTasks: 0,
        processedCount: 0,
      },
    };

    state.status.enabled = config.enabled;
    armStateMap.set(config.id, state);
  },

  getArm(id: OctopusArmId): ArmState | undefined {
    return armStateMap.get(id);
  },

  getAllArms(): ArmState[] {
    return Array.from(armStateMap.values());
  },

  updateStatus(id: OctopusArmId, updater: (status: OctopusArmStatus) => void) {
    const state = armStateMap.get(id);
    if (!state) return;

    updater(state.status);
  },

  status(): OctopusArmStatus[] {
    return Array.from(armStateMap.values()).map((s) => s.status);
  },
};

