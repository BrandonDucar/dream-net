/**
 * Zero-Trust Architecture
 * Continuous verification of all requests (never trust, always verify)
 */
/**
 * Zero-Trust Verifier
 */
export class ZeroTrustVerifier {
    deviceContexts = new Map();
    verificationInterval = 300000; // 5 minutes
    trustScoreThreshold = 0.7; // Minimum trust score to allow access
    /**
     * Verify request using zero-trust principles
     */
    async verifyRequest(req, deviceFingerprint) {
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
    getOrCreateContext(deviceId, req, deviceFingerprint) {
        if (!this.deviceContexts.has(deviceId)) {
            const context = {
                deviceId,
                deviceFingerprint: deviceFingerprint?.hash || this.generateFingerprint(req),
                userAgent: req.headers["user-agent"] || "unknown",
                ipAddress: this.getClientIP(req),
                sessionId: req.headers["x-session-id"] || `session-${Date.now()}`,
                trustScore: 0.5, // Start with neutral trust
                verified: false,
                lastVerification: 0,
                verificationCount: 0,
            };
            this.deviceContexts.set(deviceId, context);
            return context;
        }
        return this.deviceContexts.get(deviceId);
    }
    /**
     * Get device ID from request
     */
    getDeviceId(req) {
        // Try to get from header, cookie, or generate from IP + User-Agent
        const deviceIdHeader = req.headers["x-device-id"];
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
    getClientIP(req) {
        const forwarded = req.headers["x-forwarded-for"];
        if (forwarded) {
            return forwarded.split(",")[0].trim();
        }
        return req.ip || req.socket.remoteAddress || "unknown";
    }
    /**
     * Generate device fingerprint from request
     */
    generateFingerprint(req) {
        const ip = this.getClientIP(req);
        const userAgent = req.headers["user-agent"] || "unknown";
        const acceptLanguage = req.headers["accept-language"] || "unknown";
        return this.hashString(`${ip}-${userAgent}-${acceptLanguage}`);
    }
    /**
     * Verify device fingerprint
     */
    verifyFingerprint(context, fingerprint) {
        return context.deviceFingerprint === fingerprint.hash;
    }
    /**
     * Analyze user behavior for anomalies
     */
    analyzeBehavior(context, req) {
        let score = 0.5; // Start neutral
        // Check request rate (too high = suspicious)
        const requestRate = this.getRequestRate(context.deviceId);
        if (requestRate > 100) {
            score -= 0.3; // High request rate is suspicious
        }
        else if (requestRate < 10) {
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
    getRequestRate(deviceId) {
        // In production, this would track actual request rates
        // For now, return a simulated value
        return 5; // Normal rate
    }
    /**
     * Hash string (simple hash for demo, use crypto in production)
     */
    hashString(str) {
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
        return async (req, res, next) => {
            try {
                // Extract device fingerprint from request
                const deviceFingerprint = req.headers["x-device-fingerprint"]
                    ? JSON.parse(req.headers["x-device-fingerprint"])
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
                req.zeroTrustContext = verification.context;
                next();
            }
            catch (error) {
                console.error("[ZeroTrust] Verification error:", error);
                res.status(500).json({ error: "Verification failed" });
            }
        };
    }
    /**
     * Get device context
     */
    getContext(deviceId) {
        return this.deviceContexts.get(deviceId);
    }
    /**
     * Update trust score for device
     */
    updateTrustScore(deviceId, delta) {
        const context = this.deviceContexts.get(deviceId);
        if (context) {
            context.trustScore = Math.max(0, Math.min(1, context.trustScore + delta));
        }
    }
}
// Export singleton instance
export const zeroTrustVerifier = new ZeroTrustVerifier();
