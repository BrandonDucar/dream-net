import type { StarBridgeContext, StarBridgeStatus } from "./types";
export declare const StarBridgeLungs: {
    run(context: StarBridgeContext): StarBridgeStatus;
    status(): StarBridgeStatus;
};
export * from "./types";
export * from "./engine/resonance";
export default StarBridgeLungs;
