import { EventEnvelope } from '../dreamnet-event-bus/EventEnvelope';

export type PortType = 'ingress' | 'egress' | 'wormhole';
export type PortProtocol = 'http' | 'websocket' | 'ipc' | 'direct';

export interface PortConfig {
    id: string;
    type: PortType;
    protocol: PortProtocol;
    targetAgentId?: string; // For wormholes
    transform?: (data: any) => any; // The "Port Function"
}

export class Port {
    constructor(public config: PortConfig) { }

    public async transmit(envelope: EventEnvelope): Promise<void> {
        // 1. Run Port Function (Transformation/Validation)
        if (this.config.transform) {
            try {
                envelope.payload = this.config.transform(envelope.payload);
            } catch (err) {
                console.error(`[Port ${this.config.id}] Transformation failed:`, err);
                throw err;
            }
        }

        // 2. Handle Wormhole Logic (Direct Jump)
        if (this.config.type === 'wormhole') {
            if (!this.config.targetAgentId) {
                throw new Error(`[Port ${this.config.id}] Wormhole missing targetAgentId`);
            }
            console.log(`[Port ${this.config.id}] 🌀 Wormhole jump to ${this.config.targetAgentId}`);
            // In a real system, this would bypass the router and inject directly into the target's ingress
            // For now, we tag it for the router to prioritize
            envelope.routing = { ...envelope.routing, wormholeTarget: this.config.targetAgentId };
        }

        // 3. Log Transmission
        console.log(`[Port ${this.config.id}] Transmitting ${envelope.eventType} via ${this.config.protocol}`);
    }
}
