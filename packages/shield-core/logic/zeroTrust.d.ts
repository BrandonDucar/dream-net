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
    trustScore: number;
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
    hash: string;
}
/**
 * Zero-Trust Verifier
 */
export declare class ZeroTrustVerifier {
    private deviceContexts;
    private verificationInterval;
    private trustScoreThreshold;
    /**
     * Verify request using zero-trust principles
     */
    verifyRequest(req: Request, deviceFingerprint?: DeviceFingerprint): Promise<{
        allowed: boolean;
        context?: ZeroTrustContext;
        reason?: string;
    }>;
    /**
     * Get or create device context
     */
    private getOrCreateContext;
    /**
     * Get device ID from request
     */
    private getDeviceId;
    /**
     * Get client IP address
     */
    private getClientIP;
    /**
     * Generate device fingerprint from request
     */
    private generateFingerprint;
    /**
     * Verify device fingerprint
     */
    private verifyFingerprint;
    /**
     * Analyze user behavior for anomalies
     */
    private analyzeBehavior;
    /**
     * Get request rate for device (requests per minute)
     */
    private getRequestRate;
    /**
     * Hash string (simple hash for demo, use crypto in production)
     */
    private hashString;
    /**
     * Express middleware for zero-trust verification
     */
    middleware(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get device context
     */
    getContext(deviceId: string): ZeroTrustContext | undefined;
    /**
     * Update trust score for device
     */
    updateTrustScore(deviceId: string, delta: number): void;
}
export declare const zeroTrustVerifier: ZeroTrustVerifier;
