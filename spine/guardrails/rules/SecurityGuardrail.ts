import { GuardrailRule, GuardrailContext } from '../types.js';

/**
 * Security Guardrail
 * 
 * Integrates with Shield Core to detect threats.
 * This is a BLOCKING rule that runs before agent execution.
 */
export const SecurityGuardrail: GuardrailRule = {
    id: 'security',
    name: 'Security Check',
    type: 'input',
    blocking: true,
    priority: 0, // Highest priority (runs first)

    check: async (context: GuardrailContext) => {
        try {
            // Lazy load Shield Core
            const { ShieldCore } = await import('@dreamnet/shield-core');

            // Detect threat
            const threat = ShieldCore.detectThreat(
                'api-abuse',
                'low',
                context.identityId,
                context.agentId,
                context.input
            );

            // Analyze threat
            const analysis = ShieldCore.analyzeThreat(threat);

            if (analysis.shouldBlock) {
                // Fire offensive spike
                ShieldCore.fireSpikeAtThreat(threat);

                return {
                    allowed: false,
                    reason: 'Security threat detected',
                    metadata: {
                        threatId: threat.id,
                        threatType: threat.type,
                        threatLevel: threat.level,
                        recommendedSpike: analysis.recommendedSpike
                    }
                };
            }

            return {
                allowed: true,
                metadata: {
                    threatId: threat.id,
                    threatLevel: threat.level
                }
            };
        } catch (error: any) {
            console.error('[SecurityGuardrail] Error:', error);

            // Fail open for security (allow if we can't check)
            // In production, you might want to fail closed
            return {
                allowed: true,
                metadata: { error: error.message }
            };
        }
    }
};
