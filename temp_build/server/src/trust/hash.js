"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeHashAlgo = void 0;
exports.hashBuffer = hashBuffer;
exports.hashJson = hashJson;
exports.hashVector = hashVector;
exports.availableAlgos = availableAlgos;
var crypto_1 = require("crypto");
var blake3_1 = require("blake3");
var HASH_ALGOS = ["SHA-256", "SHA3-512", "BLAKE3"];
function resolveAlgo() {
    var _a;
    var envAlgo = ((_a = process.env.HASH_ALGO) !== null && _a !== void 0 ? _a : "SHA-256").toUpperCase();
    if (HASH_ALGOS.includes(envAlgo)) {
        return envAlgo;
    }
    return "SHA-256";
}
exports.activeHashAlgo = resolveAlgo();
function hashBuffer(buffer, algo) {
    if (algo === void 0) { algo = exports.activeHashAlgo; }
    switch (algo) {
        case "SHA3-512":
            return crypto_1.default.createHash("sha3-512").update(buffer).digest("hex");
        case "BLAKE3":
            return blake3_1.default.hash(buffer).toString("hex");
        case "SHA-256":
        default:
            return crypto_1.default.createHash("sha256").update(buffer).digest("hex");
    }
}
function hashJson(payload, algo) {
    if (algo === void 0) { algo = exports.activeHashAlgo; }
    var serialized = Buffer.from(JSON.stringify(payload !== null && payload !== void 0 ? payload : {}));
    return hashBuffer(serialized, algo);
}
function hashVector(vector, algo) {
    if (algo === void 0) { algo = exports.activeHashAlgo; }
    var buffer = Buffer.from(Float32Array.from(vector).buffer);
    return hashBuffer(buffer, algo);
}
function availableAlgos() {
    return __spreadArray([], HASH_ALGOS, true);
}
