/**
 * Browser Agent Wrapper - Wraps Browser Agent functionality with governance and event emission
 * 
 * Phase I: Domain allowlist, IP blocking, event emission.
 * Phase II: Full policy enforcement, credential indirection.
 */

import type { DreamEventBus } from "../dreamnet-event-bus/DreamEventBus.js";
import { createBrowserEvent } from "../dreamnet-event-bus/EventEnvelope.js";
import { generateCorrelationId } from "../utils/correlationId.js";
import { getDomainAllowlist } from "../../server/core/browser-agent/domainAllowlist.js";
import { isURLBlocked } from "../../server/core/browser-agent/ipBlocking.js";

export interface AuditWebsiteParams {
  url: string;
  callerId: string;
  tierId?: string;
  missionId?: string;
  correlationId?: string;
  options?: {
    categories?: string[];
    timeout?: number;
  };
}

export interface AuditResult {
  success: boolean;
  result?: any;
  error?: string;
  correlationId: string;
  emittedEvents: string[];
  allowlistCheck: {
    allowed: boolean;
    reason?: string;
    domain: string;
    resolvedIP?: string;
  };
}

/**
 * Browser Agent Wrapper - Wraps Browser Agent functionality
 */
export class BrowserAgentWrapper {
  private eventBus: DreamEventBus | null = null;

  constructor(eventBus?: DreamEventBus) {
    this.eventBus = eventBus ?? null;
  }

  /**
   * Set the event bus for event emission
   */
  setEventBus(eventBus: DreamEventBus): void {
    this.eventBus = eventBus;
  }

  /**
   * Audit a website with governance checks
   */
  async auditWebsite(params: AuditWebsiteParams): Promise<AuditResult> {
    const correlationId = params.correlationId ?? generateCorrelationId();
    const emittedEvents: string[] = [];
    const allowlist = getDomainAllowlist();

    // Extract domain from URL
    let domain: string;
    try {
      const urlObj = new URL(params.url);
      domain = urlObj.hostname.toLowerCase();
    } catch {
      domain = params.url.toLowerCase();
    }

    // Emit: NavigationAttempted
    if (this.eventBus) {
      const attemptEvent = createBrowserEvent(
        "NavigationAttempted",
        "BrowserAgentWrapper",
        {
          url: params.url,
          domain,
          callerId: params.callerId,
          tierId: params.tierId,
          missionId: params.missionId,
        },
        correlationId
      );
      this.eventBus.publish(attemptEvent);
      emittedEvents.push(attemptEvent.id);
    }

    // Check domain allowlist
    if (!allowlist.isDomainAllowed(params.url)) {
      const reason = `Domain ${domain} not in allowlist`;
      
      // Emit: NavigationBlocked
      if (this.eventBus) {
        const blockedEvent = createBrowserEvent(
          "NavigationBlocked",
          "BrowserAgentWrapper",
          {
            url: params.url,
            domain,
            reason,
            callerId: params.callerId,
            allowlistSize: allowlist.getDomainCount(),
          },
          correlationId
        );
        this.eventBus.publish(blockedEvent);
        emittedEvents.push(blockedEvent.id);
      }

      return {
        success: false,
        error: reason,
        correlationId,
        emittedEvents,
        allowlistCheck: {
          allowed: false,
          reason,
          domain,
        },
      };
    }

    // Check IP blocking
    const ipCheck = await isURLBlocked(params.url);
    if (ipCheck.blocked) {
      // Emit: NavigationBlocked
      if (this.eventBus) {
        const blockedEvent = createBrowserEvent(
          "NavigationBlocked",
          "BrowserAgentWrapper",
          {
            url: params.url,
            domain,
            reason: ipCheck.reason,
            resolvedIP: ipCheck.resolvedIP,
            callerId: params.callerId,
          },
          correlationId
        );
        this.eventBus.publish(blockedEvent);
        emittedEvents.push(blockedEvent.id);
      }

      return {
        success: false,
        error: ipCheck.reason,
        correlationId,
        emittedEvents,
        allowlistCheck: {
          allowed: false,
          reason: ipCheck.reason,
          domain,
          resolvedIP: ipCheck.resolvedIP,
        },
      };
    }

    // Emit: NavigationAllowed
    if (this.eventBus) {
      const allowedEvent = createBrowserEvent(
        "NavigationAllowed",
        "BrowserAgentWrapper",
        {
          url: params.url,
          domain,
          resolvedIP: ipCheck.resolvedIP,
          callerId: params.callerId,
        },
        correlationId
      );
      this.eventBus.publish(allowedEvent);
      emittedEvents.push(allowedEvent.id);
    }

    // Call actual Lighthouse auditor (dynamic import to avoid circular deps)
    try {
      const { lighthouseAuditor } = await import("../../server/lighthouse-auditor.js");
      const auditResult = await lighthouseAuditor.auditWebsite(params.url);

      // Emit: AuditCompleted
      if (this.eventBus) {
        const completedEvent = createBrowserEvent(
          "AuditCompleted",
          "BrowserAgentWrapper",
          {
            url: params.url,
            domain,
            overallScore: auditResult.summary?.overallScore,
            callerId: params.callerId,
          },
          correlationId
        );
        this.eventBus.publish(completedEvent);
        emittedEvents.push(completedEvent.id);
      }

      return {
        success: true,
        result: auditResult,
        correlationId,
        emittedEvents,
        allowlistCheck: {
          allowed: true,
          domain,
          resolvedIP: ipCheck.resolvedIP,
        },
      };
    } catch (error: any) {
      // Emit: AuditFailed
      if (this.eventBus) {
        const failedEvent = createBrowserEvent(
          "AuditFailed",
          "BrowserAgentWrapper",
          {
            url: params.url,
            domain,
            error: error.message,
            callerId: params.callerId,
          },
          correlationId
        );
        this.eventBus.publish(failedEvent);
        emittedEvents.push(failedEvent.id);
      }

      return {
        success: false,
        error: error.message,
        correlationId,
        emittedEvents,
        allowlistCheck: {
          allowed: true,
          domain,
          resolvedIP: ipCheck.resolvedIP,
        },
      };
    }
  }

  /**
   * Add a domain to the allowlist
   */
  addAllowedDomain(domain: string): void {
    const allowlist = getDomainAllowlist();
    allowlist.addAllowedDomain(domain);
  }

  /**
   * Remove a domain from the allowlist
   */
  removeAllowedDomain(domain: string): void {
    const allowlist = getDomainAllowlist();
    allowlist.removeAllowedDomain(domain);
  }

  /**
   * List all allowed domains
   */
  listAllowedDomains(): string[] {
    const allowlist = getDomainAllowlist();
    return allowlist.listAllowedDomains();
  }

  /**
   * Get wrapper status
   */
  getStatus(): {
    activeSessions: number;
    queuedRequests: number;
    allowlistSize: number;
    timestamp: number;
  } {
    const allowlist = getDomainAllowlist();
    return {
      activeSessions: 0, // Phase I: not tracking sessions yet
      queuedRequests: 0, // Phase I: not queuing yet
      allowlistSize: allowlist.getDomainCount(),
      timestamp: Date.now(),
    };
  }
}

