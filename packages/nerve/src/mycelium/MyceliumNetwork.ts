
import type { NerveBus } from '../bus.js';

/**
 * Mycelial Network (The Wood Wide Web)
 * 
 * Philosophy: Nutrients must flow from surplus to deficit.
 * Mechanism: A decentralized exchange for agent resources (Tokens, Rate Limits, Compute).
 */

export type NutrientType = 'TOKEN' | 'RATE_LIMIT' | 'COMPUTE' | 'ATTENTION';

export interface NutrientPacket {
    type: NutrientType;
    amount: number;
    sourceId: string;
    expiresAt: number;
}

export class MycelialNetwork {
    private network: Map<string, NutrientPacket[]> = new Map();

    constructor(private bus: NerveBus) { }

    /**
     * Offer a nutrient surplus to the network
     */
    public offer(packet: NutrientPacket) {
        // console.log(`[🍄 Mycelium] Offer received: ${packet.amount} ${packet.type} from ${packet.sourceId}`);

        // Broadcast the offer to the network
        this.bus.publish({
            kind: 'MYCELIUM_OFFER',
            channelId: 'mycelial-network',
            payload: packet,
            priority: 3,
            context: { origin: 'MycelialNetwork' }
        });

        // Store momentarily (in case of delayed consumption)
        const existing = this.network.get(packet.type) || [];
        this.network.set(packet.type, [...existing, packet]);
    }

    /**
     * Request a nutrient deficit from the network
     */
    public request(type: NutrientType, amount: number, requesterId: string) {
        const available = this.network.get(type) || [];
        const match = available.find(p => p.amount >= amount && p.expiresAt > Date.now());

        if (match) {
            // console.log(`[🍄 Mycelium] Trade executed: ${amount} ${type} from ${match.sourceId} -> ${requesterId}`);

            // Consume the resource
            match.amount -= amount;
            if (match.amount <= 0) {
                this.network.set(type, available.filter(p => p !== match));
            }

            this.bus.publish({
                kind: 'MYCELIUM_TRADE',
                channelId: 'mycelial-network',
                payload: {
                    type,
                    amount,
                    from: match.sourceId,
                    to: requesterId
                },
                priority: 3,
                context: { origin: 'MycelialNetwork' }
            });

            return true;
        }

        return false;
    }
}

let myceliumInstance: MycelialNetwork | null = null;

export function registerMycelialNetwork(bus: NerveBus) {
    myceliumInstance = new MycelialNetwork(bus);
    console.log("[🍄 Mycelium] The Wood Wide Web is online. Connecting roots...");
}

export function getMycelium(): MycelialNetwork | null {
    return myceliumInstance;
}
