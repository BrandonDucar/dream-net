const armStateMap = new Map();
export const ArmRegistry = {
    registerArm(config, handler) {
        const existing = armStateMap.get(config.id);
        const state = {
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
    getArm(id) {
        return armStateMap.get(id);
    },
    getAllArms() {
        return Array.from(armStateMap.values());
    },
    updateStatus(id, updater) {
        const state = armStateMap.get(id);
        if (!state)
            return;
        updater(state.status);
    },
    status() {
        return Array.from(armStateMap.values()).map((s) => s.status);
    },
};
