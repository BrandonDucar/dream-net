"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMessageUnlock = checkMessageUnlock;
exports.getUnlockProgress = getUnlockProgress;
exports.analyzeMessagePattern = analyzeMessagePattern;
const node_config_1 = require("../node.config");
function checkMessageUnlock(userTrustScore, messageAgentSource) {
    // Base trust requirement for FlutterBye node
    if (userTrustScore < node_config_1.FLUTTERBY_NODE.trustBoundary) {
        return {
            unlocked: false,
            reason: `Trust score ${userTrustScore} below FlutterBye threshold`,
            requiredTrust: node_config_1.FLUTTERBY_NODE.trustBoundary,
            currentTrust: userTrustScore
        };
    }
    // Agent visibility check for isolated node
    if (node_config_1.FLUTTERBY_NODE.isolation && messageAgentSource) {
        if (!node_config_1.FLUTTERBY_NODE.agentVisibility.includes(messageAgentSource)) {
            return {
                unlocked: false,
                reason: `Agent ${messageAgentSource} not visible in isolated node`,
                requiredTrust: node_config_1.FLUTTERBY_NODE.trustBoundary,
                currentTrust: userTrustScore,
                agentRequired: messageAgentSource
            };
        }
    }
    return {
        unlocked: true,
        reason: 'Trust threshold met and agent accessible',
        requiredTrust: node_config_1.FLUTTERBY_NODE.trustBoundary,
        currentTrust: userTrustScore
    };
}
function getUnlockProgress(userTrustScore) {
    const threshold = node_config_1.FLUTTERBY_NODE.trustBoundary;
    if (userTrustScore >= threshold) {
        return {
            percentage: 100,
            nextMilestone: 100,
            description: 'Full FlutterBye access unlocked'
        };
    }
    const percentage = Math.round((userTrustScore / threshold) * 100);
    return {
        percentage,
        nextMilestone: threshold,
        description: `${threshold - userTrustScore} trust points needed for full access`
    };
}
function analyzeMessagePattern(message) {
    const supportiveKeywords = ['got this', 'you can', 'believe', 'strength', 'support'];
    const supportive = supportiveKeywords.some(keyword => message.toLowerCase().includes(keyword));
    const emoji = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/.test(message);
    let trustImpact = 0;
    if (supportive)
        trustImpact += 1;
    if (emoji)
        trustImpact += 0.5;
    if (message.length > 10 && message.length < 100)
        trustImpact += 0.5;
    return {
        supportive,
        emoji,
        trustImpact: Math.min(2, trustImpact) // Cap at +2 trust
    };
}
