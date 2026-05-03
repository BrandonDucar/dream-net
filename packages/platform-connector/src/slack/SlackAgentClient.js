import axios from "axios";
/**
 * 💬 Slack Agent Client
 * Connects DreamNet agents to Slack for comms.
 */
export class SlackAgentClient {
    token;
    constructor(token) {
        this.token = token || process.env.SLACK_TOKEN || "";
    }
    async postMessage(channelId, text) {
        if (!this.token) {
            console.error("❌ [Slack] Token missing.");
            throw new Error("Slack token not configured");
        }
        const response = await axios.post("https://slack.com/api/chat.postMessage", { channel: channelId, text }, {
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    }
    async addReaction(channelId, timestamp, name) {
        const response = await axios.post("https://slack.com/api/reactions.add", { channel: channelId, timestamp, name }, {
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    }
    async uploadFile(channels, content, filename) {
        const response = await axios.post("https://slack.com/api/files.upload", { channels, content, filename }, {
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return response.data;
    }
}
export const slackClient = new SlackAgentClient();
//# sourceMappingURL=SlackAgentClient.js.map