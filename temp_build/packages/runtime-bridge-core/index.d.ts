import { RuntimeContext, RuntimeBridgeStatus } from "./types";
export declare const RuntimeBridgeCore: {
    initContext(ctx: RuntimeContext): void;
    runOnce(): Promise<void>;
    startLoop(intervalMs?: number): NodeJS.Timeout;
    stopLoop(): void;
    getStatus(): RuntimeBridgeStatus;
};
export * from "./types";
export * from "./adapters/runtimeStatusAdapter";
export default RuntimeBridgeCore;
