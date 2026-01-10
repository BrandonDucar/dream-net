"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAgentAccess = validateAgentAccess;
exports.getNodeCapabilities = getNodeCapabilities;
exports.checkEndpointAccess = checkEndpointAccess;
const node_config_1 = require("../node.config");
function validateAgentAccess(requestedAgent, userTrustScore) {
    const canExport = userTrustScore >= node_config_1.FLUTTERBY_NODE.trustBoundary;
    const restrictions = [];
    // Check if agent is visible in this node
    if (!node_config_1.FLUTTERBY_NODE.agentVisibility.includes(requestedAgent)) {
        restrictions.push(`Agent ${requestedAgent} not visible in isolated Flutterbye node`);
    }
    // Check trust boundary for export operations
    if (!canExport) {
        restrictions.push(`Trust score ${userTrustScore} below export threshold ${node_config_1.FLUTTERBY_NODE.trustBoundary}`);
    }
    // Isolation restrictions
    if (node_config_1.FLUTTERBY_NODE.isolation) {
        restrictions.push('Node operates in isolation mode - limited external access');
    }
    return {
        nodeId: node_config_1.FLUTTERBY_NODE.id,
        allowedAgents: node_config_1.FLUTTERBY_NODE.agentVisibility,
        isolation: node_config_1.FLUTTERBY_NODE.isolation,
        canExport,
        restrictions
    };
}
function getNodeCapabilities(userTrustScore) {
    const accessControl = validateAgentAccess('', userTrustScore);
    return {
        nodeId: node_config_1.FLUTTERBY_NODE.id,
        nodeName: node_config_1.FLUTTERBY_NODE.name,
        primaryToken: node_config_1.FLUTTERBY_NODE.token,
        allowedAccess: node_config_1.FLUTTERBY_NODE.allowedAccess,
        visibleAgents: node_config_1.FLUTTERBY_NODE.agentVisibility,
        canExportToDreamNet: accessControl.canExport,
        trustBoundary: node_config_1.FLUTTERBY_NODE.trustBoundary,
        currentTrust: userTrustScore,
        isolation: {
            enabled: node_config_1.FLUTTERBY_NODE.isolation,
            description: 'Isolated messaging environment with restricted agent visibility'
        }
    };
}
function checkEndpointAccess(endpoint) {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return node_config_1.FLUTTERBY_NODE.allowedAccess.includes(cleanEndpoint);
}
