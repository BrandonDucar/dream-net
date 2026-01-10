/**
 * DreamNet Identity Layer v1
 *
 * Phase 1.5: Identity Mapping Contract
 *
 * This module defines the contract between authentication providers
 * (passkey-based) and DreamNet's IdentityGrid system.
 *
 * Key concepts:
 * - authUserId: Stable ID from auth provider (e.g., "user_abc123")
 * - identityId: DreamNet IdentityGrid node ID (e.g., "user:abc123")
 * - DreamNetRequestContext: Request-scoped identity context
 */
/**
 * Request context that flows through all DreamNet subsystems.
 *
 * This is populated from the auth provider's session and used
 * to identify the calling user across all subsystems.
 */
export interface DreamNetRequestContext {
    /**
     * Stable user ID from the auth provider (e.g., Clerk, Auth.js).
     * Example: "user_abc123" or "clerk_xyz789"
     */
    authUserId: string;
    /**
     * DreamNet IdentityGrid node ID derived from authUserId.
     * Format: "user:{sanitizedAuthUserId}"
     * Example: "user:abc123"
     */
    identityId: string;
    /**
     * Optional: Display name from auth provider
     */
    displayName?: string;
    /**
     * Optional: Email from auth provider
     */
    email?: string;
    /**
     * Optional: User roles/permissions (for future use)
     */
    roles?: string[];
    /**
     * Optional: Metadata from auth provider
     */
    meta?: Record<string, any>;
}
/**
 * Convert auth provider user ID to DreamNet identity ID.
 *
 * This is the canonical mapping function used everywhere.
 *
 * @param authUserId - User ID from auth provider
 * @returns DreamNet IdentityGrid node ID
 *
 * @example
 * authUserIdToIdentityId("user_abc123") // "user:abc123"
 * authUserIdToIdentityId("clerk_xyz789") // "user:clerk_xyz789"
 */
export declare function authUserIdToIdentityId(authUserId: string): string;
/**
 * Ensure a user identity exists in IdentityGrid.
 *
 * Called on first login or when identity needs to be created.
 *
 * @param authUserId - User ID from auth provider
 * @param displayName - Optional display name
 * @param email - Optional email
 * @returns The created or existing IdentityGrid node
 */
export declare function ensureUserIdentity(authUserId: string, displayName?: string, email?: string): any;
/**
 * Link an identity to an agent (ownership/control relationship).
 *
 * Used for agent ownership, permissions, and delegation.
 *
 * @param identityId - DreamNet identity ID
 * @param agentId - Agent ID (e.g., "agent:WolfPackFunding")
 * @param linkType - Type of relationship (default: "controls")
 * @returns The created edge
 */
export declare function linkIdentityToAgent(identityId: string, agentId: string, linkType?: "controls" | "owns"): any;
/**
 * Get all agents controlled by an identity.
 *
 * @param identityId - DreamNet identity ID
 * @returns Array of agent IDs
 */
export declare function getIdentityAgents(identityId: string): string[];
/**
 * Check if an identity controls a specific agent.
 *
 * @param identityId - DreamNet identity ID
 * @param agentId - Agent ID to check
 * @returns True if identity controls the agent
 */
export declare function identityControlsAgent(identityId: string, agentId: string): boolean;
/**
 * Create a DreamNetRequestContext from auth provider data.
 *
 * This is the main entry point for creating request context
 * after authentication.
 *
 * @param authUserId - User ID from auth provider
 * @param displayName - Optional display name
 * @param email - Optional email
 * @param meta - Optional metadata
 * @returns DreamNetRequestContext
 */
export declare function createDreamNetContext(authUserId: string, displayName?: string, email?: string, meta?: Record<string, any>): DreamNetRequestContext;
/**
 * Extract identity from request context (for use in subsystems).
 *
 * Helper to safely extract identityId from context.
 *
 * @param ctx - DreamNetRequestContext (may be undefined)
 * @returns identityId or undefined
 */
export declare function getIdentityFromContext(ctx?: DreamNetRequestContext): string | undefined;
/**
 * Validate that a request context has required identity fields.
 *
 * @param ctx - DreamNetRequestContext to validate
 * @returns True if context is valid
 */
export declare function isValidDreamNetContext(ctx: any): ctx is DreamNetRequestContext;
