import { GameStore } from '../store/gameStore.js';
/**
 * Very simple fairness check placeholder:
 * - ensures rngSeed/result exist
 * - ensures resultHex looks like hex
 */
export function auditRoundRNG(round) {
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
    GameStore.addFairnessRecord(record);
    return record;
}
//# sourceMappingURL=fairnessAuditor.js.map