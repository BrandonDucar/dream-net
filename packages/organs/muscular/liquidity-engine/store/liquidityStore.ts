import type {
  LiquidityPoolConfig,
  LiquidityPoolStatus,
  LiquidityEngineStatus,
  PoolState,
  PoolHealth,
} from '../types.js';

const configs: Map<string, LiquidityPoolConfig> = new Map();
const statuses: Map<string, LiquidityPoolStatus> = new Map();

let lastRunAt: number | null = null;

export const LiquidityStore = {
  upsertConfig(config: LiquidityPoolConfig) {
    configs.set(config.id, config);

    // Ensure there is a matching status record
    if (!statuses.get(config.id)) {
      const now = Date.now();
      const defaultStatus: LiquidityPoolStatus = {
        configId: config.id,
        state: "planned",
        health: "unknown",
        seeded: false,
        updatedAt: now,
      };
      statuses.set(config.id, defaultStatus);
    }

    return config;
  },

  getConfig(id: string): LiquidityPoolConfig | undefined {
    return configs.get(id);
  },

  listConfigs(): LiquidityPoolConfig[] {
    return Array.from(configs.values());
  },

  upsertStatus(status: LiquidityPoolStatus) {
    statuses.set(status.configId, status);
    return status;
  },

  getStatus(configId: string): LiquidityPoolStatus | undefined {
    return statuses.get(configId);
  },

  listStatuses(): LiquidityPoolStatus[] {
    return Array.from(statuses.values());
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): LiquidityEngineStatus {
    const allConfigs = Array.from(configs.values());
    const allStatuses = Array.from(statuses.values());

    let plannedCount = 0;
    let deployedCount = 0;
    let activeCount = 0;

    allStatuses.forEach((st) => {
      if (st.state === "planned") plannedCount++;
      if (st.state === "deployed") deployedCount++;
      if (st.state === "active") activeCount++;
    });

    const samplePools = allConfigs.slice(0, 25).map((cfg) => ({
      config: cfg,
      status: statuses.get(cfg.id)!,
    }));

    return {
      lastRunAt,
      poolCount: allConfigs.length,
      plannedCount,
      deployedCount,
      activeCount,
      samplePools,
    };
  },
};

