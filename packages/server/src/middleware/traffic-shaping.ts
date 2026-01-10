/**
 * Traffic Shaping Middleware
 * Handles gradual rollouts and feature flags using core logic
 */

import { Request, Response, NextFunction } from 'express';
import { shouldRouteToNewVersion, recordRequestMetrics } from '../core/traffic-shaping';

export const trafficShapingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Use request path as feature name for rollout (e.g., "/api/agent/123" -> "api-agent")
    // This allows granular control per route group
    const featureName = req.path.split('/').slice(1, 3).join('-');
    const userId = (req as any).user?.id || req.ip || 'anonymous';
    const startTime = Date.now();

    // Check if should route to new version (or allow access in this context)
    if (!shouldRouteToNewVersion(featureName, userId)) {
        // Return 503 Service Unavailable as per requirements
        return res.status(503).json({
            error: 'Service Unavailable',
            message: 'Traffic shaping active - request shed'
        });
    }

    // Track metrics on response finish
    res.on('finish', () => {
        const latency = Date.now() - startTime;
        const success = res.statusCode < 400;
        recordRequestMetrics(featureName, success, latency);
    });

    next();
};

export { updateRollout } from '../core/traffic-shaping';
