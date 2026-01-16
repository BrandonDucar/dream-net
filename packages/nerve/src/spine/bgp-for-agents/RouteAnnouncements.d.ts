import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus.js';
import { AgentRoute } from './AgentBGP.js';
export declare class RouteAnnouncements {
    private eventBus;
    private sourceId;
    constructor(eventBus: DreamEventBus, sourceId: string);
    announceRoute(route: AgentRoute): void;
    withdrawRoute(route: AgentRoute): void;
}
//# sourceMappingURL=RouteAnnouncements.d.ts.map