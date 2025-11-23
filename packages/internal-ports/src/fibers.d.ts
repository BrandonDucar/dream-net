/**
 * Fiber-Optic Laser Channels
 *
 * High-speed internal routing channels for DreamNet internal communication.
 * Each fiber represents a dedicated communication channel optimized for specific
 * types of internal system messages.
 */
/**
 * Fiber-optic laser channels for internal routing
 */
export declare const FIBERS: {
    /**
     * ALPHA - Primary system channel
     * Used for core DreamNet operations and critical system events
     */
    readonly ALPHA: "alpha";
    /**
     * BETA - Security and defense channel
     * Used for Shield Core, DreamVault, and security-related communications
     */
    readonly BETA: "beta";
    /**
     * GAMMA - Mesh and network channel
     * Used for Mesh Core, DreamShop, and network-related communications
     */
    readonly GAMMA: "gamma";
    /**
     * OMEGA - Event routing channel
     * Used for Event Wormholes and cross-system event propagation
     */
    readonly OMEGA: "omega";
};
/**
 * Type for fiber channel names
 */
export type FiberChannel = typeof FIBERS[keyof typeof FIBERS];
/**
 * Get all available fiber channels
 */
export declare function getAllFibers(): FiberChannel[];
/**
 * Check if a string is a valid fiber channel
 */
export declare function isValidFiber(fiber: string): fiber is FiberChannel;
