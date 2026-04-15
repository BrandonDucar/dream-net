export interface NodeConfig {
    id: string;
    name: string;
    version: string;
    type: 'messenger' | 'processor' | 'validator' | 'storage';
    tier: 'Standard' | 'Premium' | 'Nightmare';
    capabilities: string[];
    requirements: {
        minimumTrustScore: number;
        requiredTokens: Record<string, number>;
        completedDreams: number;
    };
    endpoints: Record<string, string>;
    limits: {
        messagesPerMinute: number;
        tokensPerMessage: number;
        maxMessageSize: number;
    };
    integration: {
        chains: string[];
        walletRequired: boolean;
        realTimeUpdates: boolean;
        isolation?: boolean;
        agentVisibility?: string[];
    };
}
export interface NodeMessage {
    id: string;
    fromWallet: string;
    toWallet: string;
    content: string;
    tokens: {
        amount: number;
        token: string;
    };
    timestamp: number;
    signature: string;
    validated: boolean;
}
export interface NodeStatus {
    nodeId: string;
    online: boolean;
    messagesProcessed: number;
    tokensDelivered: number;
    lastActivity: number;
    trustScore: number;
}
