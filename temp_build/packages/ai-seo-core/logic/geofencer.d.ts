import { Geofence, GeofenceRule } from "../types";
/**
 * Create a geofence
 */
export declare function createGeofence(name: string, type: Geofence["type"], options: {
    coordinates?: {
        lat: number;
        lng: number;
        radius?: number;
    };
    countries?: string[];
    regions?: string[];
    cities?: string[];
    priority?: number;
}): Geofence;
/**
 * Check if location matches geofence
 */
export declare function checkGeofence(location: {
    country?: string;
    region?: string;
    city?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}): Geofence[];
/**
 * Apply geofence rules to content
 */
export declare function applyGeofenceRules(geofenceIds: string[], contentType?: string, platform?: string): GeofenceRule[];
/**
 * Create geofence rule
 */
export declare function createGeofenceRule(geofenceId: string, action: "allow" | "block" | "redirect" | "customize", options?: {
    contentType?: string;
    platform?: string;
    customizations?: Record<string, any>;
}): GeofenceRule;
/**
 * Ensure default geofences
 */
export declare function ensureDefaultGeofences(): Geofence[];
