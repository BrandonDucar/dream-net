/**
 * Circuit Breaker Pattern Implementation
 * Protects the system from cascading failures by failing fast when external services are down.
 */

interface CircuitBreakerOptions {
    failureThreshold: number; // Number of failures before opening
    resetTimeout: number;     // Time in ms to wait before trying again (Half-Open)
    requestTimeout?: number;  // Timeout for the actual request
}

enum CircuitState {
    CLOSED,   // Normal operation
    OPEN,     // Failing fast
    HALF_OPEN // Testing if service recovered
}

class CircuitBreaker {
    private state: CircuitState = CircuitState.CLOSED;
    private failures: number = 0;
    private lastFailureTime: number = 0;
    private name: string;
    private options: CircuitBreakerOptions;

    constructor(name: string, options: CircuitBreakerOptions) {
        this.name = name;
        this.options = options;
    }

    public async execute<T>(action: () => Promise<T>): Promise<T> {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() - this.lastFailureTime > this.options.resetTimeout) {
                this.state = CircuitState.HALF_OPEN;
            } else {
                throw new Error(`Circuit breaker '${this.name}' is OPEN`);
            }
        }

        try {
            const result = await this.executeWithTimeout(action);
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private async executeWithTimeout<T>(action: () => Promise<T>): Promise<T> {
        if (!this.options.requestTimeout) {
            return action();
        }

        return Promise.race([
            action(),
            new Promise<T>((_, reject) =>
                setTimeout(() => reject(new Error(`Circuit breaker '${this.name}' timed out`)), this.options.requestTimeout)
            )
        ]);
    }

    private onSuccess() {
        this.failures = 0;
        this.state = CircuitState.CLOSED;
    }

    private onFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();

        if (this.failures >= this.options.failureThreshold) {
            this.state = CircuitState.OPEN;
            console.warn(`[CircuitBreaker] '${this.name}' opened after ${this.failures} failures`);
        }
    }
}

// Global registry of circuit breakers
const breakers = new Map<string, CircuitBreaker>();

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
    failureThreshold: 5,
    resetTimeout: 10000, // 10 seconds
    requestTimeout: 5000 // 5 seconds
};

export async function withCircuitBreaker<T>(
    name: string,
    action: () => Promise<T>,
    options: Partial<CircuitBreakerOptions> = {}
): Promise<T> {
    if (!breakers.has(name)) {
        breakers.set(name, new CircuitBreaker(name, { ...DEFAULT_OPTIONS, ...options }));
    }

    return breakers.get(name)!.execute(action);
}
