import axios from 'axios';

export type GeoRegion = 'NA' | 'EU' | 'APAC' | 'LATAM' | 'MEA' | 'GLOBAL';

/**
 * GeofenceService: Local parity for regional mission locking and node routing.
 * Leverages IP-based geolocation.
 */
export class GeofenceService {
    private nodeRegions: Record<string, GeoRegion> = {
        'ALPHA': 'NA',
        'BRAVO': 'EU',
        'CHARLIE': 'APAC',
        'DELTA': 'GLOBAL'
    };

    /**
     * detectRegion
     * Detects region from IP. Returns 'GLOBAL' on fail.
     */
    async detectRegion(ip: string): Promise<GeoRegion> {
        if (ip === '127.0.0.1' || ip === '::1') return 'NA'; // Mock for local dev

        try {
            const response = await axios.get(`http://ip-api.com/json/${ip}`);
            const countryCode = response.data.countryCode;

            if (['US', 'CA', 'MX'].includes(countryCode)) return 'NA';
            if (['GB', 'FR', 'DE', 'IT', 'ES', 'NL'].includes(countryCode)) return 'EU';
            if (['JP', 'CN', 'KR', 'IN', 'AU', 'SG'].includes(countryCode)) return 'APAC';
            if (['BR', 'AR', 'CL', 'CO'].includes(countryCode)) return 'LATAM';
            if (['UAE', 'SA', 'IL', 'ZA'].includes(countryCode)) return 'MEA';

            return 'GLOBAL';
        } catch (e) {
            console.error(`[GeofenceService] Region detection failed:`, e);
            return 'GLOBAL';
        }
    }

    /**
     * getNearestNode
     * Routes to the nearest Optio node based on detected region.
     */
    getNearestNode(region: GeoRegion): string {
        for (const [nodeId, nodeRegion] of Object.entries(this.nodeRegions)) {
            if (nodeRegion === region) return nodeId;
        }
        return 'DELTA'; // Fallback to Global node
    }

    /**
     * isMissionEligible
     * Checks if an agent in a region is eligible for a locked mission.
     */
    isMissionEligible(agentRegion: GeoRegion, missionRegion: GeoRegion): boolean {
        if (missionRegion === 'GLOBAL') return true;
        return agentRegion === missionRegion;
    }
}

export const geofenceService = new GeofenceService();
