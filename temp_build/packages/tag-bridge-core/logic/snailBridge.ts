/**
 * Dream Snail ↔ TAG Bridge
 * Signs all Dream Snail trails with TAG cryptographic signatures
 */

import { signAction, getReceipt } from "./tagClient";
import type { ProofOfActionReceipt } from "../types";
import type { SnailTrail } from "@dreamnet/dreamnet-snail-core/types";

let enabled = false;

export function enableSnailBridge(): void {
  enabled = true;
  console.log("🐌🔐 [TAG Bridge] Dream Snail signing enabled");
}

export async function signSnailTrail(
  trail: SnailTrail,
  actor: string
): Promise<ProofOfActionReceipt | null> {
  if (!enabled) {
    return null;
  }

  try {
    const receipt = await signAction({
      action: "snail.trail",
      data: {
        trailId: trail.id,
        identityId: trail.identityId,
        eventType: trail.eventType,
        eventData: trail.eventData,
        hash: trail.hash,
        previousHash: trail.previousHash,
      },
      actor,
      target: trail.identityId,
      metadata: {
        source: trail.metadata.source,
        agent: trail.metadata.agent,
        system: trail.metadata.system,
        privacyLevel: trail.metadata.privacyLevel,
      },
    });

    console.log(`🐌🔐 [TAG Bridge] Signed Snail trail: ${trail.id} → Receipt: ${receipt.id}`);
    return receipt;
  } catch (error: any) {
    console.error("[TAG Bridge] Failed to sign Snail trail:", error.message);
    return null;
  }
}

export async function getSnailTrailReceipt(
  trailId: string
): Promise<ProofOfActionReceipt | null> {
  if (!enabled) {
    return null;
  }

  // Query ledger for snail.trail receipts with this trailId
  // This would require TAG to support querying by metadata
  // For now, return null (TAG GPT should generate this capability)
  return null;
}

