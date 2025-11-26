/**
 * Telegram Integration
 *
 * Telegram bot setup
 * Channel management (#ops-log, #announcements, #community)
 * Message schemas (Ops Cards, Incidents, Content Threads)
 * Command handling (/goal, /brief.dev, /deploy, /announce, /snapshot)
 * DM routing to BrainHub
 */
export class TelegramIntegration {
    botToken;
    messages = [];
    constructor(botToken) {
        this.botToken = botToken || process.env.TELEGRAM_BOT_TOKEN;
    }
    /**
     * Send message to Telegram channel
     */
    async sendMessage(chatId, text, parseMode = "Markdown") {
        if (!this.botToken) {
            console.warn("[Telegram] Bot token not configured");
            return false;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text,
                    parse_mode: parseMode,
                }),
            });
            if (!response.ok) {
                throw new Error(`Telegram API error: ${response.statusText}`);
            }
            return true;
        }
        catch (error) {
            console.error(`[Telegram] Failed to send message:`, error);
            return false;
        }
    }
    /**
     * Send Ops Card to #ops-log
     */
    async sendOpsCard(title, status, details, url) {
        const chatId = process.env.TELEGRAM_OPS_LOG_CHAT_ID || "";
        const text = `**${title}** ${status}\n\n${details}${url ? `\n\n${url}` : ""}`;
        return this.sendMessage(chatId, text);
    }
    /**
     * Send Incident alert
     */
    async sendIncident(service, severity, message, logUrl) {
        const emoji = severity === "critical" ? "🔴" : severity === "high" ? "🟠" : "🟡";
        const chatId = process.env.TELEGRAM_OPS_LOG_CHAT_ID || "";
        const text = `${emoji} **ALERT** ${severity.toUpperCase()}\n\n**Service:** ${service}\n**Message:** ${message}${logUrl ? `\n\nLog: ${logUrl}` : ""}`;
        return this.sendMessage(chatId, text);
    }
    /**
     * Send Content Thread
     */
    async sendContentThread(title, content, platforms, utmTags) {
        const chatId = process.env.TELEGRAM_ANNOUNCEMENTS_CHAT_ID || "";
        const utmString = utmTags
            ? Object.entries(utmTags)
                .map(([k, v]) => `${k}=${v}`)
                .join("&")
            : "";
        const text = `🧵 **${title}**\n\n${content}\n\n**Platforms:** ${platforms.join(", ")}${utmString ? `\n\nUTM: ${utmString}` : ""}`;
        return this.sendMessage(chatId, text);
    }
    /**
     * Handle command from Telegram
     */
    async handleCommand(command, args, userId) {
        switch (command) {
            case "/goal":
                // TODO: Route to BrainHub
                return "Goal received, routing to BrainHub...";
            case "/brief.dev":
                // TODO: Create dev brief
                return "Dev brief created, sending to Cursor...";
            case "/deploy":
                // TODO: Trigger deployment
                return "Deployment triggered...";
            case "/announce":
                // TODO: Create announcement
                return "Announcement scheduled...";
            case "/snapshot":
                // TODO: Create memory snapshot
                return "Snapshot created...";
            default:
                return "Unknown command. Available: /goal, /brief.dev, /deploy, /announce, /snapshot";
        }
    }
    /**
     * Route DM to BrainHub
     */
    async routeDMToBrainHub(message, userId) {
        // TODO: Send to BrainHub for processing
        console.log(`[Telegram] Routing DM from ${userId} to BrainHub: ${message}`);
    }
}
export default TelegramIntegration;
