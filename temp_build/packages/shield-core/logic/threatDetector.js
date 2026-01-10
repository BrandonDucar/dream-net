"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectThreat = detectThreat;
exports.analyzeThreat = analyzeThreat;
exports.simulateThreatDetection = simulateThreatDetection;
const shieldStore_1 = require("../store/shieldStore");
let threatCounter = 0;
function nextThreatId() {
    threatCounter += 1;
    return `threat:${Date.now()}:${threatCounter}`;
}
/**
 * Detect a threat
 */
function detectThreat(type, level, source, target, payload) {
    const threat = {
        id: nextThreatId(),
        type,
        level,
        detectedAt: Date.now(),
        source,
        target,
        payload,
        blocked: false,
    };
    shieldStore_1.ShieldStore.detectThreat(threat);
    console.log(`[ThreatDetector] Detected ${level} ${type} threat: ${threat.id}`);
    return threat;
}
/**
 * Analyze threat and determine if it should be blocked
 */
function analyzeThreat(threat) {
    // Critical and extreme threats always blocked
    if (threat.level === "critical" || threat.level === "extreme") {
        return { shouldBlock: true, recommendedSpike: "counter-attack" };
    }
    // High threats usually blocked
    if (threat.level === "high") {
        return { shouldBlock: true, recommendedSpike: "block" };
    }
    // Medium threats blocked if they match known patterns
    if (threat.level === "medium") {
        const suspiciousTypes = ["intrusion", "malware", "data-exfiltration"];
        if (suspiciousTypes.includes(threat.type)) {
            return { shouldBlock: true, recommendedSpike: "rate-limit" };
        }
    }
    // Low threats usually just logged
    return { shouldBlock: false };
}
/**
 * Simulate threat detection (for testing)
 */
function simulateThreatDetection() {
    const threats = [];
    // Simulate various threat types
    const threatTypes = [
        { type: "intrusion", level: "high", probability: 0.1 },
        { type: "spam", level: "low", probability: 0.3 },
        { type: "api-abuse", level: "medium", probability: 0.2 },
        { type: "ddos", level: "critical", probability: 0.05 },
        { type: "phishing", level: "medium", probability: 0.15 },
    ];
    for (const threatConfig of threatTypes) {
        if (Math.random() < threatConfig.probability) {
            const threat = detectThreat(threatConfig.type, threatConfig.level, `simulated-source-${Math.random().toString(36).substring(7)}`, "dreamnet-core");
            threats.push(threat);
        }
    }
    return threats;
}
