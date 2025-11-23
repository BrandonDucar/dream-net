/**
 * RBAC Store
 * Stores role definitions and user roles
 */
class RBACStore {
    roles = new Map();
    userRoles = new Map();
    constructor() {
        this.initializeDefaultRoles();
    }
    initializeDefaultRoles() {
        // Admin role - full access
        this.roles.set("admin", {
            id: "admin",
            name: "Administrator",
            permissions: [
                "kill_switch:enable",
                "kill_switch:disable",
                "rate_limit:create",
                "rate_limit:update",
                "rate_limit:delete",
                "circuit_breaker:trip",
                "circuit_breaker:reset",
                "cluster:enable",
                "cluster:disable",
                "billable:view",
                "billable:charge",
                "audit:view",
                "audit:export",
                "config:view",
                "config:update",
            ],
            clusterScoped: false,
        });
        // Operator role - operational access
        this.roles.set("operator", {
            id: "operator",
            name: "Operator",
            permissions: [
                "rate_limit:update",
                "circuit_breaker:reset",
                "cluster:enable",
                "cluster:disable",
                "billable:view",
                "audit:view",
                "config:view",
            ],
            clusterScoped: true,
        });
        // Viewer role - read-only access
        this.roles.set("viewer", {
            id: "viewer",
            name: "Viewer",
            permissions: [
                "billable:view",
                "audit:view",
                "config:view",
            ],
            clusterScoped: false,
        });
    }
    defineRole(role) {
        this.roles.set(role.id, role);
    }
    getRole(roleId) {
        return this.roles.get(roleId);
    }
    getAllRoles() {
        return Array.from(this.roles.values());
    }
    assignRole(userId, roleId, clusterId, grantedBy = "system") {
        const existing = this.userRoles.get(userId) || [];
        // Remove existing role for this cluster if any
        const filtered = existing.filter((ur) => !(ur.roleId === roleId && ur.clusterId === clusterId));
        filtered.push({
            userId,
            roleId,
            clusterId,
            grantedAt: Date.now(),
            grantedBy,
        });
        this.userRoles.set(userId, filtered);
    }
    getUserRoles(userId) {
        return this.userRoles.get(userId) || [];
    }
    checkPermission(check) {
        const userRoles = this.getUserRoles(check.userId);
        for (const userRole of userRoles) {
            const role = this.getRole(userRole.roleId);
            if (!role)
                continue;
            // Check if role applies to this cluster
            if (role.clusterScoped && userRole.clusterId) {
                if (check.clusterId && check.clusterId !== userRole.clusterId) {
                    continue; // Role doesn't apply to this cluster
                }
            }
            // Check if role has the permission
            if (role.permissions.includes(check.permission)) {
                return true;
            }
        }
        return false;
    }
    revokeRole(userId, roleId, clusterId) {
        const existing = this.userRoles.get(userId) || [];
        const filtered = existing.filter((ur) => !(ur.roleId === roleId && ur.clusterId === clusterId));
        this.userRoles.set(userId, filtered);
    }
}
export const rbacStore = new RBACStore();
