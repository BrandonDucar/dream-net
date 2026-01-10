"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerErrorRateTrigger = registerErrorRateTrigger;
exports.recordError = recordError;
const threshold = Number(process.env.HALO_ERROR_THRESHOLD ?? 25);
let errorCounter = 0;
function registerErrorRateTrigger(_engine) {
    return {
        name: "errorRateTrigger",
        stop: () => {
            errorCounter = 0;
        },
    };
}
function recordError(engine) {
    errorCounter += 1;
    if (errorCounter >= threshold) {
        errorCounter = 0;
        void engine.runCycle("errorRateTrigger");
    }
}
