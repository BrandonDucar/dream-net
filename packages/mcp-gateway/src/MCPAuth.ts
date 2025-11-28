/**
 * MCP Auth - Authentication and authorization for MCP tools
 * 
 * Provides access control and authentication for MCP tool invocations.
 */

export interface AuthContext {
  userId?: string;
  apiKey?: string;
  permissions?: string[];
}

export interface AuthResult {
  allowed: boolean;
  reason?: string;
}

/**
 * MCP Auth - Manages authentication and authorization
 */
export class MCPAuth {
  private apiKeys: Map<string, AuthContext> = new Map();
  private toolPermissions: Map<string, string[]> = new Map();

  /**
   * Register an API key
   */
  registerApiKey(key: string, context: AuthContext): void {
    this.apiKeys.set(key, context);
  }

  /**
   * Set required permissions for a tool
   */
  setToolPermissions(toolName: string, permissions: string[]): void {
    this.toolPermissions.set(toolName, permissions);
  }

  /**
   * Authenticate a request
   */
  authenticate(context: AuthContext): AuthResult {
    if (context.apiKey) {
      const registered = this.apiKeys.get(context.apiKey);
      if (!registered) {
        return { allowed: false, reason: 'Invalid API key' };
      }
      return { allowed: true };
    }

    if (context.userId) {
      // User-based auth - stub for now
      return { allowed: true };
    }

    return { allowed: false, reason: 'No authentication provided' };
  }

  /**
   * Authorize tool access
   */
  authorize(toolName: string, context: AuthContext): AuthResult {
    const authResult = this.authenticate(context);
    if (!authResult.allowed) {
      return authResult;
    }

    const requiredPermissions = this.toolPermissions.get(toolName);
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return { allowed: true };
    }

    const userPermissions = context.permissions || [];
    const hasPermission = requiredPermissions.some(p => userPermissions.includes(p));

    if (!hasPermission) {
      return { allowed: false, reason: `Missing required permissions: ${requiredPermissions.join(', ')}` };
    }

    return { allowed: true };
  }
}

