"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHmacSecret = getHmacSecret;
exports.verifyIngress = verifyIngress;
var crypto_1 = require("crypto");
var types_1 = require("./types");
var DEFAULT_ALLOWED_UNSIGNED_TOPICS = new Set([types_1.StarbridgeTopic.System]);
function constantTimeCompare(a, b) {
    var bufA = Buffer.from(a);
    var bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
        return false;
    }
    return crypto_1.default.timingSafeEqual(bufA, bufB);
}
function getHmacSecret() {
    return process.env.STARBRIDGE_HMAC_SECRET || process.env.HMAC_SECRET || "";
}
function verifyIngress(req) {
    var _a, _b;
    var secret = getHmacSecret();
    var body = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    var topic = ((_b = body.topic) !== null && _b !== void 0 ? _b : "");
    if (!secret) {
        console.warn("[StarBridge] HMAC secret is not configured. Allowing ingress but this is unsafe for production.");
        return true;
    }
    if (DEFAULT_ALLOWED_UNSIGNED_TOPICS.has(topic)) {
        return true;
    }
    var signature = req.headers["x-dream-sig"];
    if (!signature || typeof signature !== "string") {
        return false;
    }
    var payload = JSON.stringify(body);
    var computed = crypto_1.default.createHmac("sha256", secret).update(payload).digest("hex");
    return constantTimeCompare(signature, computed);
}
