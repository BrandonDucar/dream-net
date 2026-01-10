/**
 * Rate Limiter Middleware
 * 
 * Simple in-memory rate limiter
 * In production, this should use Redis or similar
 */

interface RateLimitClient {
  requests: number;
  resetAt: number;
}

class RateLimitManager {
  private clients = new Map<string, RateLimitClient>();
  private readonly WINDOW_MS = 60 * 1000; // 1 minute
  private readonly MAX_REQUESTS = 100; // per window

  getClient(clientId: string): RateLimitClient {
    const existing = this.clients.get(clientId);
    const now = Date.now();

    if (!existing || now >= existing.resetAt) {
      const newClient: RateLimitClient = {
        requests: 0,
        resetAt: now + this.WINDOW_MS,
      };
      this.clients.set(clientId, newClient);
      return newClient;
    }

    return existing;
  }

  checkLimit(clientId: string): { allowed: boolean; remaining: number } {
    const client = this.getClient(clientId);
    const allowed = client.requests < this.MAX_REQUESTS;
    
    if (allowed) {
      client.requests++;
    }

    return {
      allowed,
      remaining: Math.max(0, this.MAX_REQUESTS - client.requests),
    };
  }

  async getStats(): Promise<{ active_clients: number; status: string }> {
    const now = Date.now();
    // Clean up expired clients
    for (const [id, client] of this.clients.entries()) {
      if (now >= client.resetAt) {
        this.clients.delete(id);
      }
    }
    return {
      active_clients: this.clients.size,
      status: 'operational',
    };
  }
}

export const rateLimitManager = new RateLimitManager();

