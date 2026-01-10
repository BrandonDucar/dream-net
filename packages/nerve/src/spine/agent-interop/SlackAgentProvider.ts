import { ProviderDescriptor } from './ProviderDescriptor.js';

export const SlackAgentProvider: ProviderDescriptor = {
    name: 'slack-agent',
    version: '1.0.0',
    capabilities: ['messaging.send', 'messaging.receive', 'workflow.trigger'],
};
