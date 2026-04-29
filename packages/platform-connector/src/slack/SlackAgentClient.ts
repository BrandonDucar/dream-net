import axios from "axios";

/**
 * 💬 Slack Agent Client
 * Connects DreamNet agents to Slack for comms.
 */
export class SlackAgentClient {
    private token: string;

    constructor(token?: string) {
        this.token = token || process.env.SLACK_TOKEN || "";
    }

    async postMessage(channelId: string, text: string): Promise<any> {
        if (!this.token) {
            console.error("❌ [Slack] Token missing.");
            throw new Error("Slack token not configured");
        }

        const response = await axios.post(
            "https://slack.com/api/chat.postMessage",
            { channel: channelId, text },
            {
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    }

    async listChannels(): Promise<any[]> {
        const response = await axios.get("https://slack.com/api/conversations.list", {
            headers: { "Authorization": `Bearer ${this.token}` }
        });
        return response.data.channels || [];
    }
}

export const slackClient = new SlackAgentClient();
