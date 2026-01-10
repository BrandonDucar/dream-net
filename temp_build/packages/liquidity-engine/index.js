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
exports.LiquidityEngine = void 0;
const liquidityStore_1 = require("./store/liquidityStore");
const liquidityScheduler_1 = require("./scheduler/liquidityScheduler");
const poolPlanner_1 = require("./logic/poolPlanner");
exports.LiquidityEngine = {
    initConfigs() {
        (0, liquidityScheduler_1.ensureLiquidityConfigsInitialized)();
    },
    upsertConfig(config) {
        return liquidityStore_1.LiquidityStore.upsertConfig(config);
    },
    getConfig(id) {
        return liquidityStore_1.LiquidityStore.getConfig(id);
    },
    listConfigs() {
        return liquidityStore_1.LiquidityStore.listConfigs();
    },
    getStatus(configId) {
        return liquidityStore_1.LiquidityStore.getStatus(configId);
    },
    listStatuses() {
        return liquidityStore_1.LiquidityStore.listStatuses();
    },
    markPoolDeployed(configId, pairAddress) {
        return (0, poolPlanner_1.markPoolDeployed)(configId, pairAddress);
    },
    markPoolActive(configId) {
        return (0, poolPlanner_1.markPoolActive)(configId);
    },
    run(context) {
        return (0, liquidityScheduler_1.runLiquidityEngineCycle)(context);
    },
    status() {
        return liquidityStore_1.LiquidityStore.status();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.LiquidityEngine;
