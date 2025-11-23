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
export const FIBERS = {
    /**
     * ALPHA - Primary system channel
     * Used for core DreamNet operations and critical system events
     */
    ALPHA: 'alpha',
    /**
     * BETA - Security and defense channel
     * Used for Shield Core, DreamVault, and security-related communications
     */
    BETA: 'beta',
    /**
     * GAMMA - Mesh and network channel
     * Used for Mesh Core, DreamShop, and network-related communications
     */
    GAMMA: 'gamma',
    /**
     * OMEGA - Event routing channel
     * Used for Event Wormholes and cross-system event propagation
     */
    OMEGA: 'omega'
};
/**
 * Get all available fiber channels
 */
export function getAllFibers() {
    return Object.values(FIBERS);
}
/**
 * Check if a string is a valid fiber channel
 */
export function isValidFiber(fiber) {
    return Object.values(FIBERS).includes(fiber);
}
