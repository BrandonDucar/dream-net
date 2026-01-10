import { GuardrailRule, GuardrailContext } from '../types.js';

/**
 * Rate Limit Store
 * 
 * In-memory store for rate limiting. In production, use Redis.
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate Limiting Guardrail
 * 
 * Prevents agent execution if user exceeds rate limit.
 * This is a BLOCKING rule that runs before agent execution.
 */
export const RateLimitRule: GuardrailRule = {
    id: 'rate-limit',
    name: 'Rate Limiting',
    type: 'input',
    blocking: true,
    priority: 2, // Second highest priority

    check: async (context: GuardrailContext) => {
        const key = `rate:${context.identityId}:${context.agentId}`;
        const now = Date.now();
        const windowMs = 60000; // 1 minute window
        const maxRequests = 10; // 10 requests per minute

        // Get or create rate limit entry
        let entry = rateLimitStore.get(key);

        if (!entry || now > entry.resetAt) {
            // Create new window
            entry = { count: 0, resetAt: now + windowMs };
            rateLimitStore.set(key, entry);
        }

        // Increment count
        entry.count++;

        // Check if over limit
        if (entry.count > maxRequests) {
            const resetIn = Math.ceil((entry.resetAt - now) / 1000);

            return {
                allowed: false,
                reason: 'Rate limit exceeded',
                metadata: {
                    limit: maxRequests,
                    current: entry.count,
                    resetIn,
                    window: 'per minute'
                }
            };
        }

        return {
            allowed: true,
            metadata: {
                limit: maxRequests,
                current: entry.count,
                remaining: maxRequests - entry.count
            }
        };
    }
};

/**
 * Cleanup old rate limit entries periodically
 */
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetAt + 60000) { // 1 minute after reset
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Run every minute
