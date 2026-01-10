import type {
  AgentConfig,
  AgentHealth,
  AgentRegistryStatus,
  AgentState,
} from '../types.js';

const configs: Map<string, AgentConfig> = new Map();
const healthMap: Map<string, AgentHealth> = new Map();

let lastRunAt: number | null = null;

export const AgentStore = {
  upsertConfig(cfg: AgentConfig): AgentConfig {
    configs.set(cfg.id, cfg);

    if (!healthMap.get(cfg.id)) {
      const now = Date.now();
      const defaultHealth: AgentHealth = {
        agentId: cfg.id,
        state: "idle",
        successCount: 0,
        errorCount: 0,
        updatedAt: now,
      };
      healthMap.set(cfg.id, defaultHealth);
    }

    return cfg;
  },

  getConfig(id: string): AgentConfig | undefined {
    return configs.get(id);
  },

  listConfigs(): AgentConfig[] {
    return Array.from(configs.values());
  },

  upsertHealth(health: AgentHealth): AgentHealth {
    healthMap.set(health.agentId, health);
    return health;
  },

  getHealth(agentId: string): AgentHealth | undefined {
    return healthMap.get(agentId);
  },

  listHealth(): AgentHealth[] {
    return Array.from(healthMap.values());
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): AgentRegistryStatus {
    const allConfigs = Array.from(configs.values());
    const allHealth = Array.from(healthMap.values());

    let activeCount = 0;
    let degradedCount = 0;
    let errorCount = 0;

    allHealth.forEach((h) => {
      if (h.state === "active") activeCount++;
      if (h.state === "degraded") degradedCount++;
      if (h.state === "error") errorCount++;
    });

    const sampleAgents = allConfigs.slice(0, 25).map((cfg) => ({
      config: cfg,
      health: healthMap.get(cfg.id)!,
    }));

    return {
      lastRunAt,
      agentCount: allConfigs.length,
      activeCount,
      degradedCount,
      errorCount,
      sampleAgents,
    };
  },
};

