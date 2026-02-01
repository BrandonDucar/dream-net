import { VSCE, VehicleEvent } from '../vsce.js';

/**
 * RACE ENGINEER AGENT
 * Obsession: Performance vs Conditions.
 * "Push / Hold / Cool"
 */
export class RaceEngineer {
    constructor(private vsce: VSCE) { }

    analyze(telemetry: any) {
        // Logic: If tire temps are good and fuel is light -> PUSH
        const tireTemp = telemetry.tireTemp || 80;
        const fuelLoad = telemetry.fuelLoad || 10;

        if (tireTemp > 90 && tireTemp < 105) {
            this.vsce.updateState('Tires', 0, 0.9, 'Optimal Temp Window');
            return { command: 'PUSH', confidence: 0.9, reason: 'Tires in window, fuel light.' };
        } else if (tireTemp > 110) {
            this.vsce.updateState('Tires', -5, 0.8, 'Overheating');
            return { command: 'COOL', confidence: 0.95, reason: 'Rear left overheating.' };
        }

        return { command: 'MAINTAIN', confidence: 0.5, reason: 'No clear advantage.' };
    }
}
