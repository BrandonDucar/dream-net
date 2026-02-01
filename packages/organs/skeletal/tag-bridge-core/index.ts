/**
 * TAG Bridge Core
 * Integration layer between Trusted Agent Gateway (TAG) and DreamNet
 */

import { initializeTagClient, getConfig } from './logic/tagClient.js';
import { enableSnailBridge, signSnailTrail } from './logic/snailBridge.js';
import { enableShieldBridge, verifyRequestSignature } from './logic/shieldBridge.js';
import { enableWebhookBridge, inspectWebhookCall } from './logic/webhookBridge.js';
import type { TagConfig, TagBridgeStatus } from './types.js';

let isInitialized = false;
let receiptsSigned = 0;
let receiptsVerified = 0;
let lastSignAt: number | null = null;
let lastVerifyAt: number | null = null;

export const TagBridgeCore = {
  /**
   * Initialize TAG Bridge
   */
  async init(config: TagConfig): Promise<boolean> {
    try {
      initializeTagClient(config);
      enableSnailBridge();
      enableShieldBridge();
      enableWebhookBridge();
      isInitialized = true;
      console.log("🔐 [TAG Bridge] Initialized - All bridges enabled");
      return true;
    } catch (error: any) {
      console.error("[TAG Bridge] Initialization error:", error.message);
      return false;
    }
  },

  /**
   * Get bridge status
   */
  status(): TagBridgeStatus {
    const config = getConfig();
    return {
      initialized: isInitialized,
      tagApiUrl: config?.tagApiUrl || "",
      signingEnabled: !!config?.signingKey,
      verificationEnabled: true,
      chainAnchorEnabled: config?.chainAnchorEnabled || false,
      receiptsSigned,
      receiptsVerified,
      lastSignAt,
      lastVerifyAt,
    };
  },

  // Snail Bridge
  signSnailTrail,
  
  // Shield Bridge
  verifyRequestSignature,
  
  // Webhook Bridge
  inspectWebhookCall,
};

export * from './types.js';
export * from './logic/tagClient.js';
export * from './logic/snailBridge.js';
export * from './logic/shieldBridge.js';
export * from './logic/webhookBridge.js';

export default TagBridgeCore;

