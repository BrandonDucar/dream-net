import { createGenericChainMetrics } from './genericAdapter.js';
export function getBaseMetrics() {
    // Placeholder: specialize later with real Base telemetry
    // TODO: Integrate with Base RPC endpoint for real-time gas prices and block data
    const metrics = createGenericChainMetrics("base");
    return {
        ...metrics,
        reliability: 0.9,
    };
}
//# sourceMappingURL=baseAdapter.js.map