/**
 * Notion Platform Integration
 * Posts to: Pages, Databases
 */

import { Client } from "@notionhq/client";

export interface NotionPostOptions {
  type: "page" | "database";
  parentId?: string; // Parent page or database ID
  title: string;
  content: string;
  properties?: Record<string, any>; // For database entries
}

export interface NotionConfig {
  token: string;
  defaultDatabaseId?: string; // Default database for posts
  defaultPageId?: string; // Default parent page
}

export class NotionPoster {
  private client: Client;
  private config: NotionConfig;

  constructor(config: NotionConfig) {
    this.config = config;
    this.client = new Client({ auth: config.token });
  }

  async post(options: NotionPostOptions): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      switch (options.type) {
        case "page":
          return await this.createPage(options);
        case "database":
          return await this.createDatabaseEntry(options);
        default:
          return { success: false, error: `Unknown post type: ${options.type}` };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async createPage(
    options: NotionPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const parentId = options.parentId || this.config.defaultPageId;
    if (!parentId) {
      return { success: false, error: "Parent page ID required" };
    }

    // Convert markdown content to Notion blocks
    const blocks = this.markdownToBlocks(options.content);

    const response = await this.client.pages.create({
      parent: {
        page_id: parentId,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: options.title,
              },
            },
          ],
        },
      },
      children: blocks,
    });

    return {
      success: true,
      url: response.url,
    };
  }

  private async createDatabaseEntry(
    options: NotionPostOptions
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const databaseId = options.parentId || this.config.defaultDatabaseId;
    if (!databaseId) {
      return { success: false, error: "Database ID required" };
    }

    // Convert content to Notion blocks
    const blocks = this.markdownToBlocks(options.content);

    const properties: Record<string, any> = {
      Name: {
        title: [
          {
            text: {
              content: options.title,
            },
          },
        ],
      },
      ...options.properties,
    };

    const response = await this.client.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties,
      children: blocks,
    });

    return {
      success: true,
      url: response.url,
    };
  }

  private markdownToBlocks(markdown: string): any[] {
    // Simple markdown to Notion blocks converter
    // For production, use a proper markdown parser
    const lines = markdown.split("\n");
    const blocks: any[] = [];

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }

      // Headers
      if (line.startsWith("# ")) {
        blocks.push({
          object: "block",
          type: "heading_1",
          heading_1: {
            rich_text: [{ type: "text", text: { content: line.substring(2) } }],
          },
        });
      } else if (line.startsWith("## ")) {
        blocks.push({
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: line.substring(3) } }],
          },
        });
      } else if (line.startsWith("### ")) {
        blocks.push({
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: [{ type: "text", text: { content: line.substring(4) } }],
          },
        });
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        // Bullet list
        blocks.push({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [{ type: "text", text: { content: line.substring(2) } }],
          },
        });
      } else {
        // Regular paragraph
        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: line } }],
          },
        });
      }
    }

    return blocks;
  }
}

