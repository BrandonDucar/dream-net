/**
 * Nerve Fabric Initialization
 * Initialize and register all core subscribers
 * 
 * @module @dreamnet/nerve/init
 */

import type { NerveBus } from "./bus.js";
import { NERVE_BUS } from "./bus.js";
import {
  registerShieldCoreSubscriber,
  registerJaggySubscriber,
  registerDreamScopeSubscriber,
} from "./subscribers.js";

import { KafkaTransport } from "./transports/KafkaTransport.js";

/**
 * Initialize Nerve Fabric
 * Registers all core system subscribers
 * 
 * @returns DreamScope interface for accessing recent events
 */
export async function initNerveFabric(): Promise<{
  dreamScope: ReturnType<typeof registerDreamScopeSubscriber>;
}> {
  registerShieldCoreSubscriber(NERVE_BUS);
  registerJaggySubscriber(NERVE_BUS);
  const dreamScope = registerDreamScopeSubscriber(NERVE_BUS);
  
  // Register Kafka Transport for high-throughput telemetry
  const kafkaBrokers = process.env.KAFKA_BOOTSTRAP_SERVERS?.split(',') || ['localhost:9092'];
  const kafkaTransport = new KafkaTransport(kafkaBrokers);
  await kafkaTransport.connect();
  NERVE_BUS.registerTransport(kafkaTransport);
  
  console.info("[nerve] Nerve Fabric online: Shield, Jaggy, DreamScope, and Kafka Transport active");
  
  return { dreamScope };
}

