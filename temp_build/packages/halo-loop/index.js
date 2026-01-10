"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haloTriggers = exports.haloEngine = void 0;
exports.registerHaloLoop = registerHaloLoop;
const haloEngine_1 = require("./haloEngine");
Object.defineProperty(exports, "haloEngine", { enumerable: true, get: function () { return haloEngine_1.haloEngine; } });
const timeTrigger_1 = require("./triggers/timeTrigger");
const requestVolumeTrigger_1 = require("./triggers/requestVolumeTrigger");
const errorRateTrigger_1 = require("./triggers/errorRateTrigger");
const deployTrigger_1 = require("./triggers/deployTrigger");
const eventWormholeTrigger_1 = require("./triggers/eventWormholeTrigger");
function registerHaloLoop(engine = haloEngine_1.haloEngine) {
    const registrations = [
        (0, timeTrigger_1.registerTimeTrigger)(engine),
        (0, requestVolumeTrigger_1.registerRequestVolumeTrigger)(engine),
        (0, errorRateTrigger_1.registerErrorRateTrigger)(engine),
        (0, deployTrigger_1.registerDeployTrigger)(engine),
        (0, eventWormholeTrigger_1.registerEventWormholeTrigger)(engine),
    ];
    return {
        stop: () => registrations.forEach((entry) => entry.stop()),
    };
}
exports.haloTriggers = {
    recordRequest: (engine = haloEngine_1.haloEngine) => (0, requestVolumeTrigger_1.recordRequest)(engine),
    recordError: (engine = haloEngine_1.haloEngine) => (0, errorRateTrigger_1.recordError)(engine),
    notifyDeploy: (metadata, engine = haloEngine_1.haloEngine) => (0, deployTrigger_1.notifyDeploy)(engine, metadata),
    triggerFromEvent: (eventType, severity, engine = haloEngine_1.haloEngine) => (0, eventWormholeTrigger_1.triggerHaloFromEvent)(eventType, severity),
    getLastDeploy: deployTrigger_1.getLastDeploy,
};
