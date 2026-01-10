/**
 * @file liquidCooling.ts
 * @module dreamnet-os-core/logic/liquidCooling
 * @description "Software Liquid Cooling" for DreamNet Agents.
 * Prevents "Thermal Throttling" (Process hanging) by shedding load
 * when "Temperature" (CPU/Memory/Token load) gets too high.
 */

export interface ThermalState {
    temperature: number; // 0-100 (100 = Meltdown)
    coolantFlow: string; // "Laminar" | "Turbulent" | "Critical"
    isThrottling: boolean;
}

export class CoolingSystem {
    private currentTemp: number = 0;
    private readonly MAX_TEMP = 90;

    constructor(private agentName: string) { }

    /**
     * Absorb Heat (Call this when doing work)
     * @param workUnits Arbitrary complexity units
     */
    public absorbHeat(workUnits: number) {
        this.currentTemp += workUnits;
        this.regulate();
    }

    /**
     * The Cooling Loop (Ticks to reduce temp)
     */
    public cycleCoolant() {
        if (this.currentTemp > 0) {
            this.currentTemp = Math.max(0, this.currentTemp - 5); // Dissipate heat
        }
    }

    private regulate() {
        if (this.currentTemp > this.MAX_TEMP) {
            console.warn(`[❄️ Liquid Cooling] ${this.agentName} OVERHEATING (${this.currentTemp}°C). Throttling...`);
            // In a real implementation, this would delay execution or reject tasks
        }
    }

    public getStatus(): ThermalState {
        return {
            temperature: this.currentTemp,
            coolantFlow: this.currentTemp > 80 ? "Critical" : this.currentTemp > 50 ? "Turbulent" : "Laminar",
            isThrottling: this.currentTemp > this.MAX_TEMP
        };
    }
}
