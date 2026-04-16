/**
 * Fetch with Timeout Utility
 * 
 * Wraps fetch calls with configurable timeout to prevent hanging requests
 * Used for outbound API calls to external services
 */

import { logger } from './logger';

export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number; // Timeout in milliseconds (default: 10000)
  requestId?: string; // Optional request ID for logging
}

/**
 * Fetch with timeout wrapper
 * 
 * @param url - Request URL
 * @param options - Fetch options including timeout
 * @returns Promise<Response>
 * @throws Error if timeout exceeded or fetch fails
 */
export async function fetchWithTimeout(
  url: string | URL,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = 10000, requestId, ...fetchOptions } = options;
  
  const logContext = requestId ? { requestId } : undefined;
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);
  
  try {
    logger.debug(`Fetching ${url} (timeout: ${timeout}ms)`, logContext);
    
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    logger.debug(`Fetch completed: ${url} (status: ${response.status})`, logContext);
    
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      const timeoutError = new Error(`Request timeout after ${timeout}ms: ${url}`);
      logger.error(`Fetch timeout: ${url}`, timeoutError, logContext);
      throw timeoutError;
    }
    
    logger.error(`Fetch failed: ${url}`, error instanceof Error ? error : new Error(String(error)), logContext);
    throw error;
  }
}

/**
 * Fetch JSON with timeout
 * Convenience wrapper that also parses JSON response
 */
export async function fetchJsonWithTimeout<T = any>(
  url: string | URL,
  options: FetchWithTimeoutOptions = {}
): Promise<T> {
  const response = await fetchWithTimeout(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

