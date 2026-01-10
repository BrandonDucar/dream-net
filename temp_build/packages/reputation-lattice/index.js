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
exports.ReputationLattice = void 0;
const reputationStore_1 = require("./store/reputationStore");
const reputationScheduler_1 = require("./scheduler/reputationScheduler");
exports.ReputationLattice = {
    configure(config) {
        reputationStore_1.ReputationStore.configure(config);
    },
    addSignal(signal) {
        reputationStore_1.ReputationStore.addSignal(signal);
    },
    getScore(entityType, entityId) {
        return reputationStore_1.ReputationStore.getScoreFor(entityType, entityId);
    },
    run(context) {
        return (0, reputationScheduler_1.runReputationCycle)(context);
    },
    status() {
        return (0, reputationScheduler_1.reputationStatus)();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.ReputationLattice;
