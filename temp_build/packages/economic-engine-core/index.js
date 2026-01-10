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
exports.EconomicEngineCore = void 0;
const econStore_1 = require("./store/econStore");
const rewardIngestion_1 = require("./logic/rewardIngestion");
const emissionRules_1 = require("./logic/emissionRules");
const econScheduler_1 = require("./scheduler/econScheduler");
let rawRewardCounter = 0;
function nextRawRewardId() {
    rawRewardCounter += 1;
    return `rawreward-${Date.now()}-${rawRewardCounter}`;
}
exports.EconomicEngineCore = {
    // Config
    ensureDefaultConfigSeeded() {
        (0, emissionRules_1.ensureDefaultEconomicConfigSeeded)();
    },
    listTokenConfigs() {
        return econStore_1.EconStore.listTokenConfigs();
    },
    listEmissionRules() {
        return econStore_1.EconStore.listEmissionRules();
    },
    // Balances
    // ✅ Identity Layer v1: Already accepts identityId (IdentityGrid node ID)
    // Usage: EconomicEngineCore.getBalance(ctx.identityId, "SHEEP")
    getBalance(identityId, token) {
        return econStore_1.EconStore.getBalance(identityId, token);
    },
    listBalances() {
        return econStore_1.EconStore.listBalances();
    },
    // Rewards
    // ✅ Identity Layer v1: Already accepts identityId in RawRewardEvent
    // Usage: EconomicEngineCore.recordRawReward({ identityId: ctx.identityId, source: "zen-garden", ... })
    recordRawReward(ev) {
        const now = Date.now();
        const full = {
            ...ev,
            id: nextRawRewardId(),
            createdAt: now,
        };
        econStore_1.EconStore.addRawReward(full);
        return full;
    },
    applyEmissionForReward(ev) {
        return (0, rewardIngestion_1.applyEmissionForReward)(ev);
    },
    listAppliedRewards() {
        return econStore_1.EconStore.listAppliedRewards();
    },
    // Orchestration
    run(context) {
        return (0, econScheduler_1.runEconomicEngineCycle)(context);
    },
    status() {
        return econStore_1.EconStore.status();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.EconomicEngineCore;
