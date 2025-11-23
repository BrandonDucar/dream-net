import type { WolfContext, WolfSignal, WolfPackStatus } from "./types";
export declare const WolfPack: {
    run(context: WolfContext): {
        signals: WolfSignal[];
        strikes: any[];
    };
    status(): WolfPackStatus;
    listTargets(): string[];
    clearTarget(targetId: string): void;
    clearAllTargets(): void;
};
export * from "./types";
export default WolfPack;
