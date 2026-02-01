
// We import types/logic from star-bridge-lungs if needed, 
// for now we build a standalone optimizer that manages "Routes".

interface Route {
    name: string;
    efficiency: number; // 0-1
    cost: number;
    latency: number;
}

export class FlowOptimizer {

    /**
     * Analyzes multiple routes and selects the optimal one based on current "pressure".
     * Pressure > 0.8 = Prioritize Speed (Latency)
     * Pressure < 0.5 = Prioritize Cost
     */
    static optimizeRoute(routes: Route[], systemPressure: number): Route {
        console.log(`💓 [TrafficShaper] Optimizing flow (Pressure: ${systemPressure})...`);

        const sorted = routes.sort((a, b) => {
            let scoreA, scoreB;

            if (systemPressure > 0.8) {
                // High pressure: Lowest Latency wins
                scoreA = a.latency;
                scoreB = b.latency;
            } else {
                // Low pressure: Lowest Cost wins
                scoreA = a.cost;
                scoreB = b.cost;
            }

            return scoreA - scoreB;
        });

        const best = sorted[0];
        console.log(`   > Routing via ${best.name} (L:${best.latency}ms C:$${best.cost})`);
        return best;
    }
}
