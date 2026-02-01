/**
 * Port Governor Middleware
 * Enforces port access control, tier checks, and office/cabinet requirements
 */

import type { Request, Response, NextFunction } from "express";
import type { PortId } from './types.js';
import { getPortProfile } from './ports.js';
import type { RequestWithIdentity, CallerIdentity } from '@dreamnet/dreamnet-control-core/identityResolver';
import { checkAndConsume } from '@dreamnet/dreamnet-control-core/rateLimiter';
import type { OfficeId, CabinetId } from '@dreamnet/dreamstate';

// Shield Core risk tracking (optional import)
let getRiskProfile: ((callerId: string) => any) | null = null;
try {
  const riskModule = require("../../shield-core/src/risk");
  getRiskProfile = riskModule.getRiskProfile;
} catch (error) {
  // Shield Core risk module not available, continue without risk checks
}

function hasOffice(identity: CallerIdentity | undefined, officeId: OfficeId): boolean {
  if (!identity) return false;
  return identity.officeIds?.includes(officeId) === true;
}

function hasCabinet(identity: CallerIdentity | undefined, cabinetId: CabinetId): boolean {
  if (!identity) return false;
  return identity.cabinetIds?.includes(cabinetId) === true;
}

export function withPort(portId: PortId) {
  return (req: RequestWithIdentity, res: Response, next: NextFunction) => {
    const traceId = req.traceId || "unknown";
    const callerIdentity = req.callerIdentity;
    const portProfile = getPortProfile(portId);

    if (!portProfile) {
      console.warn(`[PortGovernor] Unknown port: ${portId}`, { traceId });
      return res.status(500).json({
        error: "PORT_CONFIGURATION_ERROR",
        message: `Port ${portId} is not configured`,
        traceId,
      });
    }

    // Attach port profile to request for downstream use
    (req as any).portProfile = portProfile;
    (req as any).portId = portId;

    // If no identity, deny (should be caught by identity resolver middleware)
    if (!callerIdentity) {
      console.warn(`[PortGovernor] No identity for port ${portId}`, { traceId });
      return res.status(401).json({
        error: "IDENTITY_REQUIRED",
        message: "Authentication required to access this port",
        traceId,
        portId,
      });
    }

    const isGodVault = callerIdentity.isGodVault;

    // Tier check
    if (!isGodVault && !portProfile.allowedTiers.includes(callerIdentity.tierId)) {
      console.warn(`[PortGovernor] Tier denied for port ${portId}`, {
        traceId,
        tierId: callerIdentity.tierId,
        requiredTiers: portProfile.allowedTiers,
      });
      return res.status(403).json({
        error: "TIER_DENIED",
        message: `Port ${portId} requires one of: ${portProfile.allowedTiers.join(", ")}`,
        traceId,
        portId,
        tierId: callerIdentity.tierId,
      });
    }

    // Office check
    if (!isGodVault && portProfile.requiredOfficeIds && portProfile.requiredOfficeIds.length > 0) {
      const hasRequiredOffice = portProfile.requiredOfficeIds.some((officeId) =>
        hasOffice(callerIdentity, officeId)
      );
      if (!hasRequiredOffice) {
        console.warn(`[PortGovernor] Office denied for port ${portId}`, {
          traceId,
          requiredOffices: portProfile.requiredOfficeIds,
          callerOffices: callerIdentity.officeIds,
        });
        return res.status(403).json({
          error: "OFFICE_REQUIRED",
          message: `Port ${portId} requires one of: ${portProfile.requiredOfficeIds.join(", ")}`,
          traceId,
          portId,
          requiredOfficeIds: portProfile.requiredOfficeIds,
        });
      }
    }

    // Cabinet check
    if (!isGodVault && portProfile.requiredCabinetIds && portProfile.requiredCabinetIds.length > 0) {
      const hasRequiredCabinet = portProfile.requiredCabinetIds.some((cabinetId) =>
        hasCabinet(callerIdentity, cabinetId)
      );
      if (!hasRequiredCabinet) {
        console.warn(`[PortGovernor] Cabinet denied for port ${portId}`, {
          traceId,
          requiredCabinets: portProfile.requiredCabinetIds,
          callerCabinets: callerIdentity.cabinetIds,
        });
        return res.status(403).json({
          error: "CABINET_REQUIRED",
          message: `Port ${portId} requires one of: ${portProfile.requiredCabinetIds.join(", ")}`,
          traceId,
          portId,
          requiredCabinetIds: portProfile.requiredCabinetIds,
        });
      }
    }

    // Risk-based adaptive limits (if Shield Core risk tracking available)
    let riskLevel: string = "low";
    let effectivePortLimit = portProfile.limits.maxRequestsPerMinute;

    if (!isGodVault && getRiskProfile) {
      const callerId =
        callerIdentity.passport?.citizenId ||
        callerIdentity.apiKeyId ||
        "anonymous";

      const riskProfile = callerId !== "anonymous" ? getRiskProfile(callerId) : undefined;
      riskLevel = riskProfile?.level ?? "low";

      // 🌀 METABOLIC BRIDGE: Report pressure to Nerve Bus
      try {
        const { NERVE_BUS } = require("@dreamnet/nerve");
        const pressureMap: Record<string, number> = { low: 0, medium: 30, high: 60, critical: 100 };
        const pressure = pressureMap[riskLevel] || 0;
        NERVE_BUS.setMetabolicPressure(pressure);
      } catch (e) {
        // Fallback if Nerve Bus is not available in current context
      }

      // Adaptive throttling based on risk
      if (riskLevel === "critical" && portId !== "AGENT_GATEWAY") {
        console.warn(`[PortGovernor] Critical risk - blocking port ${portId}`, {
          traceId,
          callerId,
          riskLevel,
          portId,
        });
        return res.status(403).json({
          error: "RISK_PROFILE_BLOCK",
          message: `Port ${portId} blocked due to critical risk profile`,
          traceId,
          portId,
          riskLevel,
          callerId,
        });
      } else if (riskLevel === "high") {
        // Soft throttle: treat as if port limit is half
        effectivePortLimit = Math.floor(portProfile.limits.maxRequestsPerMinute / 2);
        console.info(`[PortGovernor] High risk - throttling port ${portId}`, {
          traceId,
          callerId,
          riskLevel,
          originalLimit: portProfile.limits.maxRequestsPerMinute,
          effectiveLimit: effectivePortLimit,
        });
      }
    }

    // Rate limit check (using port limits, adjusted for risk)
    if (!isGodVault) {
      const tierLimit = callerIdentity.tier.maxRequestsPerMinute;
      const effectiveLimit = Math.min(effectivePortLimit, tierLimit);

      const rateCheck = checkAndConsume(
        portProfile.clusterId || portId,
        callerIdentity.tierId,
        effectiveLimit
      );

      if (!rateCheck.allowed) {
        const reason = riskLevel === "high" ? "RISK_PROFILE_THROTTLE" : "RATE_LIMITED";
        console.warn(`[PortGovernor] Rate limited for port ${portId}`, {
          traceId,
          tierId: callerIdentity.tierId,
          limit: effectiveLimit,
          riskLevel,
          reason,
        });
        return res.status(429).json({
          error: reason,
          message: riskLevel === "high"
            ? `Rate limit exceeded for port ${portId} (risk-based throttling)`
            : `Rate limit exceeded for port ${portId}`,
          traceId,
          portId,
          limit: effectiveLimit,
          remaining: rateCheck.remaining,
          riskLevel,
        });
      }
    }

    // All checks passed
    console.info(`[PortGovernor] Port access granted`, {
      traceId,
      portId,
      tierId: callerIdentity.tierId,
      isGodVault,
    });

    next();
  };
}

