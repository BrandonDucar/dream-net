"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOrcaPackCycle = runOrcaPackCycle;
const orcaStore_1 = require("../store/orcaStore");
const orcaSignalCore_1 = require("../logic/orcaSignalCore");
const orcaPosterCore_1 = require("../logic/orcaPosterCore");
const orcaAnalystCore_1 = require("../logic/orcaAnalystCore");
async function runOrcaPackCycle(ctx) {
    const now = Date.now();
    (0, orcaSignalCore_1.ensureSeedThemes)();
    (0, orcaSignalCore_1.generateNewOrcaIdeas)(ctx, 5);
    (0, orcaSignalCore_1.generateOrcaPlansFromIdeas)(ctx, ["x", "farcaster"]);
    await (0, orcaPosterCore_1.simulateOrcaPosting)(ctx);
    (0, orcaAnalystCore_1.runOrcaAnalysis)(ctx);
    orcaStore_1.OrcaStore.setLastRunAt(now);
    return orcaStore_1.OrcaStore.status();
}
