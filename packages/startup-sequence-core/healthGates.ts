/**
 * Health Gates
 * 
 * Liveness and readiness checks for services
 */

import type { ServiceNode, LivenessCheck, ReadinessCheck } from './types';

/**
 * Check liveness (service is running)
 */
export async function checkLiveness(
  service: ServiceNode
): Promise<boolean> {
  const check = service.healthCheck.liveness;
  
  switch (check.type) {
    case 'http':
      return await httpHealthCheck(check.endpoint!, check.timeout);
      
    case 'tcp':
      return await tcpHealthCheck(check.port!, check.timeout);
      
    case 'process':
      return await processHealthCheck(service.id);
      
    case 'custom':
      // Custom check would be defined in service definition
      return true;
      
    default:
      return false;
  }
}

/**
 * Check readiness (service can accept traffic)
 */
export async function checkReadiness(
  service: ServiceNode
): Promise<boolean> {
  const checks = service.healthCheck.readiness.checks;
  const results = await Promise.all(checks.map(c => c.check()));
  
  if (service.healthCheck.readiness.allRequired) {
    return results.every(r => r === true);
  } else {
    return results.some(r => r === true);
  }
}

/**
 * HTTP health check
 */
async function httpHealthCheck(endpoint: string, timeout: number): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(endpoint, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * TCP health check
 */
async function tcpHealthCheck(port: number, timeout: number): Promise<boolean> {
  // TODO: Implement TCP health check
  // For now, assume port is open if service is registered
  return true;
}

/**
 * Process health check
 */
async function processHealthCheck(serviceId: string): Promise<boolean> {
  // TODO: Check if process is running
  // For now, assume process is healthy if service is registered
  return true;
}

/**
 * Check if all dependencies are healthy
 */
export async function checkDependencies(
  service: ServiceNode,
  healthScores: Record<string, number>
): Promise<boolean> {
  for (const depId of service.dependencies) {
    const healthScore = healthScores[depId];
    if (healthScore === undefined || healthScore < 50) {
      return false;
    }
  }
  return true;
}

