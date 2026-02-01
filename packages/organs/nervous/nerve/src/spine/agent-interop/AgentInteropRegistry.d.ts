import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus.js';
import { ProviderDescriptor } from './ProviderDescriptor.js';
export declare class AgentInteropRegistry {
    private eventBus?;
    private providers;
    constructor(eventBus?: DreamEventBus | undefined);
    registerProvider(provider: ProviderDescriptor): void;
    getProvider(name: string): ProviderDescriptor | undefined;
    listProviders(): ProviderDescriptor[];
    supportsCapability(capability: string): ProviderDescriptor[];
}
//# sourceMappingURL=AgentInteropRegistry.d.ts.map