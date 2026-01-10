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
exports.ZenGardenCore = void 0;
const gardenStore_1 = require("./store/gardenStore");
const gardenScheduler_1 = require("./scheduler/gardenScheduler");
const rewardEngine_1 = require("./logic/rewardEngine");
exports.ZenGardenCore = {
    upsertSession(session) {
        return gardenStore_1.GardenStore.upsertSession(session);
    },
    getSession(id) {
        return gardenStore_1.GardenStore.getSession(id);
    },
    listSessions() {
        return gardenStore_1.GardenStore.listSessions();
    },
    upsertActivity(record) {
        return gardenStore_1.GardenStore.upsertActivity(record);
    },
    listActivitiesForSession(sessionId) {
        return gardenStore_1.GardenStore.listActivitiesForSession(sessionId);
    },
    computeRewardsForSession(context, session) {
        return (0, rewardEngine_1.computeRewardsForSession)(context, session);
    },
    run(context) {
        return (0, gardenScheduler_1.runZenGardenCycle)(context);
    },
    status() {
        return gardenStore_1.GardenStore.status();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.ZenGardenCore;
