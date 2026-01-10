/**
 * IdentityGrid → Passport Bridge
 * Biomimetic: IdentityGrid (DNA) → Passport (Citizenship) flow
 * Rule: "IdentityGrid → Passport → Citizenship"
 */

import { DreamStateCore } from "@dreamnet/dream-state-core";
import type { DreamPassportTier } from "@dreamnet/dream-state-core/types";
import type { IdentityNode } from '../types.js';

/**
 * Auto-issue passport when IdentityGrid node is created
 */
export function autoIssuePassportForIdentity(node: IdentityNode): void {
  // Check if passport already exists
  const existingPassport = DreamStateCore.getPassport(node.id);
  if (existingPassport) {
    // Passport exists, check if upgrade needed
    checkPassportUpgrade(node, existingPassport.tier);
    return;
  }

  // Determine initial tier based on node type and trust score
  let initialTier: DreamPassportTier = "visitor";

  if (node.type === "agent") {
    initialTier = "operator"; // Agents get operator tier
  } else if (node.type === "wallet" || node.type === "user") {
    if (node.trustScore) {
      if (node.trustScore >= 90) {
        initialTier = "architect";
      } else if (node.trustScore >= 75) {
        initialTier = "operator";
      } else if (node.trustScore >= 60) {
        initialTier = "ambassador";
      } else if (node.trustScore >= 40) {
        initialTier = "citizen";
      } else {
        initialTier = "visitor";
      }
    }
  }

  // Issue passport
  DreamStateCore.issuePassport(
    node.id,
    initialTier,
    node.type === "agent" ? ["agent"] : undefined
  );

  console.log(`🏛️ [Identity-Passport Bridge] Auto-issued ${initialTier} passport for ${node.id} (${node.type})`);

  // Log to Dream State governance
  DreamStateCore.recordAction(
    "administrative",
    "dept:state-integrity",
    "passport_auto_issued",
    {
      identityId: node.id,
      nodeType: node.type,
      tier: initialTier,
      trustScore: node.trustScore,
    }
  );
}

/**
 * Check if passport should be upgraded based on trust score
 */
function checkPassportUpgrade(node: IdentityNode, currentTier: DreamPassportTier): void {
  if (!node.trustScore) {
    return;
  }

  const tierHierarchy: Record<DreamPassportTier, number> = {
    visitor: 1,
    dreamer: 2,
    citizen: 3,
    ambassador: 4,
    operator: 5,
    architect: 6,
    founder: 7,
  };

  let targetTier: DreamPassportTier = currentTier;

  // Determine target tier based on trust score
  if (node.trustScore >= 90 && tierHierarchy[currentTier] < tierHierarchy["architect"]) {
    targetTier = "architect";
  } else if (node.trustScore >= 75 && tierHierarchy[currentTier] < tierHierarchy["operator"]) {
    targetTier = "operator";
  } else if (node.trustScore >= 60 && tierHierarchy[currentTier] < tierHierarchy["ambassador"]) {
    targetTier = "ambassador";
  } else if (node.trustScore >= 40 && tierHierarchy[currentTier] < tierHierarchy["citizen"]) {
    targetTier = "citizen";
  }

  if (targetTier !== currentTier) {
    // Upgrade passport
    const upgraded = DreamStateCore.upgradePassport(node.id, targetTier);
    if (upgraded) {
      console.log(`🏛️ [Identity-Passport Bridge] Upgraded passport for ${node.id}: ${currentTier} → ${targetTier}`);

      // Log to Dream State governance
      DreamStateCore.recordAction(
        "administrative",
        "dept:state-integrity",
        "passport_upgraded",
        {
          identityId: node.id,
          fromTier: currentTier,
          toTier: targetTier,
          trustScore: node.trustScore,
        }
      );
    }
  }
}

/**
 * Update IdentityGrid node when passport action occurs
 */
export function updateIdentityGridFromPassportAction(
  identityId: string,
  action: "issued" | "upgraded" | "revoked",
  tier?: DreamPassportTier
): void {
  // In production, this would update IdentityGrid node metadata
  // For now, we'll log it
  console.log(`🧬 [Identity-Passport Bridge] Passport ${action} for ${identityId}${tier ? ` → ${tier}` : ""}`);

  // TODO: Update IdentityGrid node metadata with passport info
  // IdentityGrid.updateNode(identityId, {
  //   passportTier: tier,
  //   passportAction: action,
  // });
}

