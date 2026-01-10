/**
 * THE CONDUCTOR
 * Obsession: Truth Arbitration.
 * "Race Engineer says Push. Reliability says Back Off. Net: Maintain."
 */

export interface SimulationResult {
    race: { command: string, confidence: number, reason: string };
    reliability: { command: string, confidence: number, reason: string };
}

export class Conductor {
    arbitrate(inputs: SimulationResult) {
        const { race, reliability } = inputs;

        console.log(`[Conductor] 🏁 Race: ${race.command} (${race.confidence})`);
        console.log(`[Conductor] 🛡️ Reliability: ${reliability.command} (${reliability.confidence})`);

        // Logic: Reliability overrides Race if critical
        if (reliability.command === 'BACK_OFF' && reliability.confidence > 0.8) {
            return {
                finalCommand: 'PIT_NOW',
                reason: `Reliability Critical: ${reliability.reason} (Overrules Race Eng)`
            };
        }

        if (race.command === 'PUSH' && reliability.command === 'GREEN') {
            return {
                finalCommand: 'PUSH_HARD',
                reason: 'All systems green. Clear air.'
            };
        }

        return {
            finalCommand: 'MAINTAIN_DELTA',
            reason: 'Conflicting inputs or safe mode.'
        };
    }
}
