import { RuntimeContext, RuntimeBridgeStatus } from './types.js';
import { RuntimeStore } from './store/runtimeStore.js';
import {
  initRuntimeContext,
  runRuntimeCycleOnce,
  startRuntimeLoop,
  stopRuntimeLoop,
} from './logic/runtimeHarness.js';

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

export * from './types.js';
export * from './adapters/runtimeStatusAdapter.js';
export default RuntimeBridgeCore;

