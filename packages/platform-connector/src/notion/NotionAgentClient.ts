import axios from "axios";

/**
 * 📓 Notion Agent Client
 * Connects DreamNet agents to Notion.
 * Used for state management, task tracking, and "Five Agents" sync.
 */
export class NotionAgentClient {
    private apiKey: string;
    private version = "2022-06-28";

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.NOTION_API_KEY || "";
    }

    private get headers() {
        return {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "Notion-Version": this.version
        };
    }

    async getDatabase(databaseId: string): Promise<any> {
        const response = await axios.post(
            `https://api.notion.com/v1/databases/${databaseId}/query`,
            {},
            { headers: this.headers }
        );
        return response.data.results;
    }

    async createPage(parentDatabaseId: string, properties: any): Promise<any> {
        const response = await axios.post(
            "https://api.notion.com/v1/pages",
            {
                parent: { database_id: parentDatabaseId },
                properties
            },
            { headers: this.headers }
        );
        return response.data;
    }

    async updatePage(pageId: string, properties: any): Promise<any> {
        const response = await axios.patch(
            `https://api.notion.com/v1/pages/${pageId}`,
            { properties },
            { headers: this.headers }
        );
        return response.data;
    }
}

export const notionClient = new NotionAgentClient();
