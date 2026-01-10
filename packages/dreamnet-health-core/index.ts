/**
 * DreamNet Health Core Stub
 * Replaces direct dependency on @dreamnet/immune/health to break circular dependency.
 */

export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'down';
    timestamp: number;
    components: Record<string, any>;
}

export const Health = {
    check(): HealthStatus {
        return {
            status: 'healthy',
            timestamp: Date.now(),
            components: {},
        };
    }
};

export default Health;
