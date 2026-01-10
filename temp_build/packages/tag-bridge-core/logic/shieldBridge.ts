/**
 * Shield Core ↔ TAG Bridge
 * Verifies cryptographic signatures before threat detection
 */

import { verifySignature } from "./tagClient";
import type { TagSignature, TagVerifyRequest } from "../types";
import type { Threat } from "@dreamnet/shield-core/types";

let enabled = false;

export function enableShieldBridge(): void {
  enabled = true;
  console.log("🛡️🔐 [TAG Bridge] Shield Core verification enabled");
}

export async function verifyRequestSignature(
  signature: TagSignature,
  requestData: Record<string, unknown>,
  action: string
): Promise<{ valid: boolean; threat?: Threat }> {
  if (!enabled) {
    return { valid: true }; // If TAG not enabled, allow through
  }

  try {
    const verifyRequest: TagVerifyRequest = {
      signature,
      data: requestData,
      action,
    };

    const result = await verifySignature(verifyRequest);

    if (!result.valid) {
      // Invalid signature = potential threat
      return {
        valid: false,
        threat: {
          id: `tag-invalid-sig-${Date.now()}`,
          type: "unauthorized_access" as const,
          level: "high" as const,
          source: signature.publicKey,
          detectedAt: Date.now(),
          payload: {
            reason: result.error || "Invalid cryptographic signature",
            action,
          },
        },
      };
    }

    return { valid: true };
  } catch (error: any) {
    console.error("[TAG Bridge] Shield verification error:", error.message);
    // On error, treat as potential threat
    return {
      valid: false,
      threat: {
        id: `tag-verify-error-${Date.now()}`,
        type: "system_error" as const,
        level: "medium" as const,
        source: "tag-bridge",
        detectedAt: Date.now(),
        payload: {
          error: error.message,
          action,
        },
      },
    };
  }
}

