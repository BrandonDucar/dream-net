/**
 * Dream State Passport Gate Middleware
 * Biomimetic: Dream State is top-level authority - all access flows through passports
 */

import { Request, Response, NextFunction } from "express";
// Import Shield for self-protection
import { ShieldStore } from "@dreamnet/shield-core";
import type { DreamPassportTier } from "@dreamnet/dream-state-core";
import { getTraceId } from "./traceId";

export type RequiredTier = DreamPassportTier;

/**
 * Create passport gate middleware
 * Checks if user has required passport tier
 */
export function createPassportGate(requiredTier: RequiredTier) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const traceId = (req as any).traceId || getTraceId(req);

    // Get identity from request (wallet address or user ID)
    const walletAddress = (req as any).walletAddress || req.headers["x-wallet-address"] as string;
    const userId = (req as any).userId || req.headers["x-user-id"] as string;
    const identityId = walletAddress || userId;

    if (!identityId) {
      return res.status(401).json({
        ok: false,
        error: "passport_required",
        message: "Dream State passport required. Please connect wallet or authenticate.",
        traceId,
      });
    }

    // Get passport from Dream State
    const passport = DreamStateCore.getPassport(identityId);

    if (!passport) {
      return res.status(403).json({
        ok: false,
        error: "no_passport",
        message: "No Dream State passport found. Please request passport issuance.",
        traceId,
        identityId,
      });
    }

    // Check tier hierarchy
    const tierHierarchy: Record<DreamPassportTier, number> = {
      visitor: 1,
      citizen: 2,
      ambassador: 3,
      operator: 4,
      architect: 5,
      founder: 6,
    };

    const userTierLevel = tierHierarchy[passport.tier];
    const requiredTierLevel = tierHierarchy[requiredTier];

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        ok: false,
        error: "insufficient_tier",
        message: `Requires ${requiredTier} tier passport. Current tier: ${passport.tier}`,
        traceId,
        identityId,
        currentTier: passport.tier,
        requiredTier,
      });
    }

    // Attach passport to request for downstream use
    (req as any).passport = passport;
    (req as any).identityId = identityId;

    // Log access (for audit)
    DreamStateCore.recordGovernmentAction({
      departmentId: "dept:state-integrity",
      action: "access_granted",
      details: {
        resource: req.path,
        tier: passport.tier,
        requiredTier,
      },
      identityId,
    });

    next();
  };
}

/**
 * Helper to get passport from request (after gate middleware)
 */
export function getPassport(req: Request) {
  return (req as any).passport;
}

/**
 * Helper to get identity ID from request
 */
export function getIdentityId(req: Request): string | undefined {
  return (req as any).identityId;
}

