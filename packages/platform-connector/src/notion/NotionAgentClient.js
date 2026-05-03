import axios from "axios";
/**
 * 📓 Notion Agent Client
 * Connects DreamNet agents to Notion.
 * Used for state management, task tracking, and "Five Agents" sync.
 */
export class NotionAgentClient {
    apiKey;
    version = "2022-06-28";
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.NOTION_API_KEY || "";
    }
    get headers() {
        return {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "Notion-Version": this.version
        };
    }
    async getDatabase(databaseId) {
        const response = await axios.post(`https://api.notion.com/v1/databases/${databaseId}/query`, {}, { headers: this.headers });
        return response.data.results;
    }
    async createPage(parentDatabaseId, properties) {
        const response = await axios.post("https://api.notion.com/v1/pages", {
            parent: { database_id: parentDatabaseId },
            properties
        }, { headers: this.headers });
        return response.data;
    }
    async getPage(pageId) {
        const response = await axios.get(`https://api.notion.com/v1/pages/${pageId}`, { headers: this.headers });
        return response.data;
    }
    async updatePage(pageId, properties) {
        const response = await axios.patch(`https://api.notion.com/v1/pages/${pageId}`, { properties }, { headers: this.headers });
        return response.data;
    }
    async appendBlock(blockId, children) {
        const response = await axios.patch(`https://api.notion.com/v1/blocks/${blockId}/children`, { children }, { headers: this.headers });
        return response.data;
    }
}
export const notionClient = new NotionAgentClient();
//# sourceMappingURL=NotionAgentClient.js.map