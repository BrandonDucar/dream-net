import { MCPServer } from '../MCPServerTypes.js';

/**
 * DreamNet Internal MCP Servers
 * 
 * These servers provide access to DreamNet's internal systems
 */
export const DreamNetCoreServer: MCPServer = {
    id: 'dreamnet-core',
    name: 'DreamNet Core',
    type: 'internal',
    tools: [
        {
            name: 'create_dream',
            description: 'Create a new dream',
            inputSchema: {
                type: 'object',
                properties: {
                    prompt: { type: 'string' },
                    style: { type: 'string', enum: ['lucid', 'surreal', 'realistic'] }
                },
                required: ['prompt']
            },
            costEstimate: 10
        },
        {
            name: 'evolve_dream',
            description: 'Evolve an existing dream',
            inputSchema: {
                type: 'object',
                properties: {
                    dreamId: { type: 'string' },
                    direction: { type: 'string' }
                },
                required: ['dreamId', 'direction']
            },
            costEstimate: 20
        },
        {
            name: 'fuse_dreams',
            description: 'Fuse two dreams together',
            inputSchema: {
                type: 'object',
                properties: {
                    dreamId1: { type: 'string' },
                    dreamId2: { type: 'string' }
                },
                required: ['dreamId1', 'dreamId2']
            },
            costEstimate: 30
        }
    ],
    resources: [
        {
            uri: 'dreamnet://dreams/*',
            type: 'read-write',
            description: 'Access to dream storage'
        },
        {
            uri: 'dreamnet://passports/*',
            type: 'read',
            description: 'Access to passport data'
        }
    ],
    permissions: {
        allowedAgents: ['agent:lucid', 'agent:canvas', 'agent:dreamkeeper'],
        allowedIdentities: [],
        requiresApproval: false
    }
};

export const ShieldCoreServer: MCPServer = {
    id: 'shield-core',
    name: 'Shield Core Security',
    type: 'internal',
    tools: [
        {
            name: 'detect_threat',
            description: 'Detect security threats',
            inputSchema: {
                type: 'object',
                properties: {
                    input: { type: 'any' },
                    source: { type: 'string' }
                },
                required: ['input']
            },
            costEstimate: 5
        },
        {
            name: 'fire_spike',
            description: 'Fire offensive spike at threat',
            inputSchema: {
                type: 'object',
                properties: {
                    threatId: { type: 'string' },
                    spikeType: { type: 'string' }
                },
                required: ['threatId']
            },
            costEstimate: 10,
            requiresApproval: true
        }
    ],
    resources: [
        {
            uri: 'dreamnet://threats/*',
            type: 'read',
            description: 'Access to threat logs'
        }
    ],
    permissions: {
        allowedAgents: ['agent:shield', 'agent:dreamkeeper'],
        allowedIdentities: [],
        allowedTiers: ['operator', 'architect', 'founder'],
        requiresApproval: false
    }
};

export const EconomicEngineServer: MCPServer = {
    id: 'economic-engine',
    name: 'Economic Engine',
    type: 'internal',
    tools: [
        {
            name: 'get_balance',
            description: 'Get token balance for identity',
            inputSchema: {
                type: 'object',
                properties: {
                    identityId: { type: 'string' },
                    token: { type: 'string', enum: ['SHEEP', 'DREAM', 'ZEN_POINTS'] }
                },
                required: ['identityId', 'token']
            },
            costEstimate: 0
        },
        {
            name: 'record_reward',
            description: 'Record a reward event',
            inputSchema: {
                type: 'object',
                properties: {
                    identityId: { type: 'string' },
                    source: { type: 'string' },
                    kind: { type: 'string' },
                    baseValue: { type: 'number' }
                },
                required: ['identityId', 'source', 'kind', 'baseValue']
            },
            costEstimate: 5
        }
    ],
    resources: [
        {
            uri: 'dreamnet://balances/*',
            type: 'read',
            description: 'Access to balance data'
        }
    ],
    permissions: {
        allowedAgents: ['agent:treasury', 'agent:dreamkeeper'],
        allowedIdentities: [],
        requiresApproval: false
    }
};

export const DreamNetInternalServers: MCPServer[] = [
    DreamNetCoreServer,
    ShieldCoreServer,
    EconomicEngineServer
];
