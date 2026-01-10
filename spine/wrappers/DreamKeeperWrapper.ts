import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus.js';

export interface DreamKeeperHealthStatus {
    status: 'healthy' | 'unhealthy' | 'unknown' | 'error';
    details?: any;
    message?: string;
}

export class DreamKeeperWrapper {
    constructor(private eventBus: DreamEventBus) { }

    /**
     * Run health check on an entity
     * Note: This is a pure wrapper that emits events. 
     * Actual health check logic should be triggered by the event subscriber.
     */
    public async runHealthCheck(entityId: string, identityId?: string): Promise<DreamKeeperHealthStatus> {
        const correlationId = crypto.randomUUID();
        const timestamp = Date.now();

        // Emit request for health check
        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'DreamKeeper.HealthCheckRequested',
                'dreamkeeper-wrapper',
                { entityId, identityId },
                {
                    eventId: crypto.randomUUID(),
                    correlationId,
                    timestamp,
                    severity: 'low'
                }
            )
        );

        // In a real async event system, we might wait for a response here.
        // For Phase I/II, we'll return a provisional status and rely on the event bus 
        // to trigger the actual check in the subscriber (which will be in the server).

        return { status: 'unknown', message: 'Health check requested via event bus' };
    }

    public reportHealth(entityId: string, status: string, details?: any): void {
        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'DreamKeeper.HealthReported',
                'dreamkeeper-wrapper',
                { entityId, status, details, timestamp: Date.now() }
            )
        );
    }

    public emitStateChange(entityId: string, state: string): void {
        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'DreamKeeper.StateChanged',
                'dreamkeeper-wrapper',
                { entityId, state, timestamp: Date.now() }
            )
        );
    }
}
