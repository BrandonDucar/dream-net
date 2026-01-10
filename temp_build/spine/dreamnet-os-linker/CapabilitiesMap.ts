import { ProviderDescriptor } from '../agent-interop/ProviderDescriptor';

export class CapabilitiesMap {
    private capabilityToProviders: Map<string, ProviderDescriptor[]> = new Map();

    public addProvider(provider: ProviderDescriptor): void {
        for (const capability of provider.capabilities) {
            if (!this.capabilityToProviders.has(capability)) {
                this.capabilityToProviders.set(capability, []);
            }
            this.capabilityToProviders.get(capability)!.push(provider);
        }
    }

    public getProviders(capability: string): ProviderDescriptor[] {
        return this.capabilityToProviders.get(capability) || [];
    }

    public listAllCapabilities(): string[] {
        return Array.from(this.capabilityToProviders.keys());
    }
}
