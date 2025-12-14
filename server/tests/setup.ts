/**
 * Test Setup Configuration
 * 
 * Shared configuration for integration tests.
 */

import { beforeAll, afterAll } from 'vitest';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = process.env.TEST_PORT || '3001';

beforeAll(async () => {
  // Setup before all tests
  // Could start test server here if needed
});

afterAll(async () => {
  // Cleanup after all tests
});
