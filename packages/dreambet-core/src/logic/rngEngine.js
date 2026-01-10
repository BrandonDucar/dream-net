import crypto from "crypto";
function hashString(input) {
    return crypto.createHash("sha256").update(input).digest("hex");
}
export function generateRNG(req) {
    const createdAt = Date.now();
    const base = `${req.purpose || "dreambet"}:${req.gameId || ""}:${req.roundId || ""}:${req.entropyHint || ""}:${createdAt}`;
    const seed = hashString(base);
    const salt = hashString(seed + ":salt");
    const resultHex = hashString(seed + salt);
    return { seed, salt, resultHex, createdAt };
}
/**
 * Helper: map a resultHex to a float in [0,1).
 */
export function rngToUnit(resultHex) {
    // take first 8 hex chars -> 32 bits
    const slice = resultHex.slice(0, 8);
    const intVal = parseInt(slice, 16);
    const max = 0xffffffff;
    return intVal / max;
}
/**
 * Helper: pick an integer in [0, n)
 */
export function rngToInt(resultHex, n) {
    if (n <= 0)
        return 0;
    const u = rngToUnit(resultHex);
    return Math.floor(u * n);
}
//# sourceMappingURL=rngEngine.js.map