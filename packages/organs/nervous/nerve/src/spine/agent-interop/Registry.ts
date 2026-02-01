import { ProviderDescriptor } from './ProviderDescriptor.js';

export const AGENT_REGISTRY: ProviderDescriptor[] = [
    // Core Infrastructure
    { name: 'api-keeper-core', version: '1.0.0', capabilities: ['api-key-management', 'rate-limiting'] },
    { name: 'dreamnet-os-core', version: '1.0.0', capabilities: ['autonomic-control', 'system-monitoring'] },
    { name: 'dreamnet-control-core', version: '1.0.0', capabilities: ['kill-switch', 'policy-enforcement'] },
    { name: 'dreamnet-vercel-agent', version: '1.0.0', capabilities: ['deployment-management', 'vercel-integration'] },

    // Operational Systems
    { name: 'dreamnet-scheduler-core', version: '1.0.0', capabilities: ['cron-scheduling', 'task-orchestration'] },
    { name: 'dreamnet-autoscale-core', version: '1.0.0', capabilities: ['adaptive-rate-limiting', 'auto-scaling'] },
    { name: 'dreamnet-metrics-core', version: '1.0.0', capabilities: ['performance-monitoring', 'telemetry'] },
    { name: 'spider-web-core', version: '1.0.0', capabilities: ['central-intelligence', 'signal-processing'] },
    { name: 'dreamnet-rbac-core', version: '1.0.0', capabilities: ['role-based-access-control'] },
    { name: 'dreamnet-incident-core', version: '1.0.0', capabilities: ['incident-management', 'response-tracking'] },
    { name: 'dreamnet-cost-core', version: '1.0.0', capabilities: ['cost-tracking', 'budgeting'] },
    { name: 'narrative-field', version: '1.0.0', capabilities: ['system-storytelling', 'context-logging'] },
    { name: 'economic-engine-core', version: '1.0.0', capabilities: ['token-economy', 'reward-system'] },

    // Agent Packs & Intelligence
    { name: 'wolf-pack', version: '1.0.0', capabilities: ['anomaly-detection', 'threat-hunting'] },

    // Data Layer (Newly Agentized)
    {
        name: 'datakeeper-core',
        version: '1.0.0',
        capabilities: ['data-persistence', 'schema-enforcement', 'connection-pooling'],
        metadata: {
            provider: 'postgresql',
            mode: 'agentic'
        }
    }
];
