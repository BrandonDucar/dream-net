/**
 * 🧲 MagLevMonitor: The Frictionless Pulse Observer
 * 
 * Role: Monitors the Nerve Spine's heartbeat with zero drag.
 * Measures: Lift (Vigor), Stability (Entropy), and Rhythm.
 */

import { NERVE_BUS } from'../bus.js';

export interface HeartState {
    status: "LIFT" | "SAG" | "STALL";
    vigor: number;      // 0-100
    entropy: number;    // 0.0 - 1.0
    lastPulse: number;
    pulseCount: number;
}

export class MagLevMonitor {
    private static instance: MagLevMonitor;
    private pulses: number[] = [];
    private lastPulseTime: number = Date.now();
    private totalPulses: number = 0;

    private constructor() {
        // Frictionless connection to the spine
        NERVE_BUS.subscribe('*', () => {
            this.recordPulse();
        });
    }

    public static getInstance(): MagLevMonitor {
        if (!MagLevMonitor.instance) {
            MagLevMonitor.instance = new MagLevMonitor();
        }
        return MagLevMonitor.instance;
    }

    private recordPulse() {
        const now = Date.now();
        this.pulses.push(now);
        this.lastPulseTime = now;
        this.totalPulses++;

        // Keep last 100 pulses for rolling calculations
        if (this.pulses.length > 100) this.pulses.shift();
    }

    public getHeartState(): HeartState {
        const now = Date.now();
        const duration = 10000; // Look at last 10s
        const recentPulses = this.pulses.filter(p => now - p < duration);

        const frequency = recentPulses.length / (duration / 1000); // Hz
        const vigor = Math.min(100, frequency * 10); // Scale 10Hz to 100 Vigor

        let status: HeartState["status"] = "LIFT";
        if (vigor < 20) status = "STALL";
        else if (vigor < 60) status = "SAG";

        return {
            status,
            vigor,
            entropy: Math.random() * 0.1, // Simulated entropy for now
            lastPulse: this.lastPulseTime,
            pulseCount: this.totalPulses
        };
    }
}

export const magLevMonitor = MagLevMonitor.getInstance();
