"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseMetrics = getBaseMetrics;
const genericAdapter_1 = require("./genericAdapter");
function getBaseMetrics() {
    // Placeholder: specialize later with real Base telemetry
    // TODO: Integrate with Base RPC endpoint for real-time gas prices and block data
    const metrics = (0, genericAdapter_1.createGenericChainMetrics)("base");
    return {
        ...metrics,
        reliability: 0.9,
    };
}
