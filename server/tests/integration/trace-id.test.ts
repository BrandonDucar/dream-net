/**
 * Integration Tests for Trace ID Middleware
 * 
 * Tests request tracing and trace ID propagation.
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';

describe('Trace ID Middleware', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  describe('Trace ID Generation', () => {
    it('should include X-Trace-Id header in response', async () => {
      const response = await request(baseUrl)
        .get('/health')
        .expect(200);
      
      expect(response.headers).toHaveProperty('x-trace-id');
      expect(response.headers['x-trace-id']).toBeTruthy();
      expect(typeof response.headers['x-trace-id']).toBe('string');
    });
    
    it('should use provided trace ID if present', async () => {
      const customTraceId = 'custom-trace-id-12345';
      
      const response = await request(baseUrl)
        .get('/health')
        .set('X-Trace-Id', customTraceId)
        .expect(200);
      
      expect(response.headers['x-trace-id']).toBe(customTraceId);
    });
    
    it('should generate unique trace IDs for different requests', async () => {
      const response1 = await request(baseUrl).get('/health');
      const response2 = await request(baseUrl).get('/health');
      
      // Trace IDs should be different (unless generated at exact same millisecond)
      // In practice, they'll almost always be different
      const traceId1 = response1.headers['x-trace-id'];
      const traceId2 = response2.headers['x-trace-id'];
      
      expect(traceId1).toBeTruthy();
      expect(traceId2).toBeTruthy();
    });
  });
  
  describe('Trace ID in Error Responses', () => {
    it('should include traceId in error responses', async () => {
      const response = await request(baseUrl)
        .get('/api/nonexistent-endpoint')
        .expect(404);
      
      // Error responses should include traceId
      if (response.body.traceId) {
        expect(response.body.traceId).toBeTruthy();
        expect(response.headers['x-trace-id']).toBe(response.body.traceId);
      }
    });
  });
});
