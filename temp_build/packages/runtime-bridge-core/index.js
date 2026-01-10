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
exports.RuntimeBridgeCore = void 0;
const runtimeStore_1 = require("./store/runtimeStore");
const runtimeHarness_1 = require("./logic/runtimeHarness");
exports.RuntimeBridgeCore = {
    initContext(ctx) {
        (0, runtimeHarness_1.initRuntimeContext)(ctx);
    },
    runOnce() {
        return (0, runtimeHarness_1.runRuntimeCycleOnce)();
    },
    startLoop(intervalMs) {
        return (0, runtimeHarness_1.startRuntimeLoop)(intervalMs);
    },
    stopLoop() {
        return (0, runtimeHarness_1.stopRuntimeLoop)();
    },
    getStatus() {
        return runtimeStore_1.RuntimeStore.getStatus();
    },
};
__exportStar(require("./types"), exports);
__exportStar(require("./adapters/runtimeStatusAdapter"), exports);
exports.default = exports.RuntimeBridgeCore;
