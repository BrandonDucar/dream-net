import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus.js';

export class FreeTierWrapper {
    private usage: Map<string, number> = new Map();
    private quotas: Map<string, number> = new Map();

    constructor(private eventBus: DreamEventBus) {
        // Set default quotas
        this.quotas.set('api-calls', 1000);
        this.quotas.set('storage', 1024 * 1024 * 100); // 100MB
    }

    public recordUsage(service: string, amount: number): void {
        const current = this.usage.get(service) || 0;
        this.usage.set(service, current + amount);

        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'FreeTier.UsageRecorded',
                'freetier-wrapper',
                { service, amount, total: current + amount }
            )
        );
    }

    public checkQuota(service: string): { allowed: boolean; remaining?: number } {
        const used = this.usage.get(service) || 0;
        const quota = this.quotas.get(service);

        const result = {
            allowed: quota ? used < quota : true,
            remaining: quota ? quota - used : undefined,
        };

        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'FreeTier.QuotaChecked',
                'freetier-wrapper',
                { service, ...result }
            )
        );

        return result;
    }
}
