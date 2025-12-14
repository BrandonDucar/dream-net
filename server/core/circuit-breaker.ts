/**
 * Circuit Breaker Pattern
 * 
 * Protects external API calls with exponential backoff retries
 * and circuit breaker (open after N failures, half-open probes).
 */

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Open circuit after N failures (default: 5)
  resetTimeout?: number; // Time before attempting half-open (default: 60000ms)
  halfOpenMaxAttempts?: number; // Max attempts in half-open state (default: 3)
  retryOptions?: {
    maxRetries?: number; // Max retry attempts (default: 5)
    initialDelay?: number; // Initial delay in ms (default: 100)
    maxDelay?: number; // Max delay in ms (default: 3000)
    jitter?: boolean; // Add random jitter (default: true)
  };
}

type CircuitState = 'closed' | 'open' | 'half-open';

class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number | null = null;
  private halfOpenAttempts = 0;

  constructor(
    private name: string,
    private options: CircuitBreakerOptions = {}
  ) {
    this.options = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 60000, // 60 seconds
      halfOpenMaxAttempts: options.halfOpenMaxAttempts || 3,
      retryOptions: {
        maxRetries: options.retryOptions?.maxRetries || 5,
        initialDelay: options.retryOptions?.initialDelay || 100,
        maxDelay: options.retryOptions?.maxDelay || 3000,
        jitter: options.retryOptions?.jitter !== false,
      },
    };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check circuit state
    if (this.state === 'open') {
      // Check if enough time has passed to attempt half-open
      if (this.lastFailureTime && Date.now() - this.lastFailureTime >= this.options.resetTimeout!) {
        this.state = 'half-open';
        this.halfOpenAttempts = 0;
        console.log(`🔄 [CircuitBreaker:${this.name}] Transitioning to half-open state`);
      } else {
        throw new Error(`Circuit breaker ${this.name} is OPEN (too many failures)`);
      }
    }

    try {
      // Execute with retries
      const result = await this.executeWithRetries(fn);

      // Success - reset failure count
      this.onSuccess();
      return result;
    } catch (error) {
      // Failure - increment failure count
      this.onFailure();
      throw error;
    }
  }

  /**
   * Execute with exponential backoff retries
   */
  private async executeWithRetries<T>(fn: () => Promise<T>): Promise<T> {
    const { maxRetries, initialDelay, maxDelay, jitter } = this.options.retryOptions!;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries!; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const baseDelay = Math.min(initialDelay! * Math.pow(2, attempt), maxDelay!);
        const delay = jitter
          ? baseDelay + Math.random() * baseDelay * 0.1 // Add 10% jitter
          : baseDelay;

        console.warn(
          `⚠️  [CircuitBreaker:${this.name}] Attempt ${attempt + 1}/${maxRetries! + 1} failed, retrying in ${Math.round(delay)}ms:`,
          lastError.message
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Unknown error');
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.failureCount = 0;
    this.lastFailureTime = null;

    if (this.state === 'half-open') {
      this.successCount++;
      if (this.successCount >= 2) {
        // Two successes in a row - close the circuit
        this.state = 'closed';
        this.successCount = 0;
        this.halfOpenAttempts = 0;
        console.log(`✅ [CircuitBreaker:${this.name}] Circuit CLOSED (recovered)`);
      }
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'half-open') {
      this.halfOpenAttempts++;
      if (this.halfOpenAttempts >= this.options.halfOpenMaxAttempts!) {
        // Too many failures in half-open - open the circuit
        this.state = 'open';
        this.halfOpenAttempts = 0;
        console.error(`❌ [CircuitBreaker:${this.name}] Circuit OPENED (half-open failures)`);
      }
    } else if (this.state === 'closed' && this.failureCount >= this.options.failureThreshold!) {
      // Too many failures - open the circuit
      this.state = 'open';
      console.error(`❌ [CircuitBreaker:${this.name}] Circuit OPENED (failure threshold reached)`);
    }
  }

  /**
   * Get current circuit state
   */
  getState(): {
    state: CircuitState;
    failureCount: number;
    lastFailureTime: number | null;
  } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
    };
  }

  /**
   * Reset circuit breaker (force close)
   */
  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.successCount = 0;
    this.halfOpenAttempts = 0;
    this.lastFailureTime = null;
    console.log(`🔄 [CircuitBreaker:${this.name}] Circuit RESET`);
  }
}

/**
 * Circuit breaker registry
 */
class CircuitBreakerRegistry {
  private breakers = new Map<string, CircuitBreaker>();

  /**
   * Get or create a circuit breaker
   */
  get(name: string, options?: CircuitBreakerOptions): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new CircuitBreaker(name, options));
    }
    return this.breakers.get(name)!;
  }

  /**
   * Get all circuit breakers
   */
  getAll(): Array<{ name: string; state: CircuitState; failureCount: number }> {
    return Array.from(this.breakers.entries()).map(([name, breaker]) => {
      const state = breaker.getState();
      return {
        name,
        state: state.state,
        failureCount: state.failureCount,
      };
    });
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }
}

// Singleton instance
let registryInstance: CircuitBreakerRegistry | null = null;

export function getCircuitBreakerRegistry(): CircuitBreakerRegistry {
  if (!registryInstance) {
    registryInstance = new CircuitBreakerRegistry();
  }
  return registryInstance;
}

/**
 * Helper: Execute with circuit breaker
 */
export async function withCircuitBreaker<T>(
  name: string,
  fn: () => Promise<T>,
  options?: CircuitBreakerOptions
): Promise<T> {
  const registry = getCircuitBreakerRegistry();
  const breaker = registry.get(name, options);
  return breaker.execute(fn);
}

