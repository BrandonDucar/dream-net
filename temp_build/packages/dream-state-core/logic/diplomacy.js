"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.establishDiplomaticRelation = establishDiplomaticRelation;
exports.upgradeDiplomaticStatus = upgradeDiplomaticStatus;
exports.ensureDefaultDiplomaticRelations = ensureDefaultDiplomaticRelations;
const citizenshipStore_1 = require("../store/citizenshipStore");
const government_1 = require("./government");
/**
 * Establish diplomatic relations with another protocol/chain/DAO
 * Uses Wolf Pack to initiate outreach
 */
function establishDiplomaticRelation(ctx, protocolName, protocolType, contactEmail, notes) {
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
    citizenshipStore_1.CitizenshipStore.establishRelation(relation);
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
                (0, government_1.recordGovernmentAction)("diplomatic", "dept:diplomacy", `Initiated diplomatic outreach to ${protocolName} via Wolf Pack`, { relationId, leadId });
                console.log(`[DreamState:Diplomacy] Created Wolf Pack lead for ${protocolName}`);
            }
        }
        catch (err) {
            console.warn(`[DreamState:Diplomacy] Failed to create Wolf Pack lead: ${err}`);
        }
    }
    (0, government_1.recordGovernmentAction)("diplomatic", "dept:diplomacy", `Established diplomatic relation with ${protocolName}`, { relationId, protocolType });
    return relation;
}
/**
 * Upgrade diplomatic status (neutral → embassy → treaty → alliance)
 */
function upgradeDiplomaticStatus(relationId, newStatus) {
    const relation = citizenshipStore_1.CitizenshipStore.getRelation(relationId);
    if (!relation)
        return false;
    const oldStatus = relation.status;
    const success = citizenshipStore_1.CitizenshipStore.updateRelationStatus(relationId, newStatus);
    if (success) {
        (0, government_1.recordGovernmentAction)("diplomatic", "dept:diplomacy", `Upgraded diplomatic status with ${relation.protocolName}: ${oldStatus} → ${newStatus}`, { relationId, oldStatus, newStatus });
    }
    return success;
}
/**
 * Initialize default diplomatic relations
 */
function ensureDefaultDiplomaticRelations(ctx) {
    const existing = citizenshipStore_1.CitizenshipStore.listRelations();
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
