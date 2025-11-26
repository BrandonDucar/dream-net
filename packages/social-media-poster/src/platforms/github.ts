/**
 * GitHub Platform Integration
 * Uses official @octokit/rest SDK
 * Posts to: Issues, Discussions, Gists, Releases, README updates
 */

import { Octokit } from "@octokit/rest";

export interface GitHubPostOptions {
  type: "issue" | "discussion" | "gist" | "release" | "readme";
  repository?: string; // owner/repo format
  title?: string;
  content: string;
  labels?: string[];
  category?: string; // For discussions
  tag?: string; // For releases
  filename?: string; // For gists
}

export interface GitHubConfig {
  token: string;
  owner?: string; // Default repository owner
  defaultRepo?: string; // Default repository
}

export class GitHubPoster {
  private config: GitHubConfig;
  private octokit: Octokit;

  constructor(config: GitHubConfig) {
    this.config = config;
    this.octokit = new Octokit({
      auth: config.token,
    });
  }

  async post(options: GitHubPostOptions): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      switch (options.type) {
        case "issue":
          return await this.createIssue(options);
        case "discussion":
          return await this.createDiscussion(options);
        case "gist":
          return await this.createGist(options);
        case "release":
          return await this.createRelease(options);
        case "readme":
          return await this.updateReadme(options);
        default:
          return { success: false, error: `Unknown post type: ${options.type}` };
      }
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  private async createIssue(
    options: GitHubPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const repo = options.repository || `${this.config.owner}/${this.config.defaultRepo}`;
    if (!repo) {
      return { success: false, error: "Repository required for issues" };
    }

    const [owner, repoName] = repo.split("/");
    if (!owner || !repoName) {
      return { success: false, error: "Invalid repository format. Use owner/repo" };
    }

    try {
      const response = await this.octokit.rest.issues.create({
        owner,
        repo: repoName,
        title: options.title || "DreamNet Update",
        body: options.content,
        labels: options.labels || ["dreamnet", "automated"],
      });

      return {
        success: true,
        url: response.data.html_url,
      };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  private async createDiscussion(
    options: GitHubPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const repo = options.repository || `${this.config.owner}/${this.config.defaultRepo}`;
    if (!repo) {
      return { success: false, error: "Repository required for discussions" };
    }

    const [owner, repoName] = repo.split("/");
    if (!owner || !repoName) {
      return { success: false, error: "Invalid repository format. Use owner/repo" };
    }

    try {
      const response = await this.octokit.rest.discussions.create({
        owner,
        repo: repoName,
        title: options.title || "DreamNet Discussion",
        body: options.content,
        category: options.category || "general",
      });

      return {
        success: true,
        url: response.data.html_url,
      };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  private async createGist(
    options: GitHubPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const filename = options.filename || "dreamnet-update.md";

    try {
      const response = await this.octokit.rest.gists.create({
        description: options.title || "DreamNet Update",
        public: true,
        files: {
          [filename]: {
            content: options.content,
          },
        },
      });

      return {
        success: true,
        url: response.data.html_url,
      };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  private async createRelease(
    options: GitHubPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const repo = options.repository || `${this.config.owner}/${this.config.defaultRepo}`;
    if (!repo) {
      return { success: false, error: "Repository required for releases" };
    }

    const [owner, repoName] = repo.split("/");
    if (!owner || !repoName) {
      return { success: false, error: "Invalid repository format. Use owner/repo" };
    }

    try {
      const response = await this.octokit.rest.repos.createRelease({
        owner,
        repo: repoName,
        tag_name: options.tag || `v${Date.now()}`,
        name: options.title || "DreamNet Release",
        body: options.content,
        draft: false,
        prerelease: false,
      });

      return {
        success: true,
        url: response.data.html_url,
      };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  private async updateReadme(
    options: GitHubPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const repo = options.repository || `${this.config.owner}/${this.config.defaultRepo}`;
    if (!repo) {
      return { success: false, error: "Repository required for README updates" };
    }

    const [owner, repoName] = repo.split("/");
    if (!owner || !repoName) {
      return { success: false, error: "Invalid repository format. Use owner/repo" };
    }

    try {
      // Get current README
      const readmeResponse = await this.octokit.rest.repos.getContent({
        owner,
        repo: repoName,
        path: "README.md",
      });

      if (Array.isArray(readmeResponse.data) || readmeResponse.data.type !== "file") {
        return { success: false, error: "README.md not found or is not a file" };
      }

      const currentSha = readmeResponse.data.sha;
      const currentContent = Buffer.from(readmeResponse.data.content, "base64").toString("utf-8");

      // Append new content
      const newContent = `${currentContent}\n\n---\n\n## ${new Date().toISOString()}\n\n${options.content}`;
      const encodedContent = Buffer.from(newContent).toString("base64");

      // Update README
      const updateResponse = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: "README.md",
        message: options.title || "Update README",
        content: encodedContent,
        sha: currentSha,
      });

      return {
        success: true,
        url: updateResponse.data.content?.html_url || `https://github.com/${owner}/${repoName}`,
      };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }
}

