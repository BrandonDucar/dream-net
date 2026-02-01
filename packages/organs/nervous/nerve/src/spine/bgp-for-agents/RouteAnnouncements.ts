import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus.js';
import { AgentRoute } from './AgentBGP.js';

export class RouteAnnouncements {
    constructor(private eventBus: DreamEventBus, private sourceId: string) { }

    public announceRoute(route: AgentRoute): void {
        const envelope = this.eventBus.createEnvelope(
            'Agent.Route.Announced',
            this.sourceId,
            route
        );
        this.eventBus.publish(envelope);
    }

    public withdrawRoute(route: AgentRoute): void {
        const envelope = this.eventBus.createEnvelope(
            'Agent.Route.Withdrawn',
            this.sourceId,
            { prefix: route.prefix }
        );
        this.eventBus.publish(envelope);
    }
}
