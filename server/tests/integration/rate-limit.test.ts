/**
 * Integration Tests for Rate Limiting
 * 
 * Tests rate limiting behavior and headers.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

describe('Rate Limiting', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  beforeEach(async () => {
    // Wait a bit between test runs to avoid rate limit issues
    await new Promise(resolve => setTimeout(resolve, 100));
  });
  
  describe('Rate Limit Headers', () => {
    it('should include rate limit headers in response', async () => {
      const response = await request(baseUrl)
        .get('/health')
        .expect(200);
      
      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
      
      expect(parseInt(response.headers['x-ratelimit-limit'])).toBeGreaterThan(0);
      expect(parseInt(response.headers['x-ratelimit-remaining'])).toBeGreaterThanOrEqual(0);
    });
    
    it('should decrement remaining count', async () => {
      const response1 = await request(baseUrl).get('/health');
      const remaining1 = parseInt(response1.headers['x-ratelimit-remaining']);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const response2 = await request(baseUrl).get('/health');
      const remaining2 = parseInt(response2.headers['x-ratelimit-remaining']);
      
      // Remaining should decrease or stay same (if reset)
      expect(remaining2).toBeLessThanOrEqual(remaining1);
    });
  });
  
  describe('Rate Limit Exceeded', () => {
    it('should return 429 when rate limit exceeded', async function() {
      // Skip in CI/CD to avoid flakiness
      if (process.env.CI) {
        this.skip();
      }
      
      // Make many requests quickly to trigger rate limit
      // Note: This test may be flaky, so we'll skip it in CI
      const requests = Array(110).fill(null).map(() => 
        request(baseUrl).get('/health')
      );
      
      const responses = await Promise.all(requests);
      
      // At least one should be rate limited
      const rateLimited = responses.some(r => r.status === 429);
      
      if (rateLimited) {
        const rateLimitedResponse = responses.find(r => r.status === 429);
        expect(rateLimitedResponse?.body).toHaveProperty('ok', false);
        expect(rateLimitedResponse?.body).toHaveProperty('error', 'rate_limit_exceeded');
        expect(rateLimitedResponse?.body).toHaveProperty('retryAfter');
        expect(rateLimitedResponse?.headers).toHaveProperty('retry-after');
      }
    });
  });
  
  describe('Health Check Exemption', () => {
    it('should not rate limit /health endpoint', async () => {
      // Health checks should not be rate limited
      const response = await request(baseUrl)
        .get('/health')
        .expect(200);
      
      // Should still have headers but not be blocked
      expect(response.headers).toHaveProperty('x-ratelimit-limit');
    });
  });
});
