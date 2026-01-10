/**
 * Geo Awareness - Layer 3
 * Adds local or event-based personalization
 */
import type { GeoContext } from '../types';
export declare class GeoAwareness {
    /**
     * Get geo context for recipient
     */
    getGeoContext(email: string, name?: string, company?: string): Promise<GeoContext>;
    /**
     * Detect location from email/company
     */
    private detectLocation;
    /**
     * Detect timezone from location
     */
    private detectTimezone;
    /**
     * Find local events
     */
    private findLocalEvents;
    /**
     * Get cultural context
     */
    private getCulturalContext;
    /**
     * Calculate optimal send time based on timezone
     */
    private calculateOptimalSendTime;
}
export declare const geoAwareness: GeoAwareness;
