/**
 * OPS_CONTRACT Type Definitions
 * Parsed representation of docs/OPS_CONTRACT.md
 */
/**
 * Load the canonical OPS_CONTRACT definition
 */
export function loadOpsContract() {
    return {
        version: '1.0.0',
        frontend: {
            rootDirectory: 'client',
            installCommand: 'cd .. && pnpm --filter client... install --no-frozen-lockfile',
            buildCommand: 'pnpm run build',
            outputDirectory: 'dist',
            rewrites: [
                {
                    source: '/api/:path*',
                    destination: 'https://api.dreamnet.ink/:path*',
                },
                {
                    source: '/(.*)',
                    destination: '/index.html',
                },
            ],
        },
        backend: {
            serviceRoot: 'server',
            installCommand: 'pnpm install',
            buildCommand: 'pnpm run build',
            startCommand: 'pnpm start',
        },
        integrations: [
            // Infrastructure
            {
                name: 'Vercel',
                category: 'Infra',
                codeLocations: ['packages/dreamnet-vercel-agent'],
                requiredEnvVars: ['VERCEL_TOKEN'],
                status: 'active',
            },
            {
                name: 'Railway',
                category: 'Infra',
                codeLocations: ['railway.json', 'railway.toml', 'nixpacks.toml'],
                requiredEnvVars: [],
                status: 'active',
            },
            {
                name: 'Neon PostgreSQL',
                category: 'Infra',
                codeLocations: ['server/index.ts'],
                requiredEnvVars: ['DATABASE_URL', 'NEON_DATABASE_URL'],
                status: 'active',
            },
            // Blockchain
            {
                name: 'Base Mainnet',
                category: 'Blockchain',
                codeLocations: ['hardhat.config.cjs', 'contracts/'],
                requiredEnvVars: ['BASE_MAINNET_RPC_URL', 'BASE_SCAN_API_KEY'],
                status: 'active',
            },
            {
                name: 'Base Sepolia',
                category: 'Blockchain',
                codeLocations: ['hardhat.config.cjs'],
                requiredEnvVars: ['BASE_SEPOLIA_RPC_URL'],
                status: 'active',
            },
            {
                name: 'Ethers.js',
                category: 'Blockchain',
                codeLocations: ['client/', 'server/'],
                requiredEnvVars: [],
                status: 'active',
            },
            {
                name: 'Wagmi',
                category: 'Blockchain',
                codeLocations: ['client/'],
                requiredEnvVars: [],
                status: 'active',
            },
            // Communication
            {
                name: 'Twilio',
                category: 'Comms',
                codeLocations: ['packages/dreamnet-voice-twilio'],
                requiredEnvVars: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'],
                status: 'active',
            },
            {
                name: 'Gmail API',
                category: 'Comms',
                codeLocations: ['packages/inbox-squared-core'],
                requiredEnvVars: ['GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET', 'GMAIL_REFRESH_TOKEN'],
                status: 'active',
            },
            // AI
            {
                name: 'OpenAI',
                category: 'AI',
                codeLocations: ['server/', 'packages/'],
                requiredEnvVars: ['OPENAI_API_KEY'],
                status: 'active',
            },
            {
                name: 'Anthropic',
                category: 'AI',
                codeLocations: ['server/', 'packages/'],
                requiredEnvVars: ['ANTHROPIC_API_KEY'],
                status: 'active',
            },
            // Payments
            {
                name: 'Stripe',
                category: 'Payments',
                codeLocations: ['server/'],
                requiredEnvVars: ['STRIPE_SECRET_KEY'],
                status: 'active',
            },
            // Internal
            {
                name: 'DreamNet Bridge',
                category: 'Internal',
                codeLocations: ['packages/dreamnet-bridge'],
                requiredEnvVars: ['DREAMNET_API_KEY'],
                status: 'active',
            },
            {
                name: 'Agent Gateway',
                category: 'Internal',
                codeLocations: ['packages/agent-gateway'],
                requiredEnvVars: [],
                status: 'active',
            },
            {
                name: 'Star Bridge',
                category: 'Internal',
                codeLocations: ['packages/star-bridge-lungs'],
                requiredEnvVars: [],
                status: 'active',
            },
        ],
        envVars: [
            // Frontend
            { name: 'NODE_ENV', required: true, description: 'Production environment', scope: 'frontend' },
            { name: 'VITE_API_URL', required: false, description: 'API base URL', scope: 'frontend' },
            { name: 'VITE_BASE_RPC_URL', required: false, description: 'Base RPC endpoint', scope: 'frontend' },
            // Backend
            { name: 'DATABASE_URL', required: false, description: 'PostgreSQL connection string', scope: 'backend' },
            { name: 'PORT', required: false, description: 'Server port', scope: 'backend' },
            { name: 'SESSION_SECRET', required: true, description: 'Express session secret', scope: 'backend' },
            { name: 'DREAMNET_API_KEY', required: true, description: 'DreamNet internal API key', scope: 'backend' },
            { name: 'VERCEL_TOKEN', required: false, description: 'Vercel API token', scope: 'backend' },
            { name: 'TWILIO_ACCOUNT_SID', required: false, description: 'Twilio account SID', scope: 'backend' },
            { name: 'TWILIO_AUTH_TOKEN', required: false, description: 'Twilio auth token', scope: 'backend' },
            { name: 'OPENAI_API_KEY', required: false, description: 'OpenAI API key', scope: 'backend' },
            { name: 'ANTHROPIC_API_KEY', required: false, description: 'Anthropic API key', scope: 'backend' },
            { name: 'STRIPE_SECRET_KEY', required: false, description: 'Stripe secret key', scope: 'backend' },
            { name: 'BASE_MAINNET_RPC_URL', required: false, description: 'Base Mainnet RPC', scope: 'backend' },
            { name: 'BASE_SEPOLIA_RPC_URL', required: false, description: 'Base Sepolia RPC', scope: 'backend' },
            { name: 'BASE_SCAN_API_KEY', required: false, description: 'BaseScan API key', scope: 'both' },
        ],
    };
}
//# sourceMappingURL=contracts.js.map