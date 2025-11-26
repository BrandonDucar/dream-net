/**
 * Telegram Integration
 *
 * Telegram bot setup
 * Channel management (#ops-log, #announcements, #community)
 * Message schemas (Ops Cards, Incidents, Content Threads)
 * Command handling (/goal, /brief.dev, /deploy, /announce, /snapshot)
 * DM routing to BrainHub
 */
export interface TelegramMessage {
    id: string;
    chatId: string;
    text: string;
    type: "ops-card" | "incident" | "content-thread" | "command" | "dm";
    timestamp: string;
}
export declare class TelegramIntegration {
    private botToken?;
    private messages;
    constructor(botToken?: string);
    /**
     * Send message to Telegram channel
     */
    sendMessage(chatId: string, text: string, parseMode?: "HTML" | "Markdown"): Promise<boolean>;
    /**
     * Send Ops Card to #ops-log
     */
    sendOpsCard(title: string, status: "✅" | "⚠️" | "❌", details: string, url?: string): Promise<boolean>;
    /**
     * Send Incident alert
     */
    sendIncident(service: string, severity: "low" | "medium" | "high" | "critical", message: string, logUrl?: string): Promise<boolean>;
    /**
     * Send Content Thread
     */
    sendContentThread(title: string, content: string, platforms: string[], utmTags?: Record<string, string>): Promise<boolean>;
    /**
     * Handle command from Telegram
     */
    handleCommand(command: string, args: string[], userId: string): Promise<string>;
    /**
     * Route DM to BrainHub
     */
    routeDMToBrainHub(message: string, userId: string): Promise<void>;
}
export default TelegramIntegration;
