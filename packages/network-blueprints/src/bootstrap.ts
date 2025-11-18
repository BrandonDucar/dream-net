/**
 * Blueprint Bootstrap
 * Bootstraps DreamNet entities from a network blueprint
 */

import type { NetworkBlueprint } from "./types";
import {
  registerCitizen,
  registerAgent,
  registerDream,
  registerPort,
  registerConduit,
} from "@dreamnet/directory/registry";

export interface BootstrapResult {
  blueprintId: string;
  citizensRegistered: number;
  agentsRegistered: number;
  dreamsRegistered: number;
  portsRegistered: number;
  conduitsRegistered: number;
  success: boolean;
  errors?: string[];
}

export function bootstrapFromBlueprint(blueprint: NetworkBlueprint): BootstrapResult {
  const errors: string[] = [];
  let citizensRegistered = 0;
  let agentsRegistered = 0;
  let dreamsRegistered = 0;
  let portsRegistered = 0;
  let conduitsRegistered = 0;

  try {
    // Register citizens
    if (blueprint.citizens) {
      for (const citizen of blueprint.citizens) {
        try {
          registerCitizen({
            citizenId: citizen.citizenId,
            label: citizen.label,
            description: citizen.description,
          });
          citizensRegistered++;
        } catch (error: any) {
          errors.push(`Failed to register citizen ${citizen.citizenId}: ${error.message}`);
        }
      }
    }

    // Register agents
    if (blueprint.agents) {
      for (const agent of blueprint.agents) {
        try {
          registerAgent({
            agentId: agent.agentId,
            label: agent.label,
            clusterId: agent.clusterId,
            kind: agent.kind,
            description: agent.description,
          });
          agentsRegistered++;
        } catch (error: any) {
          errors.push(`Failed to register agent ${agent.agentId}: ${error.message}`);
        }
      }
    }

    // Register dreams
    if (blueprint.dreams) {
      for (const dream of blueprint.dreams) {
        try {
          registerDream({
            dreamId: dream.dreamId,
            label: dream.label,
            founderCitizenId: dream.founderCitizenId,
            status: dream.status,
            description: dream.description,
          });
          dreamsRegistered++;
        } catch (error: any) {
          errors.push(`Failed to register dream ${dream.dreamId}: ${error.message}`);
        }
      }
    }

    // Register ports
    if (blueprint.ports) {
      for (const port of blueprint.ports) {
        try {
          registerPort({
            portId: port.portId,
            label: port.label,
            description: port.description,
          });
          portsRegistered++;
        } catch (error: any) {
          errors.push(`Failed to register port ${port.portId}: ${error.message}`);
        }
      }
    }

    // Register conduits
    if (blueprint.conduits) {
      for (const conduit of blueprint.conduits) {
        try {
          registerConduit({
            conduitId: conduit.conduitId,
            portId: conduit.portId,
            clusterId: conduit.clusterId,
            toolId: conduit.toolId,
            label: conduit.label,
            description: conduit.description,
          });
          conduitsRegistered++;
        } catch (error: any) {
          errors.push(`Failed to register conduit ${conduit.conduitId}: ${error.message}`);
        }
      }
    }
  } catch (error: any) {
    errors.push(`Bootstrap failed: ${error.message}`);
  }

  return {
    blueprintId: blueprint.id,
    citizensRegistered,
    agentsRegistered,
    dreamsRegistered,
    portsRegistered,
    conduitsRegistered,
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

