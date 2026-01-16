/**
 * Simple Circuit Breaker for DreamEventBus
 * Protects against cascading failures in event handlers
 */
export interface CircuitBreakerOptions {
    failureThreshold: number;
    resetTimeout: number;
}
export declare class CircuitBreaker {
    private failures;
    private lastFailureTime;
    private state;
    private options;
    constructor(options?: CircuitBreakerOptions);
    execute<T>(action: () => T): T;
    private recordFailure;
    private reset;
}
//# sourceMappingURL=CircuitBreaker.d.ts.map