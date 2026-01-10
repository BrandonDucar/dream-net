"use strict";
/**
 * Blueprint Bootstrap
 * Bootstraps DreamNet entities from a network blueprint
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapFromBlueprint = bootstrapFromBlueprint;
const registry_1 = require("../../directory/src/registry");
function bootstrapFromBlueprint(blueprint) {
    const errors = [];
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
                    (0, registry_1.registerCitizen)({
                        citizenId: citizen.citizenId,
                        label: citizen.label,
                        description: citizen.description,
                    });
                    citizensRegistered++;
                }
                catch (error) {
                    errors.push(`Failed to register citizen ${citizen.citizenId}: ${error.message}`);
                }
            }
        }
        // Register agents
        if (blueprint.agents) {
            for (const agent of blueprint.agents) {
                try {
                    (0, registry_1.registerAgent)({
                        agentId: agent.agentId,
                        label: agent.label,
                        clusterId: agent.clusterId,
                        kind: agent.kind,
                        description: agent.description,
                    });
                    agentsRegistered++;
                }
                catch (error) {
                    errors.push(`Failed to register agent ${agent.agentId}: ${error.message}`);
                }
            }
        }
        // Register dreams
        if (blueprint.dreams) {
            for (const dream of blueprint.dreams) {
                try {
                    (0, registry_1.registerDream)({
                        dreamId: dream.dreamId,
                        label: dream.label,
                        founderCitizenId: dream.founderCitizenId,
                        status: dream.status,
                        description: dream.description,
                    });
                    dreamsRegistered++;
                }
                catch (error) {
                    errors.push(`Failed to register dream ${dream.dreamId}: ${error.message}`);
                }
            }
        }
        // Register ports
        if (blueprint.ports) {
            for (const port of blueprint.ports) {
                try {
                    (0, registry_1.registerPort)({
                        portId: port.portId,
                        label: port.label,
                        description: port.description,
                    });
                    portsRegistered++;
                }
                catch (error) {
                    errors.push(`Failed to register port ${port.portId}: ${error.message}`);
                }
            }
        }
        // Register conduits
        if (blueprint.conduits) {
            for (const conduit of blueprint.conduits) {
                try {
                    (0, registry_1.registerConduit)({
                        conduitId: conduit.conduitId,
                        portId: conduit.portId,
                        clusterId: conduit.clusterId,
                        toolId: conduit.toolId,
                        label: conduit.label,
                        description: conduit.description,
                    });
                    conduitsRegistered++;
                }
                catch (error) {
                    errors.push(`Failed to register conduit ${conduit.conduitId}: ${error.message}`);
                }
            }
        }
    }
    catch (error) {
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
