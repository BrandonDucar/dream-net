const configs = new Map();
const healthMap = new Map();
let lastRunAt = null;
export const AgentStore = {
    upsertConfig(cfg) {
        configs.set(cfg.id, cfg);
        if (!healthMap.get(cfg.id)) {
            const now = Date.now();
            const defaultHealth = {
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
    getConfig(id) {
        return configs.get(id);
    },
    listConfigs() {
        return Array.from(configs.values());
    },
    upsertHealth(health) {
        healthMap.set(health.agentId, health);
        return health;
    },
    getHealth(agentId) {
        return healthMap.get(agentId);
    },
    listHealth() {
        return Array.from(healthMap.values());
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
        const allConfigs = Array.from(configs.values());
        const allHealth = Array.from(healthMap.values());
        let activeCount = 0;
        let degradedCount = 0;
        let errorCount = 0;
        allHealth.forEach((h) => {
            if (h.state === "active")
                activeCount++;
            if (h.state === "degraded")
                degradedCount++;
            if (h.state === "error")
                errorCount++;
        });
        const sampleAgents = allConfigs.slice(0, 25).map((cfg) => ({
            config: cfg,
            health: healthMap.get(cfg.id),
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
//# sourceMappingURL=agentStore.js.map