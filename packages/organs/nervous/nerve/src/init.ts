/**
 * Nerve Fabric Initialization
 * Initialize and register all core subscribers
 * 
 * @module @dreamnet/nerve/init
 */

import type { NerveBus } from './bus.js';
import { NERVE_BUS } from './bus.js';
import {
  registerShieldCoreSubscriber,
  registerJaggySubscriber,
  registerDreamScopeSubscriber,
} from './subscribers.js';
// import { memorySystem } from '@dreamnet/memory-dna';
import { registerStoicObserver } from './stoic/StoicObserver.js';
import { registerMycelialNetwork } from './mycelium/MyceliumNetwork.js';

/**
 * Initialize Nerve Fabric
 * Registers all core system subscribers
 * 
 * @returns DreamScope interface for accessing recent events
 */
export function initNerveFabric(): {
  dreamScope: ReturnType<typeof registerDreamScopeSubscriber>;
} {
  registerShieldCoreSubscriber(NERVE_BUS);
  registerJaggySubscriber(NERVE_BUS);
  const dreamScope = registerDreamScopeSubscriber(NERVE_BUS);

  // 🧠 Initialize Triune Memory (Lizard/Mammal/Cosmic)
  // memorySystem.initialize().catch(err => console.error("[nerve] Memory Genesis Failed:", err));

  // 🏛️ Initialize Stoic Observer (Amor Fati)
  registerStoicObserver(NERVE_BUS);

  // 🍄 Initialize Mycelial Network (Wood Wide Web)
  registerMycelialNetwork(NERVE_BUS);

  console.info("[nerve] Nerve Fabric online: Shield, Jaggy, DreamScope subscribed");

  return { dreamScope };
}

