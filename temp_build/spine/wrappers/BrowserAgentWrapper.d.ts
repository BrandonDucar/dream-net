import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus';
import { TierId } from '../dreamnet-event-bus/EventEnvelope';
import { IDomainAllowlist, IIPBlocking, ILighthouseAuditor, LighthouseAuditResult } from './BrowserAgentInterfaces';
export declare class BrowserAgentWrapper {
    private eventBus;
    private domainAllowlist?;
    private ipBlocking?;
    private auditor?;
    constructor(eventBus: DreamEventBus, domainAllowlist?: IDomainAllowlist, ipBlocking?: IIPBlocking, auditor?: ILighthouseAuditor);
    /**
     * Audit a website with strict governance and event logging
     */
    auditWebsite(params: {
        url: string;
        callerId: string;
        tierId: TierId;
        missionId?: string;
        correlationId?: string;
    }): Promise<LighthouseAuditResult>;
    private emitBlockedEvent;
    isAllowed(url: string): boolean;
    reportBlockedNavigation(url: string): void;
}
