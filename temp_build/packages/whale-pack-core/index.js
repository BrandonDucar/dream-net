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
exports.WhalePackCore = void 0;
const whaleStore_1 = require("./store/whaleStore");
const whaleScheduler_1 = require("./scheduler/whaleScheduler");
exports.WhalePackCore = {
    run(context) {
        return (0, whaleScheduler_1.runWhalePackCycle)(context);
    },
    status() {
        return whaleStore_1.WhaleStore.status();
    },
    // Helpers for seeding / manual control
    upsertProduct(product) {
        return whaleStore_1.WhaleStore.upsertProduct(product);
    },
    listProducts() {
        return whaleStore_1.WhaleStore.listProducts();
    },
    upsertAudience(aud) {
        return whaleStore_1.WhaleStore.upsertAudience(aud);
    },
    listAudiences() {
        return whaleStore_1.WhaleStore.listAudiences();
    },
    upsertPlan(plan) {
        return whaleStore_1.WhaleStore.upsertPlan(plan);
    },
    listPlans() {
        return whaleStore_1.WhaleStore.listPlans();
    },
    addInsight(insight) {
        return whaleStore_1.WhaleStore.addInsight(insight);
    },
    listInsights() {
        return whaleStore_1.WhaleStore.listInsights();
    },
};
__exportStar(require("./types"), exports);
__exportStar(require("./logic/whaleOutreachCore"), exports);
exports.default = exports.WhalePackCore;
