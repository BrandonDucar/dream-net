import type { SynapseConfig, SynapseConnection } from "./types";
import { emitEvent } from "../event-wormholes/src/index.ts";

let synapseMap: Record<string, any> = {};
let synapseConnections: SynapseConnection[] = [];

/**
 * Build synapses connecting swarm systems, wormholes, routing, governance, and halo-loop
 * Creates internal "synapses" linking their event buses together
 */
export function buildSynapses(systems: SynapseConfig): Record<string, any> {
  synapseMap = {
    swarm: systems.swarm,
    governance: systems.governance,
    wormholes: systems.wormholes,
    routing: systems.routing,
    haloLoop: systems.haloLoop,
  };

  // Create synapse connections between systems
  synapseConnections = [];

  // Connect Swarm <-> Halo-Loop
  if (systems.swarm && systems.haloLoop) {
    synapseConnections.push({
      id: "swarm-halo",
      from: "swarm",
      to: "haloLoop",
      enabled: true,
    });
  }

  // Connect Governance <-> Wormholes
  if (systems.governance && systems.wormholes) {
    synapseConnections.push({
      id: "governance-wormholes",
      from: "governance",
      to: "wormholes",
      enabled: true,
    });
  }

  // Connect Routing <-> Swarm
  if (systems.routing && systems.swarm) {
    synapseConnections.push({
      id: "routing-swarm",
      from: "routing",
      to: "swarm",
      enabled: true,
    });
  }

  // Connect Halo-Loop <-> Governance
  if (systems.haloLoop && systems.governance) {
    synapseConnections.push({
      id: "halo-governance",
      from: "haloLoop",
      to: "governance",
      enabled: true,
    });
  }

  // Emit synapse creation event
  emitEvent({
    sourceType: "system" as any, // Use "system" as fallback for neural-mesh
    eventType: "synapse.connected",
    severity: "info",
    payload: {
      connections: synapseConnections.length,
      systems: Object.keys(synapseMap),
    },
  }).catch(() => {
    // Event wormholes might not be available
  });

  return synapseMap;
}

/**
 * Get status of all synapses
 */
buildSynapses.status = (): { connections: SynapseConnection[]; count: number } => {
  return {
    connections: synapseConnections,
    count: synapseConnections.length,
  };
};

/**
 * Pulse through a specific synapse
 */
buildSynapses.pulse = async (from: string, to: string, event: any): Promise<void> => {
  const connection = synapseConnections.find(
    (c) => c.from === from && c.to === to && c.enabled
  );

  if (!connection) {
    throw new Error(`No synapse connection from ${from} to ${to}`);
  }

  // Update last pulse timestamp
  connection.lastPulse = Date.now();

  // Route event through synapse
  const targetSystem = synapseMap[to];
  if (targetSystem && typeof targetSystem.onPulse === "function") {
    await targetSystem.onPulse(event);
  }

  // Emit synapse pulse event
  emitEvent({
    sourceType: "system" as any, // Use "system" as fallback for neural-mesh
    eventType: "synapse.pulse",
    severity: "info",
    payload: {
      from,
      to,
      connectionId: connection.id,
    },
  }).catch(() => {
    // Event wormholes might not be available
  });
};

