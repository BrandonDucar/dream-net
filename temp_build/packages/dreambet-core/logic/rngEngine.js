"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRNG = generateRNG;
exports.rngToUnit = rngToUnit;
exports.rngToInt = rngToInt;
const crypto_1 = __importDefault(require("crypto"));
function hashString(input) {
    return crypto_1.default.createHash("sha256").update(input).digest("hex");
}
function generateRNG(req) {
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
function rngToUnit(resultHex) {
    // take first 8 hex chars -> 32 bits
    const slice = resultHex.slice(0, 8);
    const intVal = parseInt(slice, 16);
    const max = 0xffffffff;
    return intVal / max;
}
/**
 * Helper: pick an integer in [0, n)
 */
function rngToInt(resultHex, n) {
    if (n <= 0)
        return 0;
    const u = rngToUnit(resultHex);
    return Math.floor(u * n);
}
