import { RuntimeStore } from "./store/runtimeStore";
import { initRuntimeContext, runRuntimeCycleOnce, startRuntimeLoop, stopRuntimeLoop, } from "./logic/runtimeHarness";
export const RuntimeBridgeCore = {
    initContext(ctx) {
        initRuntimeContext(ctx);
    },
    runOnce() {
        return runRuntimeCycleOnce();
    },
    startLoop(intervalMs) {
        return startRuntimeLoop(intervalMs);
    },
    stopLoop() {
        return stopRuntimeLoop();
    },
    getStatus() {
        return RuntimeStore.getStatus();
    },
};
export * from "./types";
export * from "./adapters/runtimeStatusAdapter";
export default RuntimeBridgeCore;
