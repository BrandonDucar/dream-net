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

// Identity Grid is optional - handle missing package gracefully
let IdentityGrid: any = null;
let IdentityNode: any = null;
let IdentityEdge: any = null;
try {
  const identityModule = require("@dreamnet/identity-grid");
  IdentityGrid = identityModule.IdentityGrid;
  IdentityNode = identityModule.IdentityNode;
  IdentityEdge = identityModule.IdentityEdge;
} catch {
  // Identity Grid not available - functions will check for null
}

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
export function authUserIdToIdentityId(authUserId: string): string {
  // Remove common prefixes and sanitize
  const sanitized = authUserId
    .replace(/^(user_|clerk_|auth_)/i, "") // Remove common prefixes
    .replace(/[^a-zA-Z0-9_-]/g, "_"); // Sanitize to safe characters

  return `user:${sanitized}`;
}

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
export function ensureUserIdentity(
  authUserId: string,
  displayName?: string,
  email?: string
): any {
  const identityId = authUserIdToIdentityId(authUserId);

  // Check if node already exists
  if (!IdentityGrid) return { id: identityId, type: "user", label: displayName || authUserId }; // Identity Grid not available
  const existing = IdentityGrid.listNodes().find((n: any) => n.id === identityId);
  if (existing) {
    return existing;
  }

  // Create new identity node
  if (!IdentityGrid) return identityId; // Identity Grid not available
  const node = IdentityGrid.upsertNode({
    id: identityId,
    type: "user",
    label: displayName || `User ${authUserId.slice(0, 8)}`,
    tags: ["human", "authenticated"],
    meta: {
      authUserId,
      email,
      createdAt: Date.now(),
    },
  });

  return node;
}

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
export function linkIdentityToAgent(
  identityId: string,
  agentId: string,
  linkType: "controls" | "owns" = "controls"
): any {
  const edgeId = `edge:${identityId}:${agentId}`;

  // Check if edge already exists
  if (!IdentityGrid) return { id: edgeId, fromId: identityId, toId: agentId, linkType }; // Identity Grid not available
  const existing = IdentityGrid.listEdges().find((e: any) => e.id === edgeId);
  if (existing) {
    return existing;
  }

  // Create ownership/control edge
  const edge: any = {
    id: edgeId,
    fromId: identityId,
    toId: agentId,
    linkType,
    createdAt: Date.now(),
    meta: {
      grantedAt: Date.now(),
    },
  };

  if (!IdentityGrid) return; // Identity Grid not available
  IdentityGrid.addEdge(edge);
  return edge;
}

/**
 * Get all agents controlled by an identity.
 * 
 * @param identityId - DreamNet identity ID
 * @returns Array of agent IDs
 */
export function getIdentityAgents(identityId: string): string[] {
  if (!IdentityGrid) return []; // Identity Grid not available
  const edges = IdentityGrid.listEdges().filter(
    (e) =>
      e.fromId === identityId &&
      (e.linkType === "controls" || e.linkType === "owns") &&
      e.toId.startsWith("agent:")
  );

  return edges.map((e) => e.toId);
}

/**
 * Check if an identity controls a specific agent.
 * 
 * @param identityId - DreamNet identity ID
 * @param agentId - Agent ID to check
 * @returns True if identity controls the agent
 */
export function identityControlsAgent(
  identityId: string,
  agentId: string
): boolean {
  if (!IdentityGrid) return false; // Identity Grid not available
  const edges = IdentityGrid.listEdges();
  return edges.some(
    (e) =>
      e.fromId === identityId &&
      e.toId === agentId &&
      (e.linkType === "controls" || e.linkType === "owns")
  );
}

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
export function createDreamNetContext(
  authUserId: string,
  displayName?: string,
  email?: string,
  meta?: Record<string, any>
): DreamNetRequestContext {
  const identityId = authUserIdToIdentityId(authUserId);

  // Ensure identity exists in IdentityGrid
  ensureUserIdentity(authUserId, displayName, email);

  return {
    authUserId,
    identityId,
    displayName,
    email,
    meta,
  };
}

/**
 * Extract identity from request context (for use in subsystems).
 * 
 * Helper to safely extract identityId from context.
 * 
 * @param ctx - DreamNetRequestContext (may be undefined)
 * @returns identityId or undefined
 */
export function getIdentityFromContext(
  ctx?: DreamNetRequestContext
): string | undefined {
  return ctx?.identityId;
}

/**
 * Validate that a request context has required identity fields.
 * 
 * @param ctx - DreamNetRequestContext to validate
 * @returns True if context is valid
 */
export function isValidDreamNetContext(
  ctx: any
): ctx is DreamNetRequestContext {
  return (
    ctx &&
    typeof ctx.authUserId === "string" &&
    typeof ctx.identityId === "string" &&
    ctx.identityId.startsWith("user:")
  );
}

