import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus.js';
import { EventEnvelope } from '../dreamnet-event-bus/EventEnvelope.js';

export class MiniAppWrapper {
    constructor(private eventBus: DreamEventBus) { }

    public reportMiniAppEvent(appId: string, eventType: string, payload?: unknown): void {
        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'MiniApp.Event',
                'miniapp-wrapper',
                { appId, eventType, payload, timestamp: Date.now() }
            )
        );
    }
}
