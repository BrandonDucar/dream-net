/**
 * @dreamnet/internal-router
 *
 * Laser Router - High-speed packet routing system for DreamNet
 *
 * Routes packets to ports based on fiber channels and packet types.
 */
export type { RouteKey, RouteTarget, RouteEntry, RouterConfig, RouteResult } from './types';
export { configureRouter, getRouterConfig, registerRoute, unregisterRoute, getRoute, listRoutes, hasRoute, routePacket, clearRoutes } from './router';
export { incrementRouteCount, getRouteStats, getRouteCount, resetMetrics } from './metrics';
