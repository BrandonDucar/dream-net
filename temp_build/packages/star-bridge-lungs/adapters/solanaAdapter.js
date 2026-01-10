"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolanaMetrics = getSolanaMetrics;
const genericAdapter_1 = require("./genericAdapter");
function getSolanaMetrics() {
    // Placeholder: specialize later with real Solana telemetry
    // TODO: Integrate with Solana RPC endpoint for real-time transaction fees and network congestion
    const metrics = (0, genericAdapter_1.createGenericChainMetrics)("solana");
    return {
        ...metrics,
        gasPressure: 0.2,
        liquidityPressure: 0.5,
    };
}
