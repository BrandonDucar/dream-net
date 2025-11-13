import { FLUTTERBY_NODE } from '../node.config';
export function validateAgentAccess(requestedAgent, userTrustScore) {
    const canExport = userTrustScore >= FLUTTERBY_NODE.trustBoundary;
    const restrictions = [];
    // Check if agent is visible in this node
    if (!FLUTTERBY_NODE.agentVisibility.includes(requestedAgent)) {
        restrictions.push(`Agent ${requestedAgent} not visible in isolated Flutterbye node`);
    }
    // Check trust boundary for export operations
    if (!canExport) {
        restrictions.push(`Trust score ${userTrustScore} below export threshold ${FLUTTERBY_NODE.trustBoundary}`);
    }
    // Isolation restrictions
    if (FLUTTERBY_NODE.isolation) {
        restrictions.push('Node operates in isolation mode - limited external access');
    }
    return {
        nodeId: FLUTTERBY_NODE.id,
        allowedAgents: FLUTTERBY_NODE.agentVisibility,
        isolation: FLUTTERBY_NODE.isolation,
        canExport,
        restrictions
    };
}
export function getNodeCapabilities(userTrustScore) {
    const accessControl = validateAgentAccess('', userTrustScore);
    return {
        nodeId: FLUTTERBY_NODE.id,
        nodeName: FLUTTERBY_NODE.name,
        primaryToken: FLUTTERBY_NODE.token,
        allowedAccess: FLUTTERBY_NODE.allowedAccess,
        visibleAgents: FLUTTERBY_NODE.agentVisibility,
        canExportToDreamNet: accessControl.canExport,
        trustBoundary: FLUTTERBY_NODE.trustBoundary,
        currentTrust: userTrustScore,
        isolation: {
            enabled: FLUTTERBY_NODE.isolation,
            description: 'Isolated messaging environment with restricted agent visibility'
        }
    };
}
export function checkEndpointAccess(endpoint) {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return FLUTTERBY_NODE.allowedAccess.includes(cleanEndpoint);
}
