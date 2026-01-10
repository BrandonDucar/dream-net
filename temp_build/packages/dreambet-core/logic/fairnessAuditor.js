"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRoundRNG = auditRoundRNG;
const gameStore_1 = require("../store/gameStore");
/**
 * Very simple fairness check placeholder:
 * - ensures rngSeed/result exist
 * - ensures resultHex looks like hex
 */
function auditRoundRNG(round) {
    const now = Date.now();
    const hasRNG = !!round.rngSeed && !!round.rngResult;
    const looksHex = !!round.rngResult && /^[0-9a-fA-F]+$/.test(round.rngResult);
    const passed = hasRNG && looksHex;
    const record = {
        roundId: round.id,
        gameId: round.gameId,
        type: "rng",
        passed,
        details: passed
            ? "RNG data present and hex-shaped (placeholder audit)."
            : "Missing or malformed RNG data.",
        createdAt: now,
    };
    gameStore_1.GameStore.addFairnessRecord(record);
    return record;
}
