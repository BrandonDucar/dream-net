/**
 * GitHub Integration
 * 
 * Create issues, check PRs, manage projects
 */

export interface GitHubIssue {
  title: string;
  body: string;
  labels?: string[];
  assignees?: string[];
}

export interface GitHubPR {
  number: number;
  title: string;
  state: "open" | "closed" | "merged";
  labels: string[];
  readyForDeploy: boolean;
}

export class GitHubIntegration {
  private token?: string;
  private owner: string;
  private repo: string;
  private baseUrl = "https://api.github.com";

  constructor(token?: string, owner: string = "dreamnet", repo: string = "dream-net") {
    this.token = token || process.env.GITHUB_TOKEN;
    this.owner = owner;
    this.repo = repo;
  }

  /**
   * Create a GitHub issue from a Dev Brief
   */
  async createIssue(issue: GitHubIssue): Promise<{ number: number; url: string }> {
    if (!this.token) {
      console.warn("[GitHub] Token not configured, skipping issue creation");
      return { number: 0, url: "" };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${this.owner}/${this.repo}/issues`,
        {
          method: "POST",
          headers: {
            "Authorization": `token ${this.token}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: issue.title,
            body: issue.body,
            labels: issue.labels || ["dreamops", "dev-brief"],
            assignees: issue.assignees || [],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data = await response.json() as { number: number; html_url: string };
      console.log(`[GitHub] Created issue #${data.number}: ${issue.title}`);
      return { number: data.number, url: data.html_url };
    } catch (error: any) {
      console.error(`[GitHub] Failed to create issue:`, error);
      throw error;
    }
  }

  /**
   * Get PR by number
   */
  async getPR(prNumber: number): Promise<GitHubPR | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${this.owner}/${this.repo}/pulls/${prNumber}`,
        {
          headers: {
            "Authorization": `token ${this.token}`,
            "Accept": "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json() as {
        number: number;
        title: string;
        state: string;
        labels: Array<{ name: string }>;
      };

      return {
        number: data.number,
        title: data.title,
        state: data.state as "open" | "closed" | "merged",
        labels: data.labels.map((l) => l.name),
        readyForDeploy: data.labels.some((l) => l.name === "ready-for-deploy"),
      };
    } catch (error: any) {
      console.error(`[GitHub] Failed to get PR:`, error);
      return null;
    }
  }

  /**
   * Check if PR is ready for deployment
   */
  async isPRReadyForDeploy(prNumber: number): Promise<boolean> {
    const pr = await this.getPR(prNumber);
    return pr?.readyForDeploy || false;
  }

  /**
   * Add label to PR
   */
  async addLabelToPR(prNumber: number, label: string): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${this.owner}/${this.repo}/issues/${prNumber}/labels`,
        {
          method: "POST",
          headers: {
            "Authorization": `token ${this.token}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ labels: [label] }),
        }
      );

      return response.ok;
    } catch (error: any) {
      console.error(`[GitHub] Failed to add label:`, error);
      return false;
    }
  }
}

export default GitHubIntegration;

