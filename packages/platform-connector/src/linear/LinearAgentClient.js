import axios from "axios";
/**
 * 📊 Linear Agent Client
 * Connects DreamNet agents to Linear for project management.
 */
export class LinearAgentClient {
    apiKey;
    baseUrl = "https://api.linear.app/graphql";
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.LINEAR_API_KEY || "";
    }
    async query(query, variables) {
        if (!this.apiKey) {
            console.error("❌ [Linear] API Key missing.");
            throw new Error("Linear API key not configured");
        }
        const response = await axios.post(this.baseUrl, { query, variables }, {
            headers: {
                "Authorization": this.apiKey,
                "Content-Type": "application/json"
            }
        });
        return response.data.data;
    }
    async getAssignedIssues() {
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
    async createIssue(teamId, title, description) {
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
    async getTeams() {
        const query = `
            query {
                teams {
                    nodes {
                        id
                        name
                        key
                    }
                }
            }
        `;
        const data = await this.query(query);
        return data?.teams?.nodes || [];
    }
    async updateIssue(issueId, input) {
        const query = `
            mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
                issueUpdate(id: $id, input: $input) {
                    success
                    issue {
                        id
                        status { name }
                    }
                }
            }
        `;
        const data = await this.query(query, { id: issueId, input });
        return data?.issueUpdate?.issue;
    }
}
export const linearClient = new LinearAgentClient();
//# sourceMappingURL=LinearAgentClient.js.map