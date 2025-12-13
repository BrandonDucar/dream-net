/**
 * Nervous System Core
 * 
 * Modular architecture connecting Citadel, Drone Dome, Shared Memory, and Message Bus
 * 
 * Architecture Model:
 * - DreamNet OS = Body (runtime + I/O + scheduling)
 * - Citadel = Prefrontal cortex (planning/orchestration)
 * - Drone Dome = Sensory cortex + radar (world scanning + telemetry)
 * - Shared Memory = Hippocampus (short/mid-term state, vectors, caches)
 * - Message Bus = Spinal cord (reflex lanes + reliable delivery)
 */

export { nervousMessageBus } from './messageBus';
export { sharedMemory } from './sharedMemory';
export { runCitadelWithMessageBus } from './citadel';
export { runDroneDomeWithMessageBus } from './droneDome';
export type { 
  NervousMessage, 
  Role, 
  Topic, 
  SharedMemory, 
  SharedMemoryKV, 
  SharedMemoryDoc, 
  SharedMemoryVec,
  NervousSystemStatus 
} from './types';

import { nervousMessageBus } from './messageBus';
import { sharedMemory } from './sharedMemory';

let lastRunAt: number | null = null;

export const NervousSystemCore = {
  /**
   * Get message bus instance
   */
  getMessageBus() {
    return nervousMessageBus;
  },

  /**
   * Get shared memory instance
   */
  getSharedMemory() {
    return sharedMemory;
  },

  /**
   * Get system status
   */
  status(): import('./types').NervousSystemStatus {
    const busStats = nervousMessageBus.getStats();
    const memoryStats = sharedMemory.getStats();
    
    return {
      messageBus: {
        published: busStats.published,
        subscribers: busStats.subscribers,
        topics: busStats.topics as import('./types').Topic[],
      },
      sharedMemory: {
        kvSize: memoryStats.kv.size,
        docSize: memoryStats.doc.size,
        vecSize: 0, // Vec uses Neural Mesh, size tracking would need separate implementation
      },
      lastRunAt,
    };
  },
};

export default NervousSystemCore;

