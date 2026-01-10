export function registerTimeTrigger(engine, intervalMs = Number(process.env.HALO_INTERVAL_MS ?? 5 * 60 * 1000)) {
    const interval = setInterval(() => {
        void engine.runCycle("timeTrigger");
    }, intervalMs);
    return {
        name: "timeTrigger",
        stop: () => clearInterval(interval),
    };
}
//# sourceMappingURL=timeTrigger.js.map