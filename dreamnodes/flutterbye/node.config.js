export const FLUTTERBY_NODE = {
    id: 'flutterbye',
    name: 'Flutterbye',
    token: 'FLBY',
    creator: '0xYOURWALLET',
    createdAt: 1692637281723,
    isolation: true,
    trustBoundary: 80,
    usageCount: 242,
    inboxEnabled: true,
    mintEnabled: true,
    public: false,
    agentVisibility: ['CANVAS', 'ROOT'],
    allowedAccess: ['inbox', 'outbox', 'mint'],
    description: 'Secure messaging node with butterfly emoji support and trust-based unlocking',
    version: '1.0.0'
};
export const flutterbeyeNodeConfig = {
    id: 'flutterbye',
    name: 'FlutterBye Messenger Node',
    version: '1.0.0',
    type: 'messenger',
    tier: 'Premium',
    // Core capabilities
    capabilities: [
        'message_minting',
        'micro_token_delivery',
        'trust_validation',
        'cross_chain_routing'
    ],
    // Access requirements - Updated with trust boundary
    requirements: {
        minimumTrustScore: FLUTTERBY_NODE.trustBoundary,
        requiredTokens: {
            FLBY: 500,
            SHEEP: 200
        },
        completedDreams: 3
    },
    // Node endpoints - Restricted to allowed access
    endpoints: {
        mint: '/mint',
        inbox: '/inbox',
        outbox: '/outbox',
        status: '/status'
    },
    // Processing limits
    limits: {
        messagesPerMinute: 100,
        tokensPerMessage: 1000,
        maxMessageSize: 2048
    },
    // Integration settings - Isolation enabled
    integration: {
        chains: ['ethereum', 'solana'],
        walletRequired: true,
        realTimeUpdates: true,
        isolation: FLUTTERBY_NODE.isolation,
        agentVisibility: FLUTTERBY_NODE.agentVisibility
    }
};
