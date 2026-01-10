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
exports.WolfPackAnalystCore = void 0;
const analystStore_1 = require("./store/analystStore");
const analystScheduler_1 = require("./scheduler/analystScheduler");
exports.WolfPackAnalystCore = {
    // Patterns
    listPatterns() {
        return analystStore_1.AnalystStore.listPatterns();
    },
    getPattern(id) {
        return analystStore_1.AnalystStore.getPattern(id);
    },
    // Insights
    listInsights(limit) {
        return limit ? analystStore_1.AnalystStore.listRecentInsights(limit) : analystStore_1.AnalystStore.listInsights();
    },
    getInsight(id) {
        return analystStore_1.AnalystStore.getInsight(id);
    },
    // Predictions
    listPredictions() {
        return analystStore_1.AnalystStore.listPredictions();
    },
    getPrediction(leadId) {
        return analystStore_1.AnalystStore.getPrediction(leadId);
    },
    // Email Effectiveness
    listEmailEffectiveness() {
        return analystStore_1.AnalystStore.listEmailEffectiveness();
    },
    getEmailEffectiveness(queueItemId) {
        return analystStore_1.AnalystStore.getEmailEffectiveness(queueItemId);
    },
    // Orchestration
    run(context) {
        return (0, analystScheduler_1.runWolfPackAnalystCycle)(context);
    },
    status() {
        return analystStore_1.AnalystStore.status();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.WolfPackAnalystCore;
