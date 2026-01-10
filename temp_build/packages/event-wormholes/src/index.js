"use strict";
/**
 * @dreamnet/event-wormholes
 *
 * Event Wormholes - Teleport Channels for Packet Transportation
 *
 * Provides wormhole endpoints for moving packets across clusters, nodes,
 * or external transports. Integrates with internal-router for routing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalBufferedCount = exports.getBufferedCount = exports.flushAllWormholes = exports.flushWormhole = exports.sendThroughWormhole = exports.clearAllWormholes = exports.resetAllStats = exports.resetWormholeStats = exports.getWormholeStat = exports.getWormholeStats = exports.clearWormholeBuffer = exports.getWormholeBuffer = exports.enqueueToWormhole = exports.hasWormhole = exports.unregisterWormhole = exports.listWormholes = exports.getWormhole = exports.registerWormhole = exports.getWormholeConfig = exports.configureWormholes = void 0;
// Export registry functions
var wormholes_1 = require("./wormholes");
Object.defineProperty(exports, "configureWormholes", { enumerable: true, get: function () { return wormholes_1.configureWormholes; } });
Object.defineProperty(exports, "getWormholeConfig", { enumerable: true, get: function () { return wormholes_1.getWormholeConfig; } });
Object.defineProperty(exports, "registerWormhole", { enumerable: true, get: function () { return wormholes_1.registerWormhole; } });
Object.defineProperty(exports, "getWormhole", { enumerable: true, get: function () { return wormholes_1.getWormhole; } });
Object.defineProperty(exports, "listWormholes", { enumerable: true, get: function () { return wormholes_1.listWormholes; } });
Object.defineProperty(exports, "unregisterWormhole", { enumerable: true, get: function () { return wormholes_1.unregisterWormhole; } });
Object.defineProperty(exports, "hasWormhole", { enumerable: true, get: function () { return wormholes_1.hasWormhole; } });
// Export buffering functions
var wormholes_2 = require("./wormholes");
Object.defineProperty(exports, "enqueueToWormhole", { enumerable: true, get: function () { return wormholes_2.enqueueToWormhole; } });
Object.defineProperty(exports, "getWormholeBuffer", { enumerable: true, get: function () { return wormholes_2.getWormholeBuffer; } });
Object.defineProperty(exports, "clearWormholeBuffer", { enumerable: true, get: function () { return wormholes_2.clearWormholeBuffer; } });
Object.defineProperty(exports, "getWormholeStats", { enumerable: true, get: function () { return wormholes_2.getWormholeStats; } });
Object.defineProperty(exports, "getWormholeStat", { enumerable: true, get: function () { return wormholes_2.getWormholeStat; } });
Object.defineProperty(exports, "resetWormholeStats", { enumerable: true, get: function () { return wormholes_2.resetWormholeStats; } });
Object.defineProperty(exports, "resetAllStats", { enumerable: true, get: function () { return wormholes_2.resetAllStats; } });
Object.defineProperty(exports, "clearAllWormholes", { enumerable: true, get: function () { return wormholes_2.clearAllWormholes; } });
// Export dispatcher functions
var dispatcher_1 = require("./dispatcher");
Object.defineProperty(exports, "sendThroughWormhole", { enumerable: true, get: function () { return dispatcher_1.sendThroughWormhole; } });
Object.defineProperty(exports, "flushWormhole", { enumerable: true, get: function () { return dispatcher_1.flushWormhole; } });
Object.defineProperty(exports, "flushAllWormholes", { enumerable: true, get: function () { return dispatcher_1.flushAllWormholes; } });
Object.defineProperty(exports, "getBufferedCount", { enumerable: true, get: function () { return dispatcher_1.getBufferedCount; } });
Object.defineProperty(exports, "getTotalBufferedCount", { enumerable: true, get: function () { return dispatcher_1.getTotalBufferedCount; } });
// Import for default setup
const index_1 = require("../../internal-ports/src/index");
const wormholes_3 = require("./wormholes");
/**
 * Configure wormholes with sensible defaults
 */
function configureDefaultWormholes() {
    (0, wormholes_3.configureWormholes)({
        bufferLimit: 100,
        dropPolicy: 'drop-oldest',
        enableMetrics: true
    });
    console.log('[Event Wormholes] Default configuration applied');
}
/**
 * Register default wormhole endpoints
 */
function registerDefaultWormholes() {
    // Core Omega Wormhole - primary event teleportation channel
    (0, wormholes_3.registerWormhole)({
        id: 'WH-CORE-OMEGA',
        label: 'Core Omega Wormhole',
        direction: 'bidirectional',
        fiber: index_1.FIBERS.OMEGA
    });
    // TravelNet Wormhole - travel network teleportation channel
    (0, wormholes_3.registerWormhole)({
        id: 'WH-TRAVELNET-GAMMA',
        label: 'TravelNet Gamma Wormhole',
        direction: 'bidirectional',
        fiber: index_1.FIBERS.GAMMA,
        remoteHint: {
            region: 'global',
            cluster: 'travelnet'
        }
    });
    // MILNET Wormhole - military/defense network teleportation channel
    (0, wormholes_3.registerWormhole)({
        id: 'WH-MILNET-BETA',
        label: 'MILNET Beta Wormhole',
        direction: 'bidirectional',
        fiber: index_1.FIBERS.BETA,
        remoteHint: {
            region: 'secure',
            cluster: 'milnet'
        }
    });
    // OTTNET Wormhole - streaming/media network teleportation channel
    (0, wormholes_3.registerWormhole)({
        id: 'WH-OTTNET-GAMMA',
        label: 'OTTNET Gamma Wormhole',
        direction: 'bidirectional',
        fiber: index_1.FIBERS.GAMMA,
        remoteHint: {
            region: 'edge',
            cluster: 'media'
        }
    });
    // METALNET Wormhole - precious metals network teleportation channel
    (0, wormholes_3.registerWormhole)({
        id: 'WH-METALNET-ALPHA',
        label: 'METALNET Alpha Wormhole',
        direction: 'bidirectional',
        fiber: index_1.FIBERS.ALPHA,
        remoteHint: {
            region: 'vault',
            cluster: 'metals'
        }
    });
    // ARCHIMEDES Wormhole - science/research network teleportation channel
    (0, wormholes_3.registerWormhole)({
        id: 'WH-ARCHIMEDES-EPSILON',
        label: 'Archimedes Epsilon Wormhole',
        direction: 'bidirectional',
        fiber: index_1.FIBERS.EPSILON, // Research/science semantics
        remoteHint: {
            region: 'lab',
            cluster: 'archimedes'
        }
    });
    console.log('[Event Wormholes] Default wormholes registered');
}
// Auto-configure and register defaults on module load
configureDefaultWormholes();
registerDefaultWormholes();
