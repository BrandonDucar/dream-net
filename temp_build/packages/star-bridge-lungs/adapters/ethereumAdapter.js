"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEthereumMetrics = getEthereumMetrics;
const genericAdapter_1 = require("./genericAdapter");
function getEthereumMetrics() {
    // Placeholder: specialize later with real Ethereum telemetry
    // TODO: Integrate with Ethereum RPC endpoint for real-time gas prices and block data
    const metrics = (0, genericAdapter_1.createGenericChainMetrics)("ethereum");
    return {
        ...metrics,
        gasPressure: 0.6, // assume higher pressure as default
        congestion: 0.5,
    };
}
