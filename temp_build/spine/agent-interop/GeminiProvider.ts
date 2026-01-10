import { ProviderDescriptor } from './ProviderDescriptor';

export const GeminiProvider: ProviderDescriptor = {
    name: 'gemini',
    version: '1.0.0',
    capabilities: ['llm.chat', 'llm.multimodal', 'llm.reasoning'],
};
