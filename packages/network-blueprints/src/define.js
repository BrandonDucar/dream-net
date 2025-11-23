/**
 * Network Blueprint Definition Helper
 * Provides a simplified API for defining network blueprints
 */
import { registerBlueprint } from "./registry";
/**
 * Define and auto-register a network blueprint
 * Transforms simplified input format to full NetworkBlueprint structure
 */
export function defineNetworkBlueprint(input) {
    const blueprint = {
        id: input.id,
        label: input.label,
        slug: input.slug || input.id.toLowerCase().replace(/_/g, "-"),
        primaryDomain: input.primaryDomain,
        description: input.description,
        version: input.version || "1.0.0",
        citizens: input.citizens?.map((citizen) => ({
            citizenId: citizen.id,
            label: citizen.label,
            description: citizen.description,
        })),
        dreams: input.dreams?.map((dream) => ({
            dreamId: dream.id,
            label: dream.label,
            founderCitizenId: dream.founderCitizenId,
            status: dream.status,
            description: dream.description,
        })),
        agents: input.agents,
        ports: input.ports,
        conduits: input.conduits,
        metadata: {
            createdAt: new Date().toISOString(),
            bootstrapVersion: input.version || "1.0.0",
            ...input.metadata,
        },
    };
    // Auto-register on definition
    registerBlueprint(blueprint);
    return blueprint;
}
