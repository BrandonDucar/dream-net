/**
 * Message Router
 * Filters and routes Spider Web events to Twilio SMS
 * Only sends important messages (not spam)
 */
import type { OperationalEvent } from "@dreamnet/shared";
/**
 * Route operational event to SMS
 */
export declare function routeEventToSMS(event: OperationalEvent): Promise<{
    sent: boolean;
    reason?: string;
}>;
/**
 * Get message statistics
 */
export declare function getMessageStats(): {
    messagesLastHour: number;
    messagesLastDay: number;
    totalMessages: number;
    rateLimit: number;
};
//# sourceMappingURL=messageRouter.d.ts.map