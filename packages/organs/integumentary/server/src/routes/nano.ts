import type { Express } from "express";
import { z } from "zod";
// import { createModelProvider } from "@dreamnet/shared/model-registry/index";
const createModelProvider = (name?: string) => ({
  name: name || 'mock',
  generate: async (prompt: string, params: any) => ({ url: "https://placeholder.com/image.png" })
});
import { isAuthenticated } from "../replitAuth";
import { db } from "../db";
import { nanoJobs, nanoRateLimits, users } from "@dreamnet/shared/schema";
import { eq, and, gte, desc, count } from "drizzle-orm";

// Environment configuration
const NANO_MAX_HOURLY = parseInt(process.env.NANO_MAX_HOURLY || '12');
const NANO_MAX_CONCURRENCY = parseInt(process.env.NANO_MAX_CONCURRENCY || '2');
const NANO_HARD_FAIL = process.env.NANO_HARD_FAIL === 'true';
const NANO_ENABLE_PROVENANCE = process.env.NANO_ENABLE_PROVENANCE !== 'false';

// In-memory concurrency tracking
const userConcurrency = new Map<string, number>();

// Sweet Spot throttling state
interface ThrottleState {
  p95Latency: number;
  lastThrottleTime: number;
  throttledCalls: number;
  recentLatencies: number[];
}

const throttleState: ThrottleState = {
  p95Latency: 0,
  lastThrottleTime: 0,
  throttledCalls: 0,
  recentLatencies: []
};

// Request validation schemas
const generateRequestSchema = z.object({
  prompt: z.string().min(1).max(1000),
  mode: z.enum(['text2img', 'img2img', 'edit']).default('text2img'),
  seed: z.number().int().positive().optional(),
  guidance: z.number().min(1).max(20).optional(),
  steps: z.number().int().min(10).max(100).optional(),
  width: z.number().int().min(256).max(1536).optional(),
  height: z.number().int().min(256).max(1536).optional(),
  preserve_subject: z.boolean().optional(),
  provenance: z.boolean().default(NANO_ENABLE_PROVENANCE),
  image_url: z.string().url().optional(), // For img2img and edit modes
});

/**
 * Check rate limits for user (12 requests per hour)
 */
async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // Count recent requests in the last hour
  const recentRequests = await db
    .select({ count: count() })
    .from(nanoJobs)
    .where(and(
      eq(nanoJobs.userId, userId),
      gte(nanoJobs.createdAt, oneHourAgo)
    ));

  const currentCount = recentRequests[0]?.count || 0;
  const remaining = Math.max(0, NANO_MAX_HOURLY - currentCount);

  return {
    allowed: currentCount < NANO_MAX_HOURLY,
    remaining
  };
}

/**
 * Check concurrency limits (max 2 inflight per user)
 */
function checkConcurrency(userId: string): { allowed: boolean; current: number } {
  const current = userConcurrency.get(userId) || 0;
  return {
    allowed: current < NANO_MAX_CONCURRENCY,
    current
  };
}

/**
 * Update p95 latency tracking for sweet spot throttling
 */
function updateLatencyTracking(latencyMs: number) {
  throttleState.recentLatencies.push(latencyMs);

  // Keep only last 20 calls
  if (throttleState.recentLatencies.length > 20) {
    throttleState.recentLatencies.shift();
  }

  // Calculate p95 latency
  if (throttleState.recentLatencies.length >= 5) {
    const sorted = [...throttleState.recentLatencies].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    throttleState.p95Latency = sorted[p95Index];
  }
}

/**
 * Check if sweet spot throttling should be applied
 */
function shouldThrottle(): { throttle: boolean; reason?: string } {
  const now = Date.now();

  // If we're in throttling period (next 10 calls after detecting high latency)
  if (throttleState.throttledCalls > 0 && throttleState.throttledCalls <= 10) {
    return {
      throttle: true,
      reason: `Sweet spot throttling active (${throttleState.throttledCalls}/10 calls)`
    };
  }

  // Check if p95 latency > 6s over last 20 calls
  if (throttleState.p95Latency > 6000 && throttleState.recentLatencies.length >= 20) {
    if (now - throttleState.lastThrottleTime > 30000) { // Don't throttle more than once per 30s
      throttleState.lastThrottleTime = now;
      throttleState.throttledCalls = 1;
      return {
        throttle: true,
        reason: `High latency detected (p95: ${Math.round(throttleState.p95Latency)}ms)`
      };
    }
  }

  return { throttle: false };
}

/**
 * Apply sweet spot parameter reduction
 */
function applyThrottling(params: any) {
  if (throttleState.throttledCalls > 0) {
    // Reduce steps and guidance by 20%
    if (params.steps) {
      params.steps = Math.floor(params.steps * 0.8);
    }
    if (params.guidance) {
      params.guidance = params.guidance * 0.8;
    }
    throttleState.throttledCalls++;
  }
  return params;
}

/**
 * Log generation event to telemetry
 */
function logTelemetry(data: {
  userId: string;
  provider: string;
  mode: string;
  success: boolean;
  latency: number;
  throttled: boolean;
  errorCode?: string;
}) {
  // Integration with existing telemetry system
  console.log(`[NANO_TELEMETRY] ${JSON.stringify(data)}`);
}

/**
 * Fallback to mock provider with branded placeholder
 */
async function createFallbackResult(prompt: string, params: any): Promise<any> {
  const mockProvider = createModelProvider('mock');
  const result = await mockProvider.generate(prompt, params);

  return {
    ...result,
    fallback: true,
    banner: "Nano Banana is cooling down - try again soon! 🍌"
  };
}

export function registerNanoRoutes(app: Express) {
  /**
   * POST /nano/generate - Main image generation endpoint
   */
  app.post('/nano/generate', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check user role (require creator or higher)
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return res.status(403).json({ error: 'User not found' });
      }

      // Note: Role checking would depend on your user schema
      // if (user.role !== 'creator' && user.role !== 'admin') {
      //   return res.status(403).json({ error: 'Creator role required' });
      // }
    } catch (error) {
      console.error('User lookup error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    try {
      // Validate request
      const validatedData = generateRequestSchema.parse(req.body);

      // Check rate limits
      const rateCheck = await checkRateLimit(userId);
      if (!rateCheck.allowed) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          limit: NANO_MAX_HOURLY,
          remaining: rateCheck.remaining,
          resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        });
      }

      // Check concurrency limits
      const concurrencyCheck = checkConcurrency(userId);
      if (!concurrencyCheck.allowed) {
        return res.status(429).json({
          error: 'Concurrency limit exceeded',
          limit: NANO_MAX_CONCURRENCY,
          current: concurrencyCheck.current
        });
      }

      // Check sweet spot throttling
      const throttleCheck = shouldThrottle();

      // Increment concurrency counter
      userConcurrency.set(userId, (userConcurrency.get(userId) || 0) + 1);

      const startTime = Date.now();
      let result: any;
      let provider: string;
      let success = false;
      let errorCode: string | undefined;

      try {
        // Create provider and apply throttling
        const modelProvider = createModelProvider();
        provider = modelProvider.name;

        let params = { ...validatedData };
        if (throttleCheck.throttle) {
          params = applyThrottling(params);
        }

        // Attempt generation
        result = await modelProvider.generate(validatedData.prompt, params);
        success = true;

      } catch (error) {
        console.error('Generation error:', error);
        errorCode = error.message?.includes('timeout') ? 'TIMEOUT' : 'PROVIDER_ERROR';

        // Fallback handling
        if (NANO_HARD_FAIL) {
          throw error;
        } else {
          result = await createFallbackResult(validatedData.prompt, validatedData);
          provider = 'mock_fallback';
          success = true; // Fallback is considered successful
        }
      } finally {
        // Decrement concurrency counter
        const current = userConcurrency.get(userId) || 0;
        if (current > 0) {
          userConcurrency.set(userId, current - 1);
        }
      }

      const duration = Date.now() - startTime;

      // Update latency tracking
      updateLatencyTracking(duration);

      // Record job in database
      try {
        await db.insert(nanoJobs).values({
          userId,
          mode: validatedData.mode,
          prompt: validatedData.prompt,
          latencyMs: duration,
          creditsUsed: result.usage?.credits || 1,
          provider,
          provenanceJson: result.provenance || null,
          imageUrl: result.url || null,
          parameters: validatedData,
          status: success ? 'completed' : 'failed',
          errorMessage: errorCode || null,
        });
      } catch (dbError) {
        console.error('Database insert error:', dbError);
        // Don't fail the request for DB errors
      }

      // Log telemetry
      logTelemetry({
        userId,
        provider,
        mode: validatedData.mode,
        success,
        latency: duration,
        throttled: throttleCheck.throttle,
        errorCode
      });

      // Return response
      return res.json({
        success: true,
        result,
        metadata: {
          latency: duration,
          provider,
          throttled: throttleCheck.throttle,
          throttleReason: throttleCheck.reason,
          remaining: rateCheck.remaining - 1,
          fallback: result.fallback || false
        }
      });

    } catch (error) {
      // Decrement concurrency counter on error
      const current = userConcurrency.get(userId) || 0;
      if (current > 0) {
        userConcurrency.set(userId, current - 1);
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid request parameters',
          details: error.errors
        });
      }

      console.error('Nano generation error:', error);

      if (NANO_HARD_FAIL) {
        return res.status(503).json({
          error: 'Service temporarily unavailable',
          message: error.message
        });
      }

      // Try fallback even on validation errors
      try {
        const fallbackResult = await createFallbackResult(
          req.body.prompt || 'placeholder',
          { mode: 'text2img' }
        );

        return res.json({
          success: true,
          result: fallbackResult,
          metadata: {
            latency: 1000,
            provider: 'mock_fallback',
            throttled: false,
            fallback: true,
            error: error.message
          }
        });
      } catch (fallbackError) {
        return res.status(500).json({
          error: 'Generation failed and fallback unavailable',
          message: error.message
        });
      }
    }
  });

  /**
   * GET /nano/status - Get current system status
   */
  app.get('/nano/status', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;

    let userStats = { remaining: NANO_MAX_HOURLY, used: 0 };

    if (userId) {
      const rateCheck = await checkRateLimit(userId);
      userStats.remaining = rateCheck.remaining;
      userStats.used = NANO_MAX_HOURLY - rateCheck.remaining;
    }

    const concurrency = userId ? (userConcurrency.get(userId) || 0) : 0;
    const status = throttleState.throttledCalls > 0 ? 'Throttled' :
      throttleState.p95Latency > 6000 ? 'Cooling' : 'On';

    return res.json({
      status,
      provider: process.env.NANO_PROVIDER || 'mock',
      userStats,
      concurrency: {
        current: concurrency,
        limit: NANO_MAX_CONCURRENCY
      },
      performance: {
        p95Latency: Math.round(throttleState.p95Latency),
        throttledCalls: throttleState.throttledCalls,
        recentSamples: throttleState.recentLatencies.length
      },
      capabilities: {
        maxHourly: NANO_MAX_HOURLY,
        maxConcurrency: NANO_MAX_CONCURRENCY,
        hardFail: NANO_HARD_FAIL,
        provenance: NANO_ENABLE_PROVENANCE
      }
    });
  });

  /**
   * GET /nano/history - Get user's generation history
   */
  app.get('/nano/history', isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const history = await db
        .select({
          id: nanoJobs.id,
          mode: nanoJobs.mode,
          prompt: nanoJobs.prompt,
          latencyMs: nanoJobs.latencyMs,
          provider: nanoJobs.provider,
          imageUrl: nanoJobs.imageUrl,
          status: nanoJobs.status,
          createdAt: nanoJobs.createdAt
        })
        .from(nanoJobs)
        .where(eq(nanoJobs.userId, userId))
        .orderBy(desc(nanoJobs.createdAt))
        .limit(50);

      return res.json({ history });
    } catch (error) {
      console.error('History query error:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  });
}