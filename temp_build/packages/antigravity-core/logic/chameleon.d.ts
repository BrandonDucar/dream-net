/**
 * 🦎 CHAMELEON: Adaptive Mimicry
 *
 * "Be water, my friend."
 *
 * Allows the Architect to "mask" itself as another agent type to:
 * 1. Audit internal logic from the inside.
 * 2. Test defense systems (Red Teaming).
 * 3. Adapt visualization to user needs.
 */
export declare class Chameleon {
    /**
     * Creates a Proxy that mimics the interface of a target agent type.
     */
    static maskAs(agentType: "spore" | "hunter" | "mechanic"): any;
}
