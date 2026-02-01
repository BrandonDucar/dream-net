/**
 * 🧲 MagLevMonitor: The Frictionless Pulse Observer
 *
 * Role: Monitors the Nerve Spine's heartbeat with zero drag.
 * Measures: Lift (Vigor), Stability (Entropy), and Rhythm.
 */
export interface HeartState {
    status: "LIFT" | "SAG" | "STALL";
    vigor: number;
    entropy: number;
    lastPulse: number;
    pulseCount: number;
}
export declare class MagLevMonitor {
    private static instance;
    private pulses;
    private lastPulseTime;
    private totalPulses;
    private constructor();
    static getInstance(): MagLevMonitor;
    private recordPulse;
    getHeartState(): HeartState;
}
export declare const magLevMonitor: MagLevMonitor;
//# sourceMappingURL=MagLevMonitor.d.ts.map