"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRequestVolumeTrigger = registerRequestVolumeTrigger;
exports.recordRequest = recordRequest;
const threshold = Number(process.env.HALO_REQUEST_THRESHOLD ?? 150);
let counter = 0;
function registerRequestVolumeTrigger(_engine) {
    return {
        name: "requestVolumeTrigger",
        stop: () => {
            counter = 0;
        },
    };
}
function recordRequest(engine) {
    counter += 1;
    if (counter >= threshold) {
        counter = 0;
        void engine.runCycle("requestVolumeTrigger");
    }
}
