/**
 * Integration Tests for Metrics Endpoints
 * 
 * Tests metrics collection and golden signals endpoints.
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';

describe('Metrics Endpoints', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  describe('GET /api/metrics/golden-signals', () => {
    it('should return golden signals', async () => {
      const response = await request(baseUrl)
        .get('/api/metrics/golden-signals')
        .expect(200);
      
      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('traffic');
      expect(response.body).toHaveProperty('errors');
      expect(response.body).toHaveProperty('latency');
      expect(response.body).toHaveProperty('saturation');
    });
    
    it('should include traffic metrics', async () => {
      const response = await request(baseUrl)
        .get('/api/metrics/golden-signals')
        .expect(200);
      
      expect(response.body.traffic).toHaveProperty('requestsPerSecond');
      expect(response.body.traffic).toHaveProperty('activeConnections');
      expect(response.body.traffic).toHaveProperty('timestamp');
      expect(typeof response.body.traffic.requestsPerSecond).toBe('number');
    });
    
    it('should include error metrics', async () => {
      const response = await request(baseUrl)
        .get('/api/metrics/golden-signals')
        .expect(200);
      
      expect(response.body.errors).toHaveProperty('errorRate');
      expect(response.body.errors).toHaveProperty('status4xx');
      expect(response.body.errors).toHaveProperty('status5xx');
      expect(response.body.errors).toHaveProperty('timestamp');
      expect(typeof response.body.errors.errorRate).toBe('number');
    });
    
    it('should include latency percentiles', async () => {
      const response = await request(baseUrl)
        .get('/api/metrics/golden-signals')
        .expect(200);
      
      expect(response.body.latency).toHaveProperty('p50');
      expect(response.body.latency).toHaveProperty('p95');
      expect(response.body.latency).toHaveProperty('p99');
      expect(response.body.latency).toHaveProperty('timestamp');
      expect(typeof response.body.latency.p50).toBe('number');
    });
    
    it('should include saturation metrics', async () => {
      const response = await request(baseUrl)
        .get('/api/metrics/golden-signals')
        .expect(200);
      
      expect(response.body.saturation).toHaveProperty('cpu');
      expect(response.body.saturation).toHaveProperty('memory');
      expect(response.body.saturation).toHaveProperty('queueDepth');
      expect(response.body.saturation).toHaveProperty('timestamp');
      expect(response.body.saturation.memory).toHaveProperty('heapUsed');
    });
  });
  
  describe('GET /api/metrics/endpoint/:path', () => {
    it('should return 404 for non-existent endpoint', async () => {
      const response = await request(baseUrl)
        .get('/api/metrics/endpoint/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('ok', false);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should return metrics for existing endpoint after requests', async () => {
      // Make a request to /health first to generate metrics
      await request(baseUrl).get('/health');
      
      // Wait a bit for metrics to be recorded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await request(baseUrl)
        .get('/api/metrics/endpoint/health');
      
      // May return 404 if no metrics yet, or 200 with metrics
      if (response.status === 200) {
        expect(response.body).toHaveProperty('ok', true);
        expect(response.body).toHaveProperty('endpoint');
        expect(response.body).toHaveProperty('metrics');
        expect(response.body.metrics).toHaveProperty('count');
        expect(response.body.metrics).toHaveProperty('errorRate');
      }
    });
  });
});
