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
import { optioOrchestrator } from '../../../nervous-subsystem/OptioOrchestrator.js';
import { vdsProxy } from '../../../nervous-subsystem/VDSProxyService.js';
import { treasuryAuditService } from '../../../nervous-subsystem/TreasuryAuditService.js';
import { persistenceService } from '../../skeletal/shared/services/PersistenceService.js';
import { dreamEventBus } from './dreamnet-event-bus/index.js';

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

  // 🏛️ Initialize Distributed Sovereignty (Optio Batch)
  optioOrchestrator.ignite().catch(err => console.error("[nerve] Optio Ignition Failed:", err));

  // 💾 Restore Persistent State (AlaskanKing Mastery)
  persistenceService.restoreAll().catch(err => console.error("[nerve] State Restoration Failed:", err));

  console.info("[nerve] Nerve Fabric online: Shield, Jaggy, DreamScope, Optio, VDS Substrate Active");

  return { dreamScope };
}

