/**
 * Zero-Trust Architecture
 * Continuous verification of all requests (never trust, always verify)
 */

import type { Request, Response, NextFunction } from "express";

export interface ZeroTrustContext {
  deviceId: string;
  deviceFingerprint: string;
  userAgent: string;
  ipAddress: string;
  sessionId: string;
  trustScore: number; // 0-1
  verified: boolean;
  lastVerification: number;
  verificationCount: number;
}

export interface DeviceFingerprint {
  userAgent: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
  platform?: string;
  cookieEnabled?: boolean;
  hash: string; // Hash of all fingerprint data
}

/**
 * Zero-Trust Verifier
 */
export class ZeroTrustVerifier {
  private deviceContexts: Map<string, ZeroTrustContext> = new Map();
  private verificationInterval: number = 300000; // 5 minutes
  private trustScoreThreshold: number = 0.7; // Minimum trust score to allow access

  /**
   * Verify request using zero-trust principles
   */
  async verifyRequest(
    req: Request,
    deviceFingerprint?: DeviceFingerprint
  ): Promise<{ allowed: boolean; context?: ZeroTrustContext; reason?: string }> {
    const deviceId = this.getDeviceId(req);
    const context = this.getOrCreateContext(deviceId, req, deviceFingerprint);

    // Continuous verification
    const now = Date.now();
    const timeSinceLastVerification = now - context.lastVerification;

    // Re-verify if enough time has passed
    if (timeSinceLastVerification > this.verificationInterval) {
      context.verified = false;
    }

    // Verify device fingerprint
    if (deviceFingerprint) {
      const fingerprintMatch = this.verifyFingerprint(context, deviceFingerprint);
      if (!fingerprintMatch) {
        context.trustScore = Math.max(0, context.trustScore - 0.2);
        return {
          allowed: false,
          context,
          reason: "Device fingerprint mismatch",
        };
      }
    }

    // Verify user behavior
    const behaviorScore = this.analyzeBehavior(context, req);
    context.trustScore = (context.trustScore * 0.7) + (behaviorScore * 0.3);

    // Update verification
    context.verified = true;
    context.lastVerification = now;
    context.verificationCount++;

    // Check if trust score is sufficient
    if (context.trustScore < this.trustScoreThreshold) {
      return {
        allowed: false,
        context,
        reason: `Trust score ${(context.trustScore * 100).toFixed(1)}% below threshold ${(this.trustScoreThreshold * 100).toFixed(1)}%`,
      };
    }

    return {
      allowed: true,
      context,
    };
  }

  /**
   * Get or create device context
   */
  private getOrCreateContext(
    deviceId: string,
    req: Request,
    deviceFingerprint?: DeviceFingerprint
  ): ZeroTrustContext {
    if (!this.deviceContexts.has(deviceId)) {
      const context: ZeroTrustContext = {
        deviceId,
        deviceFingerprint: deviceFingerprint?.hash || this.generateFingerprint(req),
        userAgent: req.headers["user-agent"] || "unknown",
        ipAddress: this.getClientIP(req),
        sessionId: req.headers["x-session-id"] as string || `session-${Date.now()}`,
        trustScore: 0.5, // Start with neutral trust
        verified: false,
        lastVerification: 0,
        verificationCount: 0,
      };
      this.deviceContexts.set(deviceId, context);
      return context;
    }

    return this.deviceContexts.get(deviceId)!;
  }

  /**
   * Get device ID from request
   */
  private getDeviceId(req: Request): string {
    // Try to get from header, cookie, or generate from IP + User-Agent
    const deviceIdHeader = req.headers["x-device-id"] as string;
    if (deviceIdHeader) {
      return deviceIdHeader;
    }

    const ip = this.getClientIP(req);
    const userAgent = req.headers["user-agent"] || "unknown";
    return `device-${this.hashString(`${ip}-${userAgent}`)}`;
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"] as string;
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
    return req.ip || req.socket.remoteAddress || "unknown";
  }

  /**
   * Generate device fingerprint from request
   */
  private generateFingerprint(req: Request): string {
    const ip = this.getClientIP(req);
    const userAgent = req.headers["user-agent"] || "unknown";
    const acceptLanguage = req.headers["accept-language"] || "unknown";
    return this.hashString(`${ip}-${userAgent}-${acceptLanguage}`);
  }

  /**
   * Verify device fingerprint
   */
  private verifyFingerprint(context: ZeroTrustContext, fingerprint: DeviceFingerprint): boolean {
    return context.deviceFingerprint === fingerprint.hash;
  }

  /**
   * Analyze user behavior for anomalies
   */
  private analyzeBehavior(context: ZeroTrustContext, req: Request): number {
    let score = 0.5; // Start neutral

    // Check request rate (too high = suspicious)
    const requestRate = this.getRequestRate(context.deviceId);
    if (requestRate > 100) {
      score -= 0.3; // High request rate is suspicious
    } else if (requestRate < 10) {
      score += 0.1; // Low request rate is normal
    }

    // Check path patterns (admin paths = higher scrutiny)
    const path = req.path;
    if (path.includes("/admin") || path.includes("/api/key")) {
      score -= 0.2; // Admin paths require higher trust
    }

    // Check for suspicious headers
    if (req.headers["x-forwarded-for"] && !req.headers["x-real-ip"]) {
      score -= 0.1; // Potential proxy/forwarding
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Get request rate for device (requests per minute)
   */
  private getRequestRate(deviceId: string): number {
    // In production, this would track actual request rates
    // For now, return a simulated value
    return 5; // Normal rate
  }

  /**
   * Hash string (simple hash for demo, use crypto in production)
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Express middleware for zero-trust verification
   */
  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Extract device fingerprint from request
        const deviceFingerprint: DeviceFingerprint | undefined = req.headers["x-device-fingerprint"]
          ? JSON.parse(req.headers["x-device-fingerprint"] as string)
          : undefined;

        // Verify request
        const verification = await this.verifyRequest(req, deviceFingerprint);

        if (!verification.allowed) {
          res.status(403).json({
            error: "Access denied",
            reason: verification.reason,
            trustScore: verification.context?.trustScore,
          });
          return;
        }

        // Add context to request for downstream use
        (req as any).zeroTrustContext = verification.context;
        next();
      } catch (error: any) {
        console.error("[ZeroTrust] Verification error:", error);
        res.status(500).json({ error: "Verification failed" });
      }
    };
  }

  /**
   * Get device context
   */
  getContext(deviceId: string): ZeroTrustContext | undefined {
    return this.deviceContexts.get(deviceId);
  }

  /**
   * Update trust score for device
   */
  updateTrustScore(deviceId: string, delta: number): void {
    const context = this.deviceContexts.get(deviceId);
    if (context) {
      context.trustScore = Math.max(0, Math.min(1, context.trustScore + delta));
    }
  }
}

// Export singleton instance
export const zeroTrustVerifier = new ZeroTrustVerifier();

