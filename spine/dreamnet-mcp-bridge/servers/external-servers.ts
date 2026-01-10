import { MCPServer } from '../MCPServerTypes.js';

/**
 * External MCP Servers
 * 
 * These servers provide access to external services
 */
export const StripeServer: MCPServer = {
    id: 'stripe',
    name: 'Stripe Payment',
    type: 'external',
    tools: [
        {
            name: 'create_payment_intent',
            description: 'Create a Stripe payment intent',
            inputSchema: {
                type: 'object',
                properties: {
                    amount: { type: 'number' },
                    currency: { type: 'string' },
                    metadata: { type: 'object' }
                },
                required: ['amount', 'currency']
            },
            costEstimate: 0, // External cost
            requiresApproval: true
        },
        {
            name: 'get_payment_status',
            description: 'Get payment status',
            inputSchema: {
                type: 'object',
                properties: {
                    paymentIntentId: { type: 'string' }
                },
                required: ['paymentIntentId']
            },
            costEstimate: 0
        }
    ],
    resources: [],
    permissions: {
        allowedAgents: ['agent:treasury'],
        allowedIdentities: [],
        allowedTiers: ['operator', 'architect', 'founder'],
        requiresApproval: true
    },
    authentication: {
        type: 'api-key',
        config: {
            envVar: 'STRIPE_API_KEY'
        }
    }
};

export const VercelServer: MCPServer = {
    id: 'vercel',
    name: 'Vercel Deployment',
    type: 'external',
    tools: [
        {
            name: 'deploy_project',
            description: 'Deploy to Vercel',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: { type: 'string' },
                    gitRef: { type: 'string' }
                },
                required: ['projectId']
            },
            costEstimate: 0,
            requiresApproval: true
        },
        {
            name: 'get_deployment_status',
            description: 'Get deployment status',
            inputSchema: {
                type: 'object',
                properties: {
                    deploymentId: { type: 'string' }
                },
                required: ['deploymentId']
            },
            costEstimate: 0
        }
    ],
    resources: [],
    permissions: {
        allowedAgents: ['agent:deployment'],
        allowedIdentities: [],
        allowedTiers: ['architect', 'founder'],
        requiresApproval: true
    },
    authentication: {
        type: 'api-key',
        config: {
            envVar: 'VERCEL_TOKEN'
        }
    }
};

export const ExternalServers: MCPServer[] = [
    StripeServer,
    VercelServer
];
