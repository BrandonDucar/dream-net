/**
 * @dreamnet/dreamnet-rbac-core — Role-Based Access Control
 * 
 * Manages roles, permissions, and access policies for all agents.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'rbac',
  name: 'DreamNet RBAC',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['roles', 'permissions', 'access-policies', 'audit'],
  metadata: { organ: 'immune', role: 'access-control' },
});

export type Permission = 'read' | 'write' | 'execute' | 'admin' | 'sovereign';
export interface Role { name: string; permissions: Permission[]; inherits?: string[]; }

const roles: Map<string, Role> = new Map([
  ['viewer', { name: 'viewer', permissions: ['read'] }],
  ['operator', { name: 'operator', permissions: ['read', 'write', 'execute'] }],
  ['admin', { name: 'admin', permissions: ['read', 'write', 'execute', 'admin'] }],
  ['sovereign', { name: 'sovereign', permissions: ['read', 'write', 'execute', 'admin', 'sovereign'] }],
]);

const agentRoles: Map<string, string[]> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function assignRole(agentId: string, roleName: string): void {
  if (!agentRoles.has(agentId)) agentRoles.set(agentId, []);
  const r = agentRoles.get(agentId)!;
  if (!r.includes(roleName)) r.push(roleName);
}

export function hasPermission(agentId: string, permission: Permission): boolean {
  const agentR = agentRoles.get(agentId) || ['viewer'];
  return agentR.some(rn => {
    const role = roles.get(rn);
    return role?.permissions.includes(permission) || false;
  });
}

export function getRoles(agentId: string): string[] { return agentRoles.get(agentId) || []; }
export function defineRole(role: Role): void { roles.set(role.name, role); }

export { bridge };
export default { connect, assignRole, hasPermission, getRoles, defineRole, bridge };
