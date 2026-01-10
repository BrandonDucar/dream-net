"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureOctopusInitialized = ensureOctopusInitialized;
exports.runOctopusScheduler = runOctopusScheduler;
exports.octopusStatus = octopusStatus;
const octopusEngine_1 = require("../engine/octopusEngine");
const armRegistry_1 = require("../arms/armRegistry");
const defaultArms_1 = require("../arms/defaultArms");
let initialized = false;
let lastRunAt = null;
async function ensureOctopusInitialized() {
    if (initialized)
        return;
    (0, defaultArms_1.registerDefaultArms)();
    initialized = true;
}
async function runOctopusScheduler(ctx) {
    await ensureOctopusInitialized();
    await (0, octopusEngine_1.runOctopusCycle)(ctx);
    lastRunAt = Date.now();
}
function octopusStatus() {
    return {
        lastRunAt,
        arms: armRegistry_1.ArmRegistry.status(),
        queuedTasks: (0, octopusEngine_1.getQueuedTaskCount)(),
    };
}
