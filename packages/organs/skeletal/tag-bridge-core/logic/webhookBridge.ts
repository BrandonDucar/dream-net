/**
 * Webhook Nervous Core ↔ TAG Bridge
 * Routes webhooks through TAG's Trusted Webhook IDE
 */

import { inspectWebhook } from './tagClient.js';
import type { TagWebhookInspectRequest, TagWebhookInspectResponse } from '../types.js';
import type { WebhookEvent } from "@dreamnet/webhook-nervous-core/types";

let enabled = false;

export function enableWebhookBridge(): void {
  enabled = true;
  console.log("🕸️🔐 [TAG Bridge] Webhook inspection enabled");
}

export async function inspectWebhookCall(
  webhookEvent: WebhookEvent,
  signature?: string
): Promise<TagWebhookInspectResponse> {
  if (!enabled) {
    return {
      valid: true,
      inspection: {
        headers: webhookEvent.headers || {},
        canonicalOrder: [],
        signatureValid: true,
        timestampValid: true,
        nonceValid: true,
      },
    };
  }

  try {
    const inspectRequest: TagWebhookInspectRequest = {
      webhookUrl: webhookEvent.url,
      headers: webhookEvent.headers || {},
      body: webhookEvent.payload,
      signature: signature ? JSON.parse(signature) : undefined,
    };

    const result = await inspectWebhook(inspectRequest);

    if (result.valid && result.receipt) {
      console.log(`🕸️🔐 [TAG Bridge] Webhook inspected: ${webhookEvent.url} → Receipt: ${result.receipt.id}`);
    } else {
      console.warn(`🕸️🔐 [TAG Bridge] Webhook inspection failed: ${webhookEvent.url}`);
    }

    return result;
  } catch (error: any) {
    console.error("[TAG Bridge] Webhook inspect error:", error.message);
    return {
      valid: false,
      inspection: {
        headers: webhookEvent.headers || {},
        canonicalOrder: [],
        signatureValid: false,
        timestampValid: false,
        nonceValid: false,
      },
    };
  }
}

