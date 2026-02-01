/**
 * DreamNet API Key Authentication Middleware
 * Validates API keys from Authorization header or X-API-Key header
 */

import { Request, Response, NextFunction } from "express";
import { validateApiKey } from "../services/DreamNetApiKeyService";

export interface AuthenticatedRequest extends Request {
  apiKey?: {
    id: string;
    keyPrefix: string;
    name: string;
    permissions: string[];
    rateLimit: number;
    userId?: string;
    walletAddress?: string;
  };
}

/**
 * Middleware to authenticate requests using DreamNet API keys
 * Supports:
 * - Authorization: Bearer dn_live_...
 * - X-API-Key: dn_live_...
 */
export async function requireApiKey(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Try Authorization header first
    let apiKey: string | undefined;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      apiKey = authHeader.substring(7);
    } else if (req.headers["x-api-key"]) {
      // Fallback to X-API-Key header
      apiKey = req.headers["x-api-key"] as string;
    }

    if (!apiKey) {
      return res.status(401).json({
        error: "api_key_required",
        message: "DreamNet API key required. Include in Authorization: Bearer <key> or X-API-Key header.",
        hint: "Get your API key at /api/keys/create",
      });
    }

    // Validate API key
    const keyInfo = await validateApiKey(apiKey);

    if (!keyInfo) {
      return res.status(401).json({
        error: "invalid_api_key",
        message: "Invalid or expired API key",
      });
    }

    // Attach key info to request
    req.apiKey = {
      id: keyInfo.id,
      keyPrefix: keyInfo.keyPrefix,
      name: keyInfo.name,
      permissions: keyInfo.permissions,
      rateLimit: keyInfo.rateLimit,
      userId: (req as any).userId,
      walletAddress: (req as any).walletAddress,
    };

    next();
  } catch (error: any) {
    console.error("[APIKeyAuth] Error validating API key:", error);
    return res.status(500).json({
      error: "authentication_error",
      message: "Failed to validate API key",
    });
  }
}

/**
 * Optional API key authentication (doesn't fail if missing)
 * Useful for endpoints that support both API key and wallet auth
 */
export async function optionalApiKey(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    let apiKey: string | undefined;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      apiKey = authHeader.substring(7);
    } else if (req.headers["x-api-key"]) {
      apiKey = req.headers["x-api-key"] as string;
    }

    if (apiKey) {
      const keyInfo = await validateApiKey(apiKey);
      if (keyInfo) {
        req.apiKey = {
          id: keyInfo.id,
          keyPrefix: keyInfo.keyPrefix,
          name: keyInfo.name,
          permissions: keyInfo.permissions,
          rateLimit: keyInfo.rateLimit,
        };
      }
    }

    next();
  } catch (error) {
    // Don't fail on optional auth errors
    next();
  }
}

/**
 * Check if API key has required permission
 */
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.apiKey) {
      return res.status(401).json({
        error: "api_key_required",
        message: "API key authentication required",
      });
    }

    if (!req.apiKey.permissions.includes(permission) && !req.apiKey.permissions.includes("*")) {
      return res.status(403).json({
        error: "insufficient_permissions",
        message: `API key missing required permission: ${permission}`,
        required: permission,
        has: req.apiKey.permissions,
      });
    }

    next();
  };
}

