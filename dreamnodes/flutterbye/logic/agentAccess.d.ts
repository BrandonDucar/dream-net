export interface AgentAccessControl {
    nodeId: string;
    allowedAgents: string[];
    isolation: boolean;
    canExport: boolean;
    restrictions: string[];
}
export declare function validateAgentAccess(requestedAgent: string, userTrustScore: number): AgentAccessControl;
export declare function getNodeCapabilities(userTrustScore: number): {
    nodeId: string;
    nodeName: string;
    primaryToken: string;
    allowedAccess: string[];
    visibleAgents: string[];
    canExportToDreamNet: boolean;
    trustBoundary: number;
    currentTrust: number;
    isolation: {
        enabled: boolean;
        description: string;
    };
};
export declare function checkEndpointAccess(endpoint: string): boolean;
