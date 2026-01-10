import { GuardrailRule, GuardrailContext, GuardrailResult } from './types';
import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus';

/**
 * Guardrail Engine
 * 
 * Central engine for evaluating guardrail rules before/after agent execution.
 * Supports blocking rules that can prevent agent execution entirely.
 */
export class GuardrailEngine {
    private rules: Map<string, GuardrailRule> = new Map();
    private eventBus?: DreamEventBus;

    constructor(eventBus?: DreamEventBus) {
        this.eventBus = eventBus;
    }

    /**
     * Register a guardrail rule
     */
    public registerRule(rule: GuardrailRule): void {
        this.rules.set(rule.id, rule);
        console.log(`[GuardrailEngine] Registered rule: ${rule.name} (${rule.type}, blocking: ${rule.blocking})`);
    }

    /**
     * Unregister a guardrail rule
     */
    public unregisterRule(ruleId: string): boolean {
        return this.rules.delete(ruleId);
    }

    /**
     * Evaluate all guardrails for a given context
     * 
     * Blocking rules are evaluated first in priority order.
     * If any blocking rule fails, evaluation stops immediately.
     */
    public async evaluate(
        context: GuardrailContext,
        type: 'input' | 'output' = 'input'
    ): Promise<GuardrailResult> {
        const startTime = Date.now();

        // Get rules of the specified type
        const applicableRules = Array.from(this.rules.values())
            .filter(rule => rule.type === type)
            .sort((a, b) => a.priority - b.priority);

        // Separate blocking and non-blocking rules
        const blockingRules = applicableRules.filter(r => r.blocking);
        const nonBlockingRules = applicableRules.filter(r => !r.blocking);

        // Evaluate blocking rules first (fail fast)
        for (const rule of blockingRules) {
            try {
                const result = await rule.check(context);

                if (!result.allowed) {
                    // Emit blocked event
                    if (this.eventBus) {
                        this.eventBus.publish(
                            this.eventBus.createEnvelope(
                                'Guardrail.Blocked',
                                'guardrail-engine',
                                {
                                    ruleId: rule.id,
                                    ruleName: rule.name,
                                    agentId: context.agentId,
                                    identityId: context.identityId,
                                    reason: result.reason,
                                    metadata: result.metadata
                                }
                            )
                        );
                    }

                    console.log(`[GuardrailEngine] BLOCKED by ${rule.name}: ${result.reason}`);
                    return result;
                }
            } catch (error: any) {
                console.error(`[GuardrailEngine] Error in rule ${rule.name}:`, error);

                // Fail closed: if a blocking rule errors, block the request
                return {
                    allowed: false,
                    reason: `Guardrail error: ${error.message}`,
                    metadata: { error: error.message, ruleId: rule.id }
                };
            }
        }

        // Evaluate non-blocking rules (for logging/monitoring)
        const warnings: string[] = [];
        for (const rule of nonBlockingRules) {
            try {
                const result = await rule.check(context);
                if (!result.allowed) {
                    warnings.push(`${rule.name}: ${result.reason}`);
                }
            } catch (error: any) {
                console.error(`[GuardrailEngine] Error in non-blocking rule ${rule.name}:`, error);
            }
        }

        const latency = Date.now() - startTime;

        // Emit passed event
        if (this.eventBus) {
            this.eventBus.publish(
                this.eventBus.createEnvelope(
                    'Guardrail.Passed',
                    'guardrail-engine',
                    {
                        agentId: context.agentId,
                        identityId: context.identityId,
                        rulesEvaluated: applicableRules.length,
                        warnings,
                        latency
                    }
                )
            );
        }

        return {
            allowed: true,
            metadata: { warnings, latency }
        };
    }

    /**
     * Get all registered rules
     */
    public getRules(): GuardrailRule[] {
        return Array.from(this.rules.values());
    }

    /**
     * Get rule by ID
     */
    public getRule(ruleId: string): GuardrailRule | undefined {
        return this.rules.get(ruleId);
    }
}
