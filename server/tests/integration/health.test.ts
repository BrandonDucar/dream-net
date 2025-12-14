/**
 * Integration Tests for Health Endpoints
 * 
 * Tests critical health check endpoints that are used by
 * Kubernetes/Docker and monitoring systems.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

// Import the Express app
// Note: In a real setup, you'd export the app from server/index.ts
// For now, we'll test against a running server or create a test app

describe('Health Endpoints', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  describe('GET /health', () => {
    it('should return 200 with health status', async () => {
      const response = await request(baseUrl)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('ok');
      expect(response.body).toHaveProperty('service', 'dreamnet-api');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(['healthy', 'unhealthy', 'not-configured', 'checking']).toContain(response.body.database);
    });
    
    it('should include metrics if available', async () => {
      const response = await request(baseUrl)
        .get('/health')
        .expect(200);
      
      // Metrics are optional and non-blocking
      if (response.body.metrics) {
        expect(response.body.metrics).toHaveProperty('requestsPerSecond');
        expect(response.body.metrics).toHaveProperty('errorRate');
        expect(response.body.metrics).toHaveProperty('latency');
        expect(response.body.metrics).toHaveProperty('memory');
      }
    });
    
    it('should respond quickly (< 2 seconds)', async () => {
      const start = Date.now();
      await request(baseUrl)
        .get('/health')
        .expect(200);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(2000);
    });
  });
  
  describe('GET /health/live', () => {
    it('should return 200 with liveness status', async () => {
      const response = await request(baseUrl)
        .get('/health/live')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'alive');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('pid');
      expect(typeof response.body.uptime).toBe('number');
      expect(typeof response.body.pid).toBe('number');
    });
    
    it('should not depend on external services', async () => {
      // Liveness probe should work even if DB is down
      const response = await request(baseUrl)
        .get('/health/live')
        .expect(200);
      
      expect(response.body.status).toBe('alive');
    });
  });
  
  describe('GET /health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(baseUrl)
        .get('/health/ready');
      
      // Can be 200 (ready) or 503 (not ready)
      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('ready');
      expect(typeof response.body.ready).toBe('boolean');
      
      if (response.status === 200) {
        expect(response.body.ready).toBe(true);
        expect(response.body).toHaveProperty('checks');
      }
    });
    
    it('should check critical dependencies', async () => {
      const response = await request(baseUrl)
        .get('/health/ready');
      
      if (response.status === 200 && response.body.checks) {
        expect(response.body.checks).toHaveProperty('database');
        expect(response.body.checks).toHaveProperty('environment');
      }
    });
  });
});
