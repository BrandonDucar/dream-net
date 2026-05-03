/**
 * Nerve Fiber Event Fabric
 * Central event bus for DreamNet's nervous system
 * 
 * @module @dreamnet/nerve
 */

export * from "./types.js";
export * from "./bus.js";
export * from "./factory.js";
export * from "./subscribers.js";
export * from "./init.js";

// Alias for ControlCore integration
export { NERVE_BUS as dreamEventBus } from "./bus.js";

