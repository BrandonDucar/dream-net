/**
 * DreamNet Geofencing Core
 *
 * IP-based location detection
 * Region-specific content (headlines, CTAs, palettes, emojis, hashtags)
 * Tiered region mapping (Global, Country, City clusters)
 */
export interface RegionContent {
    headline_local: string;
    subhead_local?: string;
    cta_local: string;
    accent_palette: string[];
    emoji_pack?: string[];
    hashtag_pack?: string[];
    broll_pack?: string[];
}
export interface RegionConfig {
    tier: 0 | 1 | 2;
    region: string;
    content: RegionContent;
}
export declare class GeofencingCore {
    private regions;
    constructor();
    private initializeRegions;
    /**
     * Detect region from IP address
     */
    detectRegion(ipAddress?: string): Promise<string>;
    /**
     * Get region content for a location
     */
    getRegionContent(region: string): RegionContent;
    /**
     * Get content for detected region
     */
    getContentForIP(ipAddress?: string): Promise<RegionContent>;
    /**
     * Add or update region content
     */
    setRegionContent(region: string, tier: 0 | 1 | 2, content: RegionContent): void;
    /**
     * Get all regions
     */
    getAllRegions(): RegionConfig[];
}
export default GeofencingCore;
