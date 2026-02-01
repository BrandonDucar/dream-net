import { ProviderDescriptor } from './ProviderDescriptor.js';

export const SalesforceAgentForceProvider: ProviderDescriptor = {
    name: 'salesforce-agentforce',
    version: '1.0.0',
    capabilities: ['crm.query', 'crm.update', 'workflow.automation'],
};
