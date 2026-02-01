/**
 * HACHIMOJI LOGIC (8-STATE DENSITY)
 * Extracted from Mission 98 (Xenobiology/Synthetic DNA)
 */
export enum HachimojiState {
    SILENCE = 0,    // Idle / Quiet
    VITAL = 1,      // Success / High-Health Activity
    NECROSIS = 2,   // Hard Failure / Terminal Error
    HIBER = 3,       // Low-power / Sleeping / Suspended logic
    SYMBIOTIC = 4,   // Federated / Peer-dependent operation
    METABOLIC = 5,   // Internal processing / Memory cleaning / GC
    ANOMALY = 6,     // Warning / Immune response active
    RESONANCE = 7    // Peak state / High swarm affinity
}

export interface HachimojiCell {
    state: HachimojiState;
    energy: number;   // 0.0 - 1.0
    affinity: number; // 0.0 - 1.0 (How well it resonates with current swarm)
    updatedAt: string;
}

export function transition(current: HachimojiState, event: string): HachimojiState {
    switch (event) {
        case 'HUNT_SUCCESS':
        case 'ARBITRAGE_PROFIT':
            return HachimojiState.VITAL;
        case 'HUNT_FAILED':
        case 'SHIELD_WARNING':
            return HachimojiState.ANOMALY;
        case 'TERMINAL_LIQUIDATION':
        case 'SECURITY_BREACH':
            return HachimojiState.NECROSIS;
        case 'SLEEP':
            return HachimojiState.HIBER;
        case 'PULSE':
            return current === HachimojiState.HIBER ? HachimojiState.VITAL : current;
        default:
            return current;
    }
}
