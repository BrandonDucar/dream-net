import axios from "axios";

/**
 * 📊 Linear Agent Client
 * Connects DreamNet agents to Linear for project management.
 */
export class LinearAgentClient {
    private apiKey: string;
    private baseUrl = "https://api.linear.app/graphql";

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.LINEAR_API_KEY || "";
    }

    async query(query: string, variables?: any): Promise<any> {
        if (!this.apiKey) {
            console.error("❌ [Linear] API Key missing.");
            throw new Error("Linear API key not configured");
        }

        const response = await axios.post(
            this.baseUrl,
            { query, variables },
            {
                headers: {
                    "Authorization": this.apiKey,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.data;
    }

    async getAssignedIssues(): Promise<any[]> {
        const query = `
            query {
                viewer {
                    assignedIssues {
                        nodes {
                            id
                            identifier
                            title
                            description
                            status { name }
                        }
                    }
                }
            }
        `;
        const data = await this.query(query);
        return data?.viewer?.assignedIssues?.nodes || [];
    }

    async createIssue(teamId: string, title: string, description: string): Promise<any> {
        const query = `
            mutation IssueCreate($teamId: String!, $title: String!, $description: String) {
                issueCreate(input: { teamId: $teamId, title: $title, description: $description }) {
                    success
                    issue {
                        id
                        identifier
                        url
                    }
                }
            }
        `;
        const data = await this.query(query, { teamId, title, description });
        return data?.issueCreate?.issue;
    }
}

export const linearClient = new LinearAgentClient();
