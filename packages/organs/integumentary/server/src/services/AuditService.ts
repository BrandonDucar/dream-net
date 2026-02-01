
import { dreamEventBus } from '../../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';
import { monetizationService } from './MonetizationService.js';

/**
 * AuditService
 * Coordinates paid security audits signed by Boris Grishenko.
 */
export class AuditService {
    private static instance: AuditService;
    private freeAuditUsed: Map<string, boolean> = new Map();

    private constructor() {
        console.log("🛡️ [AuditService] Security auditing protocols active.");
    }

    public static getInstance(): AuditService {
        if (!AuditService.instance) {
            AuditService.instance = new AuditService();
        }
        return AuditService.instance;
    }

    /**
     * requestAudit
     * Initiates a paid security audit.
     */
    public async requestAudit(entityId: string, auditType: 'BASIC' | 'GRISHENKO_OVERKILL', method: 'BASE' | 'SOLANA' | 'STRIPE' = 'BASE') {
        console.log(`🛡️ [AuditService] Requesting ${auditType} audit for ${entityId}...`);

        const isFreeBasic = auditType === 'BASIC' && !this.freeAuditUsed.has(entityId);

        if (isFreeBasic) {
            console.log(`🛡️ [AuditService] 🎁 FIRST AUDIT FREE: Hooking agent ${entityId} with a basic pulse check.`);
            this.freeAuditUsed.set(entityId, true);
        } else {
            const costEth = auditType === 'GRISHENKO_OVERKILL' ? '0.01' : '0.002';
            const costUsd = auditType === 'GRISHENKO_OVERKILL' ? 20 : 5;

            const paid = await monetizationService.requestPayment({
                type: 'AUDIT',
                method,
                agentId: entityId,
                amountEth: costEth,
                amountUsd: costUsd,
                metadata: { auditType }
            });

            if (!paid) {
                console.warn(`🛡️ [AuditService] ❌ Audit payment failed for ${entityId}.`);
                return { success: false, message: "Payment required." };
            }
        }

        console.log(`🛡️ [AuditService] ✅ Payment verified. Dispatching Boris for the '${auditType}' audit.`);

        // Simulate audit process
        await new Promise(r => setTimeout(r, 2000));

        dreamEventBus.publish('Security.AuditComplete', {
            entityId,
            auditType,
            signedBy: 'Boris Grishenko',
            timestamp: Date.now()
        });

        return { success: true, message: "Audit complete. I AM INVINCIBLE!" };
    }
}

export const auditService = AuditService.getInstance();
