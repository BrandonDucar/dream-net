const configs = new Map();
const statuses = new Map();
let lastRunAt = null;
export const LiquidityStore = {
    upsertConfig(config) {
        configs.set(config.id, config);
        // Ensure there is a matching status record
        if (!statuses.get(config.id)) {
            const now = Date.now();
            const defaultStatus = {
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
    getConfig(id) {
        return configs.get(id);
    },
    listConfigs() {
        return Array.from(configs.values());
    },
    upsertStatus(status) {
        statuses.set(status.configId, status);
        return status;
    },
    getStatus(configId) {
        return statuses.get(configId);
    },
    listStatuses() {
        return Array.from(statuses.values());
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
        const allConfigs = Array.from(configs.values());
        const allStatuses = Array.from(statuses.values());
        let plannedCount = 0;
        let deployedCount = 0;
        let activeCount = 0;
        allStatuses.forEach((st) => {
            if (st.state === "planned")
                plannedCount++;
            if (st.state === "deployed")
                deployedCount++;
            if (st.state === "active")
                activeCount++;
        });
        const samplePools = allConfigs.slice(0, 25).map((cfg) => ({
            config: cfg,
            status: statuses.get(cfg.id),
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
//# sourceMappingURL=liquidityStore.js.map