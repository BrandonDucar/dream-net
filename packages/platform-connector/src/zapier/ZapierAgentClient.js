import axios from "axios";
/**
 * ⚡ Zapier Agent Client
 * Connects DreamNet agents to Zapier for cross-app automation.
 */
export class ZapierAgentClient {
    async triggerWebhook(webhookUrl, payload) {
        console.log(`⚡ [Zapier] Triggering automation with payload...`);
        const response = await axios.post(webhookUrl, payload);
        return response.data;
    }
}
export const zapierClient = new ZapierAgentClient();
//# sourceMappingURL=ZapierAgentClient.js.map