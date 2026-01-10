import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus';
import { EventEnvelope } from '../dreamnet-event-bus/EventEnvelope';
import { TierId } from '../dreamnet-event-bus/EventEnvelope';
import { IDomainAllowlist, IIPBlocking, ILighthouseAuditor, LighthouseAuditResult } from './BrowserAgentInterfaces';

export class BrowserAgentWrapper {
    constructor(
        private eventBus: DreamEventBus,
        private domainAllowlist?: IDomainAllowlist,
        private ipBlocking?: IIPBlocking,
        private auditor?: ILighthouseAuditor
    ) { }

    /**
     * Audit a website with strict governance and event logging
     */
    public async auditWebsite(params: {
        url: string;
        callerId: string;
        tierId: TierId;
        missionId?: string;
        correlationId?: string;
    }): Promise<LighthouseAuditResult> {
        const { url, callerId, tierId, missionId } = params;
        const correlationId = params.correlationId || crypto.randomUUID();
        const timestamp = Date.now();

        // 1. Emit Navigation Attempted Event
        this.eventBus.publish(this.eventBus.createEnvelope(
            'Browser.NavigationAttempted',
            'BrowserAgent',
            {
                url,
                domain: new URL(url).hostname,
                scheme: new URL(url).protocol.replace(':', ''),
                requestedBy: callerId,
                missionId
            },
            {
                eventId: crypto.randomUUID(),
                correlationId,
                timestamp,
                actor: { callerId, tierId, missionId },
                target: { url, domain: new URL(url).hostname },
                severity: 'low'
            }
        ));

        try {
            // 2. Check Domain Allowlist
            if (this.domainAllowlist) {
                const allowlistCheck = this.domainAllowlist.isAllowed(url);
                if (!allowlistCheck.allowed) {
                    this.emitBlockedEvent(correlationId, callerId, tierId, url, 'domain_not_in_allowlist', allowlistCheck.reason || 'Domain not allowed');
                    throw new Error(`Domain not allowed: ${allowlistCheck.reason}`);
                }
            }

            // 3. Check Internal IP Blocking
            let resolvedIp: string | undefined;
            if (this.ipBlocking) {
                const ipCheck = await this.ipBlocking.validateUrl(url);
                resolvedIp = ipCheck.resolvedIp;
                if (!ipCheck.allowed) {
                    this.emitBlockedEvent(correlationId, callerId, tierId, url, 'internal_ip', ipCheck.reason || 'Internal IP blocked', ipCheck.resolvedIp);
                    throw new Error(`Access denied: ${ipCheck.reason}`);
                }
            }

            // 4. Emit Navigation Allowed Event
            this.eventBus.publish(this.eventBus.createEnvelope(
                'Browser.NavigationAllowed',
                'BrowserAgent',
                {
                    url,
                    domain: new URL(url).hostname,
                    resolvedIp,
                    allowlistCheck: {
                        allowed: true,
                        reason: 'Domain in allowlist',
                        allowlistSize: this.domainAllowlist?.getDomains().length || 0
                    }
                },
                {
                    eventId: crypto.randomUUID(),
                    correlationId,
                    timestamp: Date.now(),
                    actor: { callerId, tierId, missionId },
                    target: { url, domain: new URL(url).hostname, resolvedIp },
                    severity: 'low'
                }
            ));

            // 5. Execute Audit
            if (!this.auditor) {
                throw new Error('Lighthouse Auditor not configured in BrowserAgentWrapper');
            }
            const result = await this.auditor.auditWebsite(url);

            // 6. Emit Audit Completed Event
            this.eventBus.publish(this.eventBus.createEnvelope(
                'Browser.AuditCompleted',
                'BrowserAgent',
                {
                    url,
                    domain: new URL(url).hostname,
                    durationMs: Date.now() - timestamp,
                    overallScore: result.scores.performance,
                    scores: result.scores
                },
                {
                    eventId: crypto.randomUUID(),
                    correlationId,
                    timestamp: Date.now(),
                    actor: { callerId, tierId, missionId },
                    target: { url, domain: new URL(url).hostname },
                    severity: 'low'
                }
            ));

            return result;

        } catch (error: any) {
            // 7. Emit Audit Failed Event (if it wasn't a block)
            if (!error.message.includes('Domain not allowed') && !error.message.includes('Access denied')) {
                this.eventBus.publish(this.eventBus.createEnvelope(
                    'Browser.AuditFailed',
                    'BrowserAgent',
                    {
                        url,
                        domain: new URL(url).hostname,
                        durationMs: Date.now() - timestamp,
                        errorCode: 'UNKNOWN',
                        errorMessage: error.message,
                        stackTrace: error.stack
                    },
                    {
                        eventId: crypto.randomUUID(),
                        correlationId,
                        timestamp: Date.now(),
                        actor: { callerId, tierId, missionId },
                        target: { url, domain: new URL(url).hostname },
                        severity: 'medium'
                    }
                ));
            }
            throw error;
        }
    }

    private emitBlockedEvent(
        correlationId: string,
        callerId: string,
        tierId: TierId,
        url: string,
        reasonCode: string,
        reasonMessage: string,
        resolvedIp?: string
    ) {
        this.eventBus.publish(this.eventBus.createEnvelope(
            'Browser.NavigationBlocked',
            'BrowserAgent',
            {
                url,
                domain: new URL(url).hostname,
                resolvedIp,
                blockReason: reasonCode,
                allowlistCheck: {
                    allowed: false,
                    reason: reasonMessage,
                    allowlistSize: this.domainAllowlist?.getDomains().length || 0
                }
            },
            {
                eventId: crypto.randomUUID(),
                correlationId,
                timestamp: Date.now(),
                actor: { callerId, tierId },
                target: { url, domain: new URL(url).hostname, resolvedIp },
                severity: 'medium'
            }
        ));
    }

    // Legacy method for backward compatibility if needed
    public isAllowed(url: string): boolean {
        return this.domainAllowlist ? this.domainAllowlist.isAllowed(url).allowed : true;
    }

    public reportBlockedNavigation(url: string): void {
        this.emitBlockedEvent(crypto.randomUUID(), 'unknown', 'FREE', url, 'manual_report', 'Manually reported block');
    }
}
