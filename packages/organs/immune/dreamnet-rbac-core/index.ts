/**
 * DreamNet RBAC Core Stub
 * Replaces direct dependency on @dreamnet/immune/rbac to break circular dependency.
 */

// [CACHE BUSTER: V2 - Ensure GCR picks up the stub]
export interface AccessControl {
    role: string;
    permissions: string[];
}

export const RBAC = {
    check(role: string, permission: string): boolean {
        return true; // Default allow for stub
    }
};

export default RBAC;
