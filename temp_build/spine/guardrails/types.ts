/**
 * Guardrail Context
 * 
 * Context passed to guardrail rules for evaluation
 */
export interface GuardrailContext {
    agentId: string;
    identityId: string;
    input: any;
    metadata?: Record<string, any>;
    timestamp: number;
}

/**
 * Guardrail Result
 * 
 * Result of guardrail evaluation
 */
export interface GuardrailResult {
    allowed: boolean;
    reason?: string;
    metadata?: Record<string, any>;
}

/**
 * Guardrail Rule
 * 
 * Individual guardrail rule that can be registered with the engine
 */
export interface GuardrailRule {
    id: string;
    name: string;
    type: 'input' | 'output';
    blocking: boolean;
    priority: number; // Lower = higher priority
    check: (context: GuardrailContext) => Promise<GuardrailResult>;
}
