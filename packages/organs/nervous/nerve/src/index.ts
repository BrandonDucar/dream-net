/**
 * Nerve Fiber Event Fabric
 * Central event bus for DreamNet's nervous system
 * 
 * @module @dreamnet/nerve
 */

export * from './bus.js';
export * from './factory.js';
export * from './ganglia.js';
export * from './spine/PilotRegistry.js';
export * from './spine/MetabolicCortex.js';
export * from './spine/IdentityMask.js';
export * from './spine/MagLevMonitor.js';

// Suits
export * from './spine/suits/DiscordSuit.js';
export * from './spine/suits/TelegramSuit.js';
export * from './spine/suits/TelegramSuit.js';
export * from './spine/suits/BotpressSuit.js';
export * from './spine/suits/ChilizSuit.js';

// Cortex
export * from './spine/TaskerCortex.js';

// Bridges
export * from './bridges/N8nBridge.js';

// Hybridized Organs
export * as Wormholes from './wormholes/index.js';
export * as Bridges from './bridges/index.js';
export * as SpiderWeb from './spider-web/index.js';
export * from './spine/index.js';
export * as Spine from './spine/index.js';
export { dreamEventBus, elizaBridge, nursery, brainGate } from './spine/index.js';
export * from './telepathy.js';
export * from './quantum-mechanic.js';
export * from './manifold.js';
export type {
    Fly,
    FlyType,
    FlyPriority,
    SignalThread,
    SignalKind,
    SignalStatus,
    SpiderNodeRef,
    SpiderNodeKind
} from './spider-web/types.js';

// 🛡️ ONE SHOT REPAIR: Explicit Root Exports for Docker Stability
export * from './solver/IntentGenerator.js';
export * from './solver/SolverAuditService.js';
export * from './spine/BrainGate.js'; // Sovereign BrainGate
export * from './subscribers.js'; // Observability
