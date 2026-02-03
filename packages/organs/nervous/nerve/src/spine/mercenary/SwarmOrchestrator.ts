import { swarmBookingService } from './SwarmBookingService.js';
import { dreamEventBus } from '../dreamnet-event-bus/index.js';
import { toolGym } from './ToolGym.js';

/**
 * SwarmOrchestrator
 * Coordinates the execution of Gymnasium and Playground sessions based on bookings.
 */
class SwarmOrchestrator {
    constructor() {
        this.init();
    }

    private init() {
        console.log("🎺 [Orchestrator] Swarm Rhythms Initialized.");

        // Monitor bookings and trigger container starts
        setInterval(() => {
            const now = Date.now();
            const active = swarmBookingService.getActiveBookings();

            active.forEach(booking => {
                if (Math.abs(booking.startTime - now) < 60000) { // If starting within 1 min
                    this.executeBooking(booking);
                }
            });
        }, 30000);
    }

    private executeBooking(booking: any) {
        console.log(`⚡ [Orchestrator] Executing ${booking.type} for ${booking.agentId}...`);

        if (booking.type === 'GYMNASIUM') {
            // Signal the Gymnasium container (via Nerve/Redis)
            dreamEventBus.publish('Gymnasium.StartSession', { agentId: booking.agentId });
        } else if (booking.type === 'PLAYGROUND') {
            // Signal the Playground container
            dreamEventBus.publish('Playground.StartSession', { agentId: booking.agentId });
        }
    }
}

export const swarmOrchestrator = new SwarmOrchestrator();
