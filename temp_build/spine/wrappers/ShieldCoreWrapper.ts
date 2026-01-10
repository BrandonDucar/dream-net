import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus';
import { ShieldCore } from '@dreamnet/shield-core';

export class ShieldCoreWrapper {
    constructor(private eventBus: DreamEventBus) { }

    /**
     * Evaluate a potential threat
     * Calls actual ShieldCore logic and emits events.
     */
    public async evaluateThreat(params: {
        input: any;
        callerId?: string;
        identityId?: string;
        correlationId?: string;
    }): Promise<{ threat: boolean; score: number; details?: any }> {
        const { input, callerId, identityId } = params;
        const correlationId = params.correlationId || crypto.randomUUID();
        const timestamp = Date.now();

        // Emit threat evaluation request
        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'Security.ThreatEvaluationRequested',
                'shield-core-wrapper',
                { input, callerId, identityId, correlationId },
                {
                    eventId: crypto.randomUUID(),
                    correlationId,
                    timestamp,
                    severity: 'low'
                }
            )
        );

        try {
            // Call actual ShieldCore implementation
            // Using detectThreat and analyzeThreat from the package
            const threat = ShieldCore.detectThreat(
                'anomaly', // Default type
                'medium',  // Default level
                callerId || 'unknown',
                'system',
                input
            );

            const analysis = ShieldCore.analyzeThreat(threat);

            const result = {
                threat: analysis.shouldBlock,
                score: analysis.shouldBlock ? 1.0 : 0.0,
                details: {
                    threatId: threat.id,
                    recommendedSpike: analysis.recommendedSpike,
                    engine: 'shield-core'
                }
            };

            this.eventBus.publish(
                this.eventBus.createEnvelope(
                    'Security.ThreatEvaluationCompleted',
                    'shield-core-wrapper',
                    { result, correlationId },
                    {
                        eventId: crypto.randomUUID(),
                        correlationId,
                        timestamp: Date.now(),
                        severity: result.threat ? 'high' : 'low'
                    }
                )
            );

            return result;
        } catch (error: any) {
            console.error('[ShieldCoreWrapper] Evaluation failed:', error);
            return { threat: false, score: 0, details: { error: error.message } };
        }
    }

    /**
     * Report a security incident
     */
    public async reportIncident(details: {
        type: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        correlationId?: string;
    }): Promise<void> {
        const correlationId = details.correlationId || crypto.randomUUID();

        // Call actual ShieldCore to record incident via threat detection
        // Mapping generic incident to threat structure
        ShieldCore.detectThreat(
            'intrusion', // Mapping generic type
            details.severity as any,
            'reporter',
            'system',
            { description: details.description }
        );

        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'Security.IncidentReported',
                'shield-core-wrapper',
                details,
                {
                    eventId: crypto.randomUUID(),
                    correlationId,
                    timestamp: Date.now(),
                    severity: details.severity
                }
            )
        );
    }
}
