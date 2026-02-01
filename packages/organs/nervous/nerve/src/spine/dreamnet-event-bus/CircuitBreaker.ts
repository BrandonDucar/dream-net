/**
 * Simple Circuit Breaker for DreamEventBus
 * Protects against cascading failures in event handlers
 */

export interface CircuitBreakerOptions {
    failureThreshold: number;
    resetTimeout: number;
}

export class CircuitBreaker {
    private failures = 0;
    private lastFailureTime = 0;
    private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
    private options: CircuitBreakerOptions;

    constructor(options: CircuitBreakerOptions = { failureThreshold: 5, resetTimeout: 10000 }) {
        this.options = options;
    }

    public execute<T>(action: () => T): T {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.options.resetTimeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit Breaker is OPEN');
            }
        }

        try {
            const result = action();
            if (this.state === 'HALF_OPEN') {
                this.reset();
            }
            return result;
        } catch (error) {
            this.recordFailure();
            throw error;
        }
    }

    private recordFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.options.failureThreshold) {
            this.state = 'OPEN';
        }
    }

    private reset() {
        this.failures = 0;
        this.state = 'CLOSED';
    }
}
