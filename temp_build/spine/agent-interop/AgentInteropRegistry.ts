import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus';
import { ProviderDescriptor } from './ProviderDescriptor';

export class AgentInteropRegistry {
    private providers: Map<string, ProviderDescriptor> = new Map();

    constructor(private eventBus?: DreamEventBus) { }

    public registerProvider(provider: ProviderDescriptor): void {
        this.providers.set(provider.name, provider);

        if (this.eventBus) {
            this.eventBus.publish(this.eventBus.createEnvelope(
                'Interop.Provider.Registered',
                'interop-registry',
                provider
            ));
        }
    }

    public getProvider(name: string): ProviderDescriptor | undefined {
        return this.providers.get(name);
    }

    public listProviders(): ProviderDescriptor[] {
        return Array.from(this.providers.values());
    }

    public supportsCapability(capability: string): ProviderDescriptor[] {
        return this.listProviders().filter(p => p.capabilities.includes(capability));
    }
}
