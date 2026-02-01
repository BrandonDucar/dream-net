/**
 * TAG Bridge Core Types
 * Types for integrating Trusted Agent Gateway (TAG) with DreamNet
 */

export interface TagConfig {
  tagApiUrl: string;
  signingKey?: string; // ed25519 private key (if signing locally)
  verificationKey?: string; // ed25519 public key (if verifying locally)
  chainAnchorEnabled?: boolean;
  chainAnchorRpc?: string;
  chainAnchorContract?: string;
  nonceTtl?: number; // seconds
  clockSkewTolerance?: number; // seconds
}

export interface TagSignature {
  algorithm: "ed25519" | "dilithium" | "falcon";
  signature: string;
  publicKey: string;
  timestamp: number;
  nonce: string;
  headers: Record<string, string>; // Canonical header ordering
}

export interface ProofOfActionReceipt {
  id: string;
  action: string; // e.g., "api.request", "webhook.call", "snail.trail"
  signature: TagSignature;
  timestamp: number;
  actor: string; // Wallet address or API key ID
  target?: string; // Target system/resource
  metadata: Record<string, unknown>;
  ledgerHash?: string; // Postgres ledger hash
  chainHash?: string; // On-chain anchor hash (if enabled)
  verified: boolean;
}

export interface TagSignRequest {
  action: string;
  data: Record<string, unknown>;
  actor: string;
  target?: string;
  metadata?: Record<string, unknown>;
  algorithm?: "ed25519" | "dilithium" | "falcon";
}

export interface TagVerifyRequest {
  signature: TagSignature;
  data: Record<string, unknown>;
  action: string;
}

export interface TagVerifyResponse {
  valid: boolean;
  receipt?: ProofOfActionReceipt;
  error?: string;
}

export interface TagWebhookInspectRequest {
  webhookUrl: string;
  headers: Record<string, string>;
  body: unknown;
  signature?: TagSignature;
}

export interface TagWebhookInspectResponse {
  valid: boolean;
  receipt?: ProofOfActionReceipt;
  inspection: {
    headers: Record<string, string>;
    canonicalOrder: string[];
    signatureValid: boolean;
    timestampValid: boolean;
    nonceValid: boolean;
  };
}

export interface TagRbacCheckRequest {
  actor: string;
  resource: string;
  action: string;
  passportTier?: string; // Dream State passport tier
}

export interface TagRbacCheckResponse {
  allowed: boolean;
  reason?: string;
  requiredTier?: string;
}

export interface TagLedgerQuery {
  actor?: string;
  action?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

export interface TagLedgerEntry {
  receipt: ProofOfActionReceipt;
  ledgerHash: string;
  chainHash?: string;
  indexedAt: number;
}

export interface TagBridgeStatus {
  initialized: boolean;
  tagApiUrl: string;
  signingEnabled: boolean;
  verificationEnabled: boolean;
  chainAnchorEnabled: boolean;
  receiptsSigned: number;
  receiptsVerified: number;
  lastSignAt: number | null;
  lastVerifyAt: number | null;
}

