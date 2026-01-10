"use strict";
/**
 * Simple Circuit Breaker for DreamEventBus
 * Protects against cascading failures in event handlers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    failures = 0;
    lastFailureTime = 0;
    state = 'CLOSED';
    options;
    constructor(options = { failureThreshold: 5, resetTimeout: 10000 }) {
        this.options = options;
    }
    execute(action) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.options.resetTimeout) {
                this.state = 'HALF_OPEN';
            }
            else {
                throw new Error('Circuit Breaker is OPEN');
            }
        }
        try {
            const result = action();
            if (this.state === 'HALF_OPEN') {
                this.reset();
            }
            return result;
        }
        catch (error) {
            this.recordFailure();
            throw error;
        }
    }
    recordFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.options.failureThreshold) {
            this.state = 'OPEN';
        }
    }
    reset() {
        this.failures = 0;
        this.state = 'CLOSED';
    }
}
exports.CircuitBreaker = CircuitBreaker;
