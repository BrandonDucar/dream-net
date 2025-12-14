/**
 * Traffic Shaping Middleware
 * 
 * Express middleware for gradual traffic rollout and SLO monitoring.
 * Uses server/core/traffic-shaping.ts for core logic.
 */

import { Request, Response, NextFunction } from 'express';
import { shouldRouteToNewVersion, recordRequestMetrics } from '../core/traffic-shaping';

/**
 * Configuration for traffic shaping per route
 */
interface RouteConfig {
  rolloutName: string;
  enabled: boolean;
}

/**
 * Get rollout name for a route
 * Defaults to route path, but can be overridden per route
 */
function getRolloutName(req: Request): string {
  // Use route-specific config if available
  const routeConfig = (req as any).trafficShapingConfig as RouteConfig | undefined;
  if (routeConfig?.rolloutName) {
    return routeConfig.rolloutName;
  }
  
  // Default to route path
  return req.path || req.route?.path || 'default';
}

/**
 * Traffic shaping middleware
 * 
 * Checks if request should be routed to new version based on rollout percentage.
 * Records metrics for SLO monitoring and auto-rollback.
 */
export function trafficShapingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const rolloutName = getRolloutName(req);
  const startTime = Date.now();
  
  // Check if should route to new version
  if (!shouldRouteToNewVersion(rolloutName)) {
    // Route to old version (or return 503)
    res.status(503).json({
      error: 'Service in gradual rollout',
      message: 'This endpoint is currently rolling out. Please retry in a moment.',
      rolloutName,
    });
    return;
  }
  
  // Track metrics on response finish
  res.on('finish', () => {
    const latency = Date.now() - startTime;
    const success = res.statusCode < 400;
    recordRequestMetrics(rolloutName, success, latency);
  });
  
  next();
}

/**
 * Optional: Per-route traffic shaping config
 * Use this to set rollout name for specific routes
 */
export function withTrafficShaping(config: RouteConfig) {
  return (req: Request, _res: Response, next: NextFunction) => {
    (req as any).trafficShapingConfig = config;
    next();
  };
}

