/**
 * TAG Client
 * Client for interacting with TAG microservice
 */

import axios from "axios";
import type {
  TagConfig,
  TagSignRequest,
  TagVerifyRequest,
  TagVerifyResponse,
  ProofOfActionReceipt,
  TagWebhookInspectRequest,
  TagWebhookInspectResponse,
  TagRbacCheckRequest,
  TagRbacCheckResponse,
  TagLedgerQuery,
  TagLedgerEntry,
} from "../types";

let config: TagConfig | null = null;

export function initializeTagClient(tagConfig: TagConfig): void {
  config = tagConfig;
  console.log(`🔐 [TAG Bridge] Initialized - API: ${config.tagApiUrl}`);
}

export async function signAction(request: TagSignRequest): Promise<ProofOfActionReceipt> {
  if (!config) {
    throw new Error("TAG client not initialized");
  }

  try {
    const response = await axios.post(`${config.tagApiUrl}/tag/sign`, request, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.receipt;
  } catch (error: any) {
    console.error("[TAG Bridge] Sign error:", error.message);
    throw new Error(`Failed to sign action: ${error.message}`);
  }
}

export async function verifySignature(
  request: TagVerifyRequest
): Promise<TagVerifyResponse> {
  if (!config) {
    throw new Error("TAG client not initialized");
  }

  try {
    const response = await axios.post(`${config.tagApiUrl}/tag/verify`, request, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("[TAG Bridge] Verify error:", error.message);
    return {
      valid: false,
      error: error.message,
    };
  }
}

export async function getReceipt(receiptId: string): Promise<ProofOfActionReceipt | null> {
  if (!config) {
    throw new Error("TAG client not initialized");
  }

  try {
    const response = await axios.get(`${config.tagApiUrl}/tag/receipt/${receiptId}`);
    return response.data.receipt;
  } catch (error: any) {
    console.error("[TAG Bridge] Get receipt error:", error.message);
    return null;
  }
}

export async function inspectWebhook(
  request: TagWebhookInspectRequest
): Promise<TagWebhookInspectResponse> {
  if (!config) {
    throw new Error("TAG client not initialized");
  }

  try {
    const response = await axios.post(`${config.tagApiUrl}/tag/webhook/inspect`, request, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("[TAG Bridge] Webhook inspect error:", error.message);
    return {
      valid: false,
      inspection: {
        headers: request.headers,
        canonicalOrder: [],
        signatureValid: false,
        timestampValid: false,
        nonceValid: false,
      },
    };
  }
}

export async function checkRbac(
  request: TagRbacCheckRequest
): Promise<TagRbacCheckResponse> {
  if (!config) {
    throw new Error("TAG client not initialized");
  }

  try {
    const response = await axios.post(`${config.tagApiUrl}/tag/rbac/check`, request, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("[TAG Bridge] RBAC check error:", error.message);
    return {
      allowed: false,
      reason: error.message,
    };
  }
}

export async function queryLedger(query: TagLedgerQuery): Promise<TagLedgerEntry[]> {
  if (!config) {
    throw new Error("TAG client not initialized");
  }

  try {
    const response = await axios.post(`${config.tagApiUrl}/tag/ledger/query`, query, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.entries || [];
  } catch (error: any) {
    console.error("[TAG Bridge] Ledger query error:", error.message);
    return [];
  }
}

export function getConfig(): TagConfig | null {
  return config;
}

