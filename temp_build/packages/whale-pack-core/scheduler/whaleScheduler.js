"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWhalePackCycle = runWhalePackCycle;
const whaleStore_1 = require("../store/whaleStore");
const whaleSignalCore_1 = require("../logic/whaleSignalCore");
const whalePosterCore_1 = require("../logic/whalePosterCore");
const whaleAnalystCore_1 = require("../logic/whaleAnalystCore");
async function runWhalePackCycle(ctx) {
    const now = Date.now();
    (0, whaleSignalCore_1.ensureSeedProductsAndAudiences)();
    (0, whaleSignalCore_1.generateNewContentPlans)(ctx, 5);
    await (0, whalePosterCore_1.simulateWhalePosting)(ctx);
    (0, whaleAnalystCore_1.runWhaleAnalysis)(ctx);
    whaleStore_1.WhaleStore.setLastRunAt(now);
    return whaleStore_1.WhaleStore.status();
}
