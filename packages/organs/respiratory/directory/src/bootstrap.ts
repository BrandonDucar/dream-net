/**
 * Directory Bootstrap
 * Registers existing entities (agents, ports, conduits, founder citizen) on startup
 */

import { registerCitizen, registerPort, registerConduit, registerNode } from './registry.js';
import { wrapNodeId } from './idGenerator.js';

/**
 * Initialize Directory with existing entities
 */
export async function initDirectory(): Promise<void> {
  console.log("[Directory] 🔍 Initializing Directory - Registering existing entities...");

  // Founder citizen entry
  registerCitizen({
    citizenId: "CIT-BRANDON",
    label: "Brandon (Founder of DreamNet)",
    description: "Founder and primary steward of DreamNet.",
  });

  // Register core nodes (clusters)
  const coreNodes: Array<{ clusterId: string; label: string; description?: string }> = [
    { clusterId: "WOLF_PACK", label: "Wolf Pack", description: "Offensive / executional agents" },
    { clusterId: "OCTOPUS", label: "Octopus", description: "Multi-arm integration / connector brain" },
    { clusterId: "SPIDER_WEB", label: "Spider Web", description: "Webhooks and event mesh" },
    { clusterId: "JAGGY", label: "Jaggy", description: "Spy cat / observability + reconnaissance" },
    { clusterId: "SHIELD_CORE", label: "Shield Core", description: "Security, threat detection, rate limiting" },
    { clusterId: "WEBHOOK_NERVOUS_SYSTEM", label: "Webhook Nervous System", description: "Event routing and webhook management" },
    { clusterId: "API_KEEPER", label: "API Keeper", description: "API key management and rotation" },
    { clusterId: "ENVKEEPER_CORE", label: "Env Keeper Core", description: "Environment variable management" },
    { clusterId: "DEPLOYKEEPER_CORE", label: "DeployKeeper Core", description: "Deployment and infra verification" },
    { clusterId: "AI_SEO", label: "AI SEO Core", description: "Zero-touch SEO optimization" },
    { clusterId: "DREAM_STATE", label: "Dream State Core", description: "Governance layer with passports, offices, cabinets" },
    { clusterId: "STAR_BRIDGE", label: "Star Bridge", description: "Cross-chain and cross-platform connectors" },
  ];

  for (const node of coreNodes) {
    registerNode({
      nodeId: wrapNodeId(node.clusterId),
      label: node.label,
      clusterId: node.clusterId,
      description: node.description,
    });
  }

  // Ports - dynamically import to avoid circular dependencies
  try {
    const { PORT_PROFILES } = await import("@dreamnet/port-governor/ports");
    for (const [portId, cfg] of Object.entries(PORT_PROFILES)) {
      const portConfig = cfg as { id?: string; name?: string; description?: string };
      registerPort({
        portId: portConfig.id ?? portId,
        label: portConfig.name ?? portId,
        description: portConfig.description,
      });
    }
  } catch (error) {
    console.warn("[Directory] Could not register ports:", error);
  }

  // Conduits - dynamically import to avoid circular dependencies
  try {
    const { CONDUITS } = await import("@dreamnet/dreamnet-control-core/conduits");
    for (const [conduitId, cfg] of Object.entries(CONDUITS)) {
      const conduitConfig = cfg as {
        portId: string;
        clusterId: string;
        toolId: string;
        label?: string;
        description?: string;
      };
      registerConduit({
        conduitId,
        portId: conduitConfig.portId,
        clusterId: conduitConfig.clusterId,
        toolId: conduitConfig.toolId,
        label: conduitConfig.label ?? conduitId,
        description: conduitConfig.description,
      });
    }
  } catch (error) {
    console.warn("[Directory] Could not register conduits:", error);
  }

  // Note: Agents would be registered here if we have an agent registry
  // For now, we'll skip agents until the agent registry is available

  // Count ports and conduits after registration
  const { listEntriesByType } = await import('./registry.js');
  const portCount = listEntriesByType("port").length;
  const conduitCount = listEntriesByType("conduit").length;
  
  console.log(`[Directory] ✅ Directory initialized - Registered ${coreNodes.length} nodes, ${portCount} ports, ${conduitCount} conduits`);
}
