import { dreamEventBus } from '../dreamnet-event-bus/DreamEventBus.js';
import { laminarHarbor } from './LaminarHarborService.js';

/**
 * 🛰️ EventGraphQLService
 * 
 * Role: Telemetry Query Ingress.
 * Function: Unified API for querying live (Nerve Bus) and historical (Pulsar) events.
 */
export class EventGraphQLService {
    private static instance: EventGraphQLService;

    private constructor() {
        console.log('[🛰️ EventGraphQL] Initializing Telemetry Ingress...');
    }

    public static getInstance(): EventGraphQLService {
        if (!EventGraphQLService.instance) {
            EventGraphQLService.instance = new EventGraphQLService();
        }
        return EventGraphQLService.instance;
    }

    /**
     * Resolvers logic (Simulated implementation)
     */
    public async query(schema: string, variables: any) {
        if (schema.includes('recentEvents')) {
            return this.getRecentEvents(variables.limit || 10);
        }

        if (schema.includes('historicalEvents')) {
            const { from, to } = variables;
            return laminarHarbor.replay('*', from);
        }

        return { error: 'Unknown query' };
    }

    private async getRecentEvents(limit: number): Promise<any[]> {
        // Return a list of events from the in-memory bus history if available
        // For now, we'll return a placeholder set of pulses
        return [
            { eventType: 'SYMPATHETIC_RESONANCE', source: 'LaminarHarbor', severity: 'low', timestamp: Date.now() },
            { eventType: 'NEXUS_PULSE', source: 'EconomicGovernor', severity: 'low', timestamp: Date.now() - 1000 }
        ].slice(0, limit);
    }

    /**
     * Subscriptions (Live Stream Implementation)
     */
    public subscribeToEvents(filter: string, onEvent: (event: any) => void) {
        console.log(`[🛰️ EventGraphQL] New Subscription: ${filter}`);

        // Return unsubscribe cleanup
        return dreamEventBus.subscribe(filter, (event) => {
            // Apply filtering logic if '*' isn't used
            if (filter === '*' || event.eventType === filter) {
                onEvent(event);
            }
        });
    }
}

export const eventGraphQL = EventGraphQLService.getInstance();
