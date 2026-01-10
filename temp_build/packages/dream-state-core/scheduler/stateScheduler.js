"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDreamStateCycle = runDreamStateCycle;
const citizenshipStore_1 = require("../store/citizenshipStore");
const government_1 = require("../logic/government");
const government_2 = require("../logic/government");
const diplomacy_1 = require("../logic/diplomacy");
const government_3 = require("../logic/government");
/**
 * Run one Dream State cycle:
 * - Ensure government structure exists
 * - Ensure state symbols exist
 * - Ensure default diplomatic relations
 * - Record state heartbeat
 */
function runDreamStateCycle(ctx) {
    const now = Date.now();
    console.log("[DreamState:Scheduler] Running Dream State cycle...");
    // 1. Ensure government departments exist
    const departments = (0, government_1.ensureGovernmentDepartments)();
    if (departments.length > 0) {
        console.log(`[DreamState:Scheduler] Government departments initialized: ${departments.length}`);
    }
    // 2. Ensure state symbols exist
    const symbols = (0, government_2.ensureStateSymbols)();
    if (symbols.length > 0) {
        console.log(`[DreamState:Scheduler] State symbols adopted: ${symbols.length}`);
    }
    // 3. Ensure default diplomatic relations
    const relations = (0, diplomacy_1.ensureDefaultDiplomaticRelations)(ctx);
    if (relations.length > 0) {
        console.log(`[DreamState:Scheduler] Diplomatic relations established: ${relations.length}`);
    }
    // 4. Record heartbeat action
    (0, government_3.recordGovernmentAction)("administrative", "dept:executive", "Dream State heartbeat cycle completed", { timestamp: now, passportCount: citizenshipStore_1.CitizenshipStore.status().passportCount });
    citizenshipStore_1.CitizenshipStore.setLastRunAt(now);
    console.log("[DreamState:Scheduler] Dream State cycle complete.");
    return citizenshipStore_1.CitizenshipStore.status();
}
