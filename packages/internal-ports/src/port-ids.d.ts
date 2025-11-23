/**
 * Port ID Constants
 *
 * Centralized port identifiers for DreamNet subsystems.
 * These constants ensure consistent port IDs across the system.
 */
export declare const PORT_IDS: {
    readonly DREAMNET_CORE: "dreamnet-core";
    readonly SHIELD_CORE: "shield-core";
    readonly MESH_CORE: "mesh-core";
    readonly EVENT_WORMHOLE: "event-wormhole";
    readonly DREAM_VAULT: "dream-vault";
    readonly DREAM_SHOP: "dream-shop";
    readonly STAR_BRIDGE: "star-bridge";
    readonly TRAVELNET_CORE: "travelnet-core";
    readonly MILNET_CORE: "milnet-core";
    readonly OTTNET_CORE: "ottnet-core";
    readonly METALNET_CORE: "metalnet-core";
};
/**
 * Type for port ID values
 */
export type PortId = typeof PORT_IDS[keyof typeof PORT_IDS];
