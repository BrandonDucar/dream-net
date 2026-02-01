import { ProviderDescriptor } from './ProviderDescriptor.js';

export const CursorProvider: ProviderDescriptor = {
    name: 'cursor',
    version: '1.0.0',
    capabilities: ['code.edit', 'code.completion', 'code.analysis'],
};
