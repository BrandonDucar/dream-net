/**
 * Auto-Record Operational Events in Dream Snail
 * Biomimetic: All events leave a trail
 */
import type { OperationalEvent } from "@dreamnet/dreamnet-operational-bridge/logic/spiderWebBridge";
/**
 * Auto-record operational events in Dream Snail
 */
export declare function autoRecordOperationalEvent(event: OperationalEvent, identityId: string): void;
/**
 * Auto-record audit events in Dream Snail
 */
export declare function autoRecordAuditEvent(action: string, identityId: string, metadata?: Record<string, any>): void;
/**
 * Auto-record passport actions in Dream Snail
 */
export declare function autoRecordPassportAction(action: "issued" | "upgraded" | "revoked", identityId: string, tier?: string): void;
