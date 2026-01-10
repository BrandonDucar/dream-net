"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSquadBuilderSquads = syncSquadBuilderSquads;
const squadRegistry_1 = require("../registry/squadRegistry");
const registry_1 = require("@dreamnet/squad-builder/src/registry");
/**
 * Bridge between Squad-Builder and Squad Alchemy
 * Syncs Squad-Builder squads into Squad Alchemy registry
 */
function syncSquadBuilderSquads() {
    try {
        const builderSquads = (0, registry_1.getSquads)();
        let synced = 0;
        for (const builderSquad of builderSquads) {
            // Convert Squad-Builder squad to Squad Alchemy format
            const alchemySquad = {
                id: builderSquad.id,
                role: mapSquadRole(builderSquad.role || "generic"),
                members: (builderSquad.agents || []).map((agent) => ({
                    id: agent.id || agent.name || `agent-${Date.now()}`,
                    capabilities: agent.capabilities || [],
                    loadFactor: agent.loadFactor,
                })),
                tags: builderSquad.tags || [],
                createdAt: builderSquad.createdAt?.getTime() || Date.now(),
                updatedAt: builderSquad.updatedAt?.getTime() || Date.now(),
                lineage: {
                    generation: 1,
                },
            };
            squadRegistry_1.SquadRegistry.upsert(alchemySquad);
            synced++;
        }
        return synced;
    }
    catch (error) {
        console.warn("[SquadAlchemy] Failed to sync Squad-Builder squads:", error);
        return 0;
    }
}
/**
 * Map Squad-Builder role to Squad Alchemy role
 */
function mapSquadRole(role) {
    const roleMap = {
        repair: "repair",
        deploy: "deploy",
        monitor: "monitor",
        routing: "routing",
        governance: "governance",
        experimental: "experimental",
        generic: "generic",
    };
    return roleMap[role.toLowerCase()] || "generic";
}
