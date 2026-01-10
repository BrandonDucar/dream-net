/**
 * DreamNet Core Blueprint
 * The canonical bootstrap configuration for DreamNet Core network
 */

import type { NetworkBlueprint } from './types.js';
import { registerBlueprint } from './registry.js';

export const DreamNetCoreBlueprint: NetworkBlueprint = {
  id: "DREAMNET_CORE",
  label: "DreamNet Core",
  slug: "dreamnet-core",
  primaryDomain: "dreamnet.ai",
  description: "The canonical DreamNet Core network - the foundational blueprint for all DreamNet instances.",
  version: "1.0.0",
  
  citizens: [
    {
      citizenId: "CIT-BRANDON",
      label: "Brandon (Founder of DreamNet)",
      description: "Founder and primary steward of DreamNet.",
    },
  ],
  
  agents: [
    // Core agents will be registered from existing agent registry
    // This is a placeholder for blueprint-defined agents
  ],
  
  dreams: [
    {
      dreamId: "DREAM-CORE-0001",
      label: "DreamNet Core Infrastructure",
      founderCitizenId: "CIT-BRANDON",
      status: "active",
      description: "The foundational DreamNet infrastructure dream.",
    },
  ],
  
  // Ports and conduits are registered from existing systems (Port Governor, Conduits)
  // This blueprint focuses on citizens, agents, and dreams
  
  metadata: {
    createdAt: new Date().toISOString(),
    bootstrapVersion: "1.0.0",
  },
};

// Auto-register on import
registerBlueprint(DreamNetCoreBlueprint);

