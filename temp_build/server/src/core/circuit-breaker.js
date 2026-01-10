/**
 * Circuit Breaker Pattern Implementation
 * Protects the system from cascading failures by failing fast when external services are down.
 */
var CircuitState;
(function (CircuitState) {
    CircuitState[CircuitState["CLOSED"] = 0] = "CLOSED";
    CircuitState[CircuitState["OPEN"] = 1] = "OPEN";
    CircuitState[CircuitState["HALF_OPEN"] = 2] = "HALF_OPEN"; // Testing if service recovered
})(CircuitState || (CircuitState = {}));
class CircuitBreaker {
    state = CircuitState.CLOSED;
    failures = 0;
    lastFailureTime = 0;
    name;
    options;
    constructor(name, options) {
        this.name = name;
        this.options = options;
    }
    async execute(action) {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() - this.lastFailureTime > this.options.resetTimeout) {
                this.state = CircuitState.HALF_OPEN;
            }
            else {
                throw new Error(`Circuit breaker '${this.name}' is OPEN`);
            }
        }
        try {
            const result = await this.executeWithTimeout(action);
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    async executeWithTimeout(action) {
        if (!this.options.requestTimeout) {
            return action();
        }
        return Promise.race([
            action(),
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Circuit breaker '${this.name}' timed out`)), this.options.requestTimeout))
        ]);
    }
    onSuccess() {
        this.failures = 0;
        this.state = CircuitState.CLOSED;
    }
    onFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.options.failureThreshold) {
            this.state = CircuitState.OPEN;
            console.warn(`[CircuitBreaker] '${this.name}' opened after ${this.failures} failures`);
        }
    }
}
// Global registry of circuit breakers
const breakers = new Map();
const DEFAULT_OPTIONS = {
    failureThreshold: 5,
    resetTimeout: 10000, // 10 seconds
    requestTimeout: 5000 // 5 seconds
};
export async function withCircuitBreaker(name, action, options = {}) {
    if (!breakers.has(name)) {
        breakers.set(name, new CircuitBreaker(name, { ...DEFAULT_OPTIONS, ...options }));
    }
    return breakers.get(name).execute(action);
}
