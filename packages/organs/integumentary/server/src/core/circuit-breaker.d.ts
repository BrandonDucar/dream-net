/**
 * Circuit Breaker Pattern Implementation
 * Protects the system from cascading failures by failing fast when external services are down.
 */
interface CircuitBreakerOptions {
    failureThreshold: number;
    resetTimeout: number;
    requestTimeout?: number;
}
export declare function withCircuitBreaker<T>(name: string, action: () => Promise<T>, options?: Partial<CircuitBreakerOptions>): Promise<T>;
export {};
