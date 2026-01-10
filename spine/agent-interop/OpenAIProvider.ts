import { ProviderDescriptor } from './ProviderDescriptor.js';

export const OpenAIProvider: ProviderDescriptor = {
    name: 'openai',
    version: '1.0.0',
    capabilities: ['llm.chat', 'llm.embed', 'llm.completion'],
};
