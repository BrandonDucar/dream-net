/**
 * DreamNet API Keys Routes
 * Endpoints for users to create, manage, and revoke their API keys
 */

import { Router, Request, Response } from "express";
import { requireAuth } from "../siwe-auth";
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  getApiKeyById,
  getOrCreateDefaultApiKey,
} from "../services/DreamNetApiKeyService";
import { requireApiKey } from "../middleware/apiKeyAuth";

const router = Router();

/**
 * POST /api/keys/create
 * Create a new API key
 * Requires wallet authentication (SIWE)
 */
router.post("/create", requireAuth, async (req: Request, res: Response) => {
  try {
    const walletAddress = (req as any).user?.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({
        error: "authentication_required",
        message: "Wallet authentication required",
      });
    }

    const {
      name,
      description,
      permissions = [],
      rateLimit = 1000,
      expiresInDays,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "name_required",
        message: "API key name is required",
      });
    }

    const result = await createApiKey({
      walletAddress,
      name,
      description,
      permissions: Array.isArray(permissions) ? permissions : [],
      rateLimit: typeof rateLimit === "number" ? rateLimit : 1000,
      expiresInDays: typeof expiresInDays === "number" ? expiresInDays : undefined,
      createdBy: walletAddress,
    });

    // Return key info (plaintext key only shown once!)
    res.status(201).json({
      success: true,
      key: result.key, // ⚠️ Only shown once - user must save this!
      keyInfo: {
        id: result.keyInfo.id,
        keyPrefix: result.keyInfo.keyPrefix,
        name: result.keyInfo.name,
        description: result.keyInfo.description,
        permissions: result.keyInfo.permissions,
        rateLimit: result.keyInfo.rateLimit,
        expiresAt: result.keyInfo.expiresAt,
        createdAt: result.keyInfo.createdAt,
      },
      warning: "⚠️ Save this API key now! It will not be shown again.",
    });
  } catch (error: any) {
    console.error("[APIKeys] Create error:", error);
    res.status(500).json({
      error: "create_failed",
      message: error.message || "Failed to create API key",
    });
  }
});

/**
 * GET /api/keys
 * List all API keys for the authenticated user
 */
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const walletAddress = (req as any).user?.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({
        error: "authentication_required",
        message: "Wallet authentication required",
      });
    }

    const keys = await listApiKeys(undefined, walletAddress);

    res.json({
      success: true,
      keys: keys.map((key) => ({
        id: key.id,
        keyPrefix: key.keyPrefix,
        name: key.name,
        description: key.description,
        permissions: key.permissions,
        rateLimit: key.rateLimit,
        lastUsedAt: key.lastUsedAt,
        expiresAt: key.expiresAt,
        createdAt: key.createdAt,
        revokedAt: key.revokedAt,
        status: key.revokedAt ? "revoked" : key.expiresAt && new Date(key.expiresAt) < new Date() ? "expired" : "active",
      })),
      count: keys.length,
    });
  } catch (error: any) {
    console.error("[APIKeys] List error:", error);
    res.status(500).json({
      error: "list_failed",
      message: error.message || "Failed to list API keys",
    });
  }
});

/**
 * DELETE /api/keys/:keyId
 * Revoke an API key
 */
router.delete("/:keyId", requireAuth, async (req: Request, res: Response) => {
  try {
    const walletAddress = (req as any).user?.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({
        error: "authentication_required",
        message: "Wallet authentication required",
      });
    }

    const { keyId } = req.params;

    const revoked = await revokeApiKey(keyId, undefined, walletAddress);

    if (revoked) {
      res.json({
        success: true,
        message: "API key revoked successfully",
      });
    } else {
      res.status(404).json({
        error: "key_not_found",
        message: "API key not found or already revoked",
      });
    }
  } catch (error: any) {
    console.error("[APIKeys] Revoke error:", error);
    res.status(500).json({
      error: "revoke_failed",
      message: error.message || "Failed to revoke API key",
    });
  }
});

/**
 * GET /api/keys/default
 * Get or create default API key for authenticated user
 * Returns existing default key info, or creates a new one
 */
router.get("/default", requireAuth, async (req: Request, res: Response) => {
  try {
    const walletAddress = (req as any).user?.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({
        error: "authentication_required",
        message: "Wallet authentication required",
      });
    }

    const result = await getOrCreateDefaultApiKey(walletAddress);

    if (result.isNew) {
      // New key created - return plaintext (only shown once!)
      res.json({
        success: true,
        key: result.key, // ⚠️ Only shown once!
        keyInfo: {
          id: result.keyInfo.id,
          keyPrefix: result.keyInfo.keyPrefix,
          name: result.keyInfo.name,
          description: result.keyInfo.description,
          permissions: result.keyInfo.permissions,
          rateLimit: result.keyInfo.rateLimit,
          createdAt: result.keyInfo.createdAt,
        },
        warning: "⚠️ Save this API key now! It will not be shown again.",
      });
    } else {
      // Existing key - can't show plaintext, but return info
      res.json({
        success: true,
        key: null, // Can't show plaintext for existing keys
        keyInfo: {
          id: result.keyInfo.id,
          keyPrefix: result.keyInfo.keyPrefix,
          name: result.keyInfo.name,
          description: result.keyInfo.description,
          permissions: result.keyInfo.permissions,
          rateLimit: result.keyInfo.rateLimit,
          lastUsedAt: result.keyInfo.lastUsedAt,
          createdAt: result.keyInfo.createdAt,
        },
        message: "You already have a default API key. Use /api/keys/create to create additional keys.",
      });
    }
  } catch (error: any) {
    console.error("[APIKeys] Get default error:", error);
    res.status(500).json({
      error: "get_default_failed",
      message: error.message || "Failed to get default API key",
    });
  }
});

/**
 * GET /api/keys/validate
 * Validate an API key (for testing)
 * Can be called with API key auth to test it
 */
router.get("/validate", requireApiKey, async (req: Request, res: Response) => {
  try {
    const apiKey = (req as any).apiKey;
    
    res.json({
      success: true,
      valid: true,
      keyInfo: {
        id: apiKey.id,
        keyPrefix: apiKey.keyPrefix,
        name: apiKey.name,
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: "validation_failed",
      message: error.message || "Failed to validate API key",
    });
  }
});

export default router;

