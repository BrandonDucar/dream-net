"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamTankCore = void 0;
const tankStore_1 = require("./store/tankStore");
const tankScheduler_1 = require("./scheduler/tankScheduler");
const evaluationEngine_1 = require("./logic/evaluationEngine");
exports.DreamTankCore = {
    // Dreams
    // ✅ Identity Layer v1: Already accepts ownerIdentityId in DreamIncubation
    // Usage: DreamTankCore.upsertDream({ ..., ownerIdentityId: ctx.identityId, ... })
    upsertDream(dream) {
        return tankStore_1.TankStore.upsertDream(dream);
    },
    getDream(id) {
        return tankStore_1.TankStore.getDream(id);
    },
    listDreams() {
        return tankStore_1.TankStore.listDreams();
    },
    // Milestones
    upsertMilestone(milestone) {
        return tankStore_1.TankStore.upsertMilestone(milestone);
    },
    listMilestonesForDream(dreamId) {
        return tankStore_1.TankStore.listMilestonesForDream(dreamId);
    },
    // Evaluations
    evaluateDream(context, dream, kind = "health-check") {
        return (0, evaluationEngine_1.evaluateDream)(context, dream, kind);
    },
    // Orchestration
    run(context) {
        return (0, tankScheduler_1.runDreamTankCycle)(context);
    },
    status() {
        return tankStore_1.TankStore.status();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.DreamTankCore;
