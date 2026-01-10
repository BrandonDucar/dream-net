import { RuntimeContext, RuntimeBridgeStatus } from "./types";
import { RuntimeStore } from "./store/runtimeStore";
import {
  initRuntimeContext,
  runRuntimeCycleOnce,
  startRuntimeLoop,
  stopRuntimeLoop,
} from "./logic/runtimeHarness";

export const RuntimeBridgeCore = {
  initContext(ctx: RuntimeContext) {
    initRuntimeContext(ctx);
  },

  runOnce() {
    return runRuntimeCycleOnce();
  },

  startLoop(intervalMs?: number) {
    return startRuntimeLoop(intervalMs);
  },

  stopLoop() {
    return stopRuntimeLoop();
  },

  getStatus(): RuntimeBridgeStatus {
    return RuntimeStore.getStatus();
  },
};

export * from "./types";
export * from "./adapters/runtimeStatusAdapter";
export default RuntimeBridgeCore;

