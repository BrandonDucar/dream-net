import { CitizenshipStore } from "../store/citizenshipStore";
import { recordGovernmentAction } from "./government";
/**
 * Establish diplomatic relations with another protocol/chain/DAO
 * Uses Wolf Pack to initiate outreach
 */
export function establishDiplomaticRelation(ctx, protocolName, protocolType, contactEmail, notes) {
    const now = Date.now();
    const relationId = `diplomatic:${protocolName.toLowerCase().replace(/\s/g, "-")}:${now}`;
    // Create diplomatic relation
    const relation = {
        id: relationId,
        protocolName,
        protocolType,
        status: "neutral", // Start neutral, upgrade to alliance/treaty later
        establishedAt: now,
        contactEmail,
        notes,
    };
    CitizenshipStore.establishRelation(relation);
    // Use Wolf Pack to create a funding lead for diplomatic outreach
    if (ctx.wolfPackFundingCore && contactEmail) {
        try {
            const leadId = `lead:diplomatic-${protocolName.toLowerCase().replace(/\s/g, "-")}`;
            const existingLead = ctx.wolfPackFundingCore.getLead(leadId);
            if (!existingLead) {
                ctx.wolfPackFundingCore.upsertLead({
                    id: leadId,
                    name: `${protocolName} (Diplomatic)`,
                    type: "other",
                    email: contactEmail,
                    tags: ["diplomatic", "protocol", protocolType],
                    stage: "new",
                    notes: `Diplomatic outreach to ${protocolName}. Status: ${relation.status}`,
                });
                // Link the relation to the lead
                relation.wolfPackLeadId = leadId;
                recordGovernmentAction("diplomatic", "dept:diplomacy", `Initiated diplomatic outreach to ${protocolName} via Wolf Pack`, { relationId, leadId });
                console.log(`[DreamState:Diplomacy] Created Wolf Pack lead for ${protocolName}`);
            }
        }
        catch (err) {
            console.warn(`[DreamState:Diplomacy] Failed to create Wolf Pack lead: ${err}`);
        }
    }
    recordGovernmentAction("diplomatic", "dept:diplomacy", `Established diplomatic relation with ${protocolName}`, { relationId, protocolType });
    return relation;
}
/**
 * Upgrade diplomatic status (neutral → embassy → treaty → alliance)
 */
export function upgradeDiplomaticStatus(relationId, newStatus) {
    const relation = CitizenshipStore.getRelation(relationId);
    if (!relation)
        return false;
    const oldStatus = relation.status;
    const success = CitizenshipStore.updateRelationStatus(relationId, newStatus);
    if (success) {
        recordGovernmentAction("diplomatic", "dept:diplomacy", `Upgraded diplomatic status with ${relation.protocolName}: ${oldStatus} → ${newStatus}`, { relationId, oldStatus, newStatus });
    }
    return success;
}
/**
 * Initialize default diplomatic relations
 */
export function ensureDefaultDiplomaticRelations(ctx) {
    const existing = CitizenshipStore.listRelations();
    if (existing.length > 0)
        return existing;
    const relations = [];
    // Base blockchain (primary territory)
    relations.push(establishDiplomaticRelation(ctx, "Base", "chain", undefined, "Primary blockchain territory of Dream State"));
    // Ethereum (parent chain)
    relations.push(establishDiplomaticRelation(ctx, "Ethereum", "chain", undefined, "Parent chain, foundational relationship"));
    // Optimism (sister L2)
    relations.push(establishDiplomaticRelation(ctx, "Optimism", "chain", undefined, "Sister L2, potential collaboration"));
    return relations;
}
