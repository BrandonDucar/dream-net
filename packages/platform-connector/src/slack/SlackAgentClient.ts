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

    async addReaction(channelId: string, timestamp: string, name: string): Promise<any> {
        const response = await axios.post(
            "https://slack.com/api/reactions.add",
            { channel: channelId, timestamp, name },
            {
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    }

    async uploadFile(channels: string, content: string, filename: string): Promise<any> {
        const response = await axios.post(
            "https://slack.com/api/files.upload",
            { channels, content, filename },
            {
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        return response.data;
    }
}

export const slackClient = new SlackAgentClient();
