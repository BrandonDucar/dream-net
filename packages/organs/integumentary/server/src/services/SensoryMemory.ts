
/**
 * Sensory Memory (The Hippocampus)
 * 
 * Stores the "Latest Known State" of the world as perceived by the Spikes.
 * Serves as the high-speed cache for the God Mode Dashboard.
 */
export class SensoryMemory {
    private static instance: SensoryMemory;
    private state: Record<string, any> = {
        earthquakes: [],
        flights: [],
        trends: {},
        solar: {},
        wolfPack: [],
        systemHealth: 'UNKNOWN'
    };

    private constructor() { }

    public static getInstance(): SensoryMemory {
        if (!SensoryMemory.instance) {
            SensoryMemory.instance = new SensoryMemory();
        }
        return SensoryMemory.instance;
    }

    public update(type: string, data: any) {
        // console.log(`[SensoryMemory] 🧠 Integrating Memory: ${type}`);
        this.state[type] = data;
    }

    public getSnapshot() {
        return {
            ...this.state,
            timestamp: Date.now()
        };
    }

    // Wolf Pack specific append (Log)
    public addWolfPackLog(log: any) {
        if (!this.state.wolfPack) this.state.wolfPack = [];
        this.state.wolfPack.unshift({
            ...log,
            timestamp: Date.now()
        });
        // Keep last 50
        if (this.state.wolfPack.length > 50) this.state.wolfPack.pop();
    }
}

export const sensoryMemory = SensoryMemory.getInstance();
