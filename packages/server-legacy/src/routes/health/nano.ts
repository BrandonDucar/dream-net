import type { Express } from "express";
import { createModelProvider } from "../../../packages/shared/model-registry/index";

/**
 * Health check endpoint for Nano Banana system
 * GET /health/nano - Returns provider status and performance metrics
 */
export function registerNanoHealthRoutes(app: Express) {
  app.get('/health/nano', async (req, res) => {
    try {
      const provider = createModelProvider();
      const providerName = provider.name;
      
      // Test provider capabilities
      let capabilities;
      let lastSuccess: Date | null = null;
      let status = 'unknown';
      
      try {
        capabilities = await provider.capabilities();
        lastSuccess = new Date();
        status = 'healthy';
      } catch (error) {
        status = 'degraded';
        capabilities = { error: error.message };
      }
      
      // Mock p95 latency calculation (in production, this would come from metrics)
      const mockP95Latency = provider.name === 'mock' ? 1500 : 4500;
      
      return res.json({
        status,
        provider: providerName,
        lastSuccess: lastSuccess?.toISOString(),
        p95Latency: mockP95Latency,
        capabilities,
        environment: {
          NANO_PROVIDER: process.env.NANO_PROVIDER || 'mock',
          NANO_MAX_HOURLY: process.env.NANO_MAX_HOURLY || '12',
          NANO_MAX_CONCURRENCY: process.env.NANO_MAX_CONCURRENCY || '2',
          NANO_HARD_FAIL: process.env.NANO_HARD_FAIL || 'false',
          FLUX_API_CONFIGURED: !!process.env.FLUX_API_KEY
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(503).json({
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });
}