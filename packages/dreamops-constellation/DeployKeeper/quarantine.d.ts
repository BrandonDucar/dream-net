/**
 * Quarantine System
 *
 * Implements quarantine/containment for isolating affected services
 * Based on immune system's quarantine mechanism
 */
import type DreamMemory from "../DreamMemory/index.js";
export interface QuarantineRecord {
    id: string;
    service: string;
    reason: string;
    anomalyId: string;
    quarantinedAt: string;
    releasedAt?: string;
    status: "active" | "released" | "failed";
    verificationPeriod: number;
    metadata?: Record<string, any>;
}
export declare class QuarantineSystem {
    private dreamMemory;
    private quarantines;
    private readonly DEFAULT_VERIFICATION_PERIOD;
    constructor(dreamMemory: DreamMemory);
    /**
     * Quarantine a service
     */
    quarantine(service: string, reason: string, anomalyId: string, verificationPeriod?: number): Promise<QuarantineRecord>;
    /**
     * Release a service from quarantine
     */
    release(service: string, verified?: boolean): Promise<boolean>;
    /**
     * Check if service should be auto-released (after verification period)
     */
    checkAutoRelease(): Promise<void>;
    /**
     * Get quarantine record for a service
     */
    getQuarantine(service: string): Promise<QuarantineRecord | undefined>;
    /**
     * Check if a service is quarantined
     */
    isQuarantined(service: string): Promise<boolean>;
    /**
     * Get all active quarantines
     */
    getActiveQuarantines(): QuarantineRecord[];
    /**
     * Route traffic away from quarantined service
     */
    private routeTrafficAway;
    /**
     * Restore traffic routing for released service
     */
    private restoreTrafficRouting;
    /**
     * Isolate service in staging environment for analysis
     */
    private isolateInStaging;
}
export default QuarantineSystem;
