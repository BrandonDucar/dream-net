const threshold = Number(process.env.HALO_ERROR_THRESHOLD ?? 25);
let errorCounter = 0;
export function registerErrorRateTrigger(_engine) {
    return {
        name: "errorRateTrigger",
        stop: () => {
            errorCounter = 0;
        },
    };
}
export function recordError(engine) {
    errorCounter += 1;
    if (errorCounter >= threshold) {
        errorCounter = 0;
        void engine.runCycle("errorRateTrigger");
    }
}
//# sourceMappingURL=errorRateTrigger.js.map