import { GuardrailRule, GuardrailContext } from '../types';

/**
 * Cost Gating Guardrail
 * 
 * Prevents agent execution if user has insufficient balance.
 * This is a BLOCKING rule that runs before agent execution.
 */
export const CostGatingRule: GuardrailRule = {
    id: 'cost-gating',
    name: 'Cost Gating',
    type: 'input',
    blocking: true,
    priority: 1, // Highest priority

    check: async (context: GuardrailContext) => {
        try {
            // Lazy load Economic Engine to avoid circular deps
            const { EconomicEngineCore } = await import('../../../../packages/economic-engine-core/index');

            // Get user's SHEEP balance
            const balance = EconomicEngineCore.getBalance(context.identityId, 'SHEEP');

            // Estimate cost of request
            const estimatedCost = estimateRequestCost(context);

            // Check if user has sufficient balance
            if (balance.amount < estimatedCost) {
                return {
                    allowed: false,
                    reason: 'Insufficient balance',
                    metadata: {
                        required: estimatedCost,
                        available: balance.amount,
                        deficit: estimatedCost - balance.amount
                    }
                };
            }

            return {
                allowed: true,
                metadata: {
                    estimatedCost,
                    balance: balance.amount
                }
            };
        } catch (error: any) {
            console.error('[CostGatingRule] Error:', error);

            // Fail open for cost gating (allow if we can't check)
            return {
                allowed: true,
                metadata: { error: error.message }
            };
        }
    }
};

/**
 * Estimate the cost of a request
 * 
 * This is a simple heuristic. In production, you'd want more sophisticated
 * cost estimation based on:
 * - Agent type
 * - Input complexity
 * - Expected tool calls
 * - Historical data
 */
function estimateRequestCost(context: GuardrailContext): number {
    // Base cost
    let cost = 10;

    // Add cost based on input size
    const inputSize = JSON.stringify(context.input).length;
    cost += Math.floor(inputSize / 100); // 1 SHEEP per 100 chars

    // Add cost based on agent type
    const agentCosts: Record<string, number> = {
        'agent:lucid': 20,
        'agent:canvas': 30,
        'agent:dreamkeeper': 15,
        'agent:social-media-ops': 25,
    };
    cost += agentCosts[context.agentId] || 10;

    return cost;
}
