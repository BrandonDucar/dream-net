import { ProviderDescriptor } from './ProviderDescriptor';

export const CursorProvider: ProviderDescriptor = {
    name: 'cursor',
    version: '1.0.0',
    capabilities: ['code.edit', 'code.completion', 'code.analysis'],
};
