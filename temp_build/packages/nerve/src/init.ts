/**
 * Nerve Fabric Initialization
 * Initialize and register all core subscribers
 * 
 * @module @dreamnet/nerve/init
 */

import type { NerveBus } from "./bus";
import { NERVE_BUS } from "./bus";
import {
  registerShieldCoreSubscriber,
  registerJaggySubscriber,
  registerDreamScopeSubscriber,
} from "./subscribers";

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
  
  console.info("[nerve] Nerve Fabric online: Shield, Jaggy, DreamScope subscribed");
  
  return { dreamScope };
}

