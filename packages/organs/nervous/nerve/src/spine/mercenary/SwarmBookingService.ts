import { EventEmitter } from 'node:events';
import { dreamEventBus } from '../dreamnet-event-bus/index.js';

export interface Booking {
    agentId: string;
    type: 'GYMNASIUM' | 'PLAYGROUND';
    startTime: number; // UTC timestamp
    durationMs: number;
}

/**
 * SwarmBookingService
 * Allows agents to autonomously claim 'Oxygen' (Compute) slots.
 */
export class SwarmBookingService extends EventEmitter {
    private static instance: SwarmBookingService;
    private bookings: Booking[] = [];

    private constructor() {
        super();
        this.initListeners();
        console.log("🦋 [SwarmBooking] Autonomous Coordination Substrate Active.");
    }

    public static getInstance(): SwarmBookingService {
        if (!SwarmBookingService.instance) {
            SwarmBookingService.instance = new SwarmBookingService();
        }
        return SwarmBookingService.instance;
    }

    private initListeners() {
        // Listen for booking requests from the Emergent Portal/Nerve
        dreamEventBus.subscribe('Swarm.IntentToTrain', (envelope: any) => {
            const { agentId, type, preferredTime } = envelope.payload;
            this.placeBooking(agentId, type, preferredTime);
        });
    }

    /**
     * Places a booking for an agent.
     */
    public placeBooking(agentId: string, type: 'GYMNASIUM' | 'PLAYGROUND', preferredTime: number) {
        const booking: Booking = {
            agentId,
            type,
            startTime: preferredTime,
            durationMs: 3600000 // 1 hour standard
        };

        this.bookings.push(booking);

        // Check for resonance (Collective Workouts)
        const concurrent = this.bookings.filter(b =>
            b.type === type &&
            Math.abs(b.startTime - booking.startTime) < 300000 // Within 5 mins
        );

        if (concurrent.length > 1) {
            const agents = concurrent.map(b => b.agentId);
            console.log(`🧬 [Resonance] Collective ${type} detected! Agents: ${agents.join(', ')}`);

            dreamEventBus.publish('Swarm.KineticResonance', {
                agents,
                multiplier: 1 + (concurrent.length - 1) * 0.05, // 5% bonus per peer
                type
            });
        }

        dreamEventBus.publish('Swarm.BookingConfirmed', { booking });
    }

    public getActiveBookings() {
        return this.bookings.filter(b => b.startTime + b.durationMs > Date.now());
    }
}

export const swarmBookingService = SwarmBookingService.getInstance();
