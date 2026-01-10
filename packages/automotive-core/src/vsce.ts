import { BioEvent, BioProvider, Homeostasis } from "@dreamnet/dreamnet-os-core";
import EventEmitter from 'events';

/**
 * VEHICLE STATE CONFIDENCE ENGINE (VSCE)
 * "The Heart of the Car"
 */

export interface VehicleEvent extends BioEvent {
    // Legacy fields mapped or extended
    data: any;
}

export interface SystemHealth {
    system: string; // "Engine", "Brakes", "Tires"
    health: number; // 0-100
    confidence: number; // 0.0-1.0 (How sure are we?)
    trend: 'STABLE' | 'DEGRADING' | 'RECOVERING';
    prediction: string; // "Failure in 500 miles"
}

export class VSCE extends EventEmitter implements BioProvider {
    private eventLog: VehicleEvent[] = [];
    private systemStates: Map<string, SystemHealth> = new Map();

    constructor() {
        super();
        this.initializeSystems();
    }

    getSnapshot(): Homeostasis {
        // Calculate aggregate health and stability
        const systems = Array.from(this.systemStates.values());
        const avgHealth = systems.reduce((acc, sys) => acc + sys.health, 0) / systems.length;
        const avgConfidence = systems.reduce((acc, sys) => acc + sys.confidence, 0) / systems.length;

        let mode: Homeostasis['mode'] = 'GROWTH';
        if (avgHealth < 50) mode = 'RECOVERY';
        if (avgConfidence < 0.5) mode = 'DEFENSE';

        return {
            health: avgHealth,
            stability: avgConfidence,
            mode
        };
    }

    async *stream(): AsyncGenerator<VehicleEvent> {
        // In a real implementation, this would yield events as they happen
        // For now, we just rely on the EventEmitter pattern
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // This is a placeholder for the async generator pattern
            // Real stream logic would hook into the event emitter
        }
    }

    private initializeSystems() {
        ['Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical'].forEach(sys => {
            this.systemStates.set(sys, {
                system: sys,
                health: 100,
                confidence: 1.0, // Start perfect
                trend: 'STABLE',
                prediction: 'Healthy'
            });
        });
    }

    /**
     * Ingest an event into the stream.
     */
    ingest(event: VehicleEvent) {
        this.eventLog.push(event);
        this.emit('event', event); // Agents listen to this
    }

    /**
     * Update state based on Agent opinion.
     */
    updateState(system: string, deltaHealth: number, confidenceDelta: number, reason: string) {
        const current = this.systemStates.get(system);
        if (current) {
            current.health = Math.max(0, Math.min(100, current.health + deltaHealth));
            current.confidence = Math.max(0, Math.min(1, current.confidence + confidenceDelta));

            if (deltaHealth < 0) current.trend = 'DEGRADING';
            if (deltaHealth > 0) current.trend = 'RECOVERING';

            console.log(`[VSCE] 📉 ${system} Update: Health ${current.health}% (Conf: ${current.confidence.toFixed(2)}) - ${reason}`);
        }
    }

    getSnapshot() {
        return Array.from(this.systemStates.values());
    }
}
