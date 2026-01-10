import { ProviderDescriptor } from './ProviderDescriptor.js';

export const GeminiProvider: ProviderDescriptor = {
    name: 'gemini',
    version: '1.0.0',
    capabilities: ['llm.chat', 'llm.multimodal', 'llm.reasoning'],
};
