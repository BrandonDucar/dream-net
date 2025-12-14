/**
 * SuperAGI Marketplace Integration
 * 
 * Integrates SuperAGI agent marketplace patterns for DreamNet Agent Foundry vertical
 */

import axios, { AxiosInstance } from "axios";

export interface SuperAGIConfig {
  apiUrl?: string;
  apiKey?: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tools: string[];
  config: Record<string, any>;
  author: string;
  downloads: number;
  rating?: number;
}

export interface AgentInstance {
  id: string;
  templateId: string;
  name: string;
  status: "running" | "stopped" | "error";
  createdAt: number;
  config: Record<string, any>;
}

/**
 * SuperAGI Marketplace Client
 * 
 * Wraps SuperAGI marketplace patterns for agent discovery and deployment
 */
export class SuperAGIMarketplace {
  private client: AxiosInstance;
  private config: SuperAGIConfig;

  constructor(config: SuperAGIConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || "https://api.superagi.com",
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.apiUrl,
      headers: {
        Authorization: this.config.apiKey ? `Bearer ${this.config.apiKey}` : undefined,
      },
    });
  }

  /**
   * Browse agent templates
   */
  async browseTemplates(
    category?: string,
    limit: number = 20
  ): Promise<AgentTemplate[]> {
    try {
      const params: any = { limit };
      if (category) params.category = category;

      const response = await this.client.get("/agents/templates", { params });
      return response.data || [];
    } catch (error: any) {
      console.error("[SuperAGIMarketplace] Failed to browse templates:", error.message);
      return [];
    }
  }

  /**
   * Get agent template by ID
   */
  async getTemplate(templateId: string): Promise<AgentTemplate | null> {
    try {
      const response = await this.client.get(`/agents/templates/${templateId}`);
      return response.data || null;
    } catch (error: any) {
      console.error("[SuperAGIMarketplace] Failed to get template:", error.message);
      return null;
    }
  }

  /**
   * Deploy agent from template
   */
  async deployAgent(
    templateId: string,
    config: Record<string, any>
  ): Promise<{ success: boolean; agentId?: string; error?: string }> {
    try {
      const response = await this.client.post("/agents/deploy", {
        templateId,
        config,
      });

      return {
        success: true,
        agentId: response.data.agentId,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * List deployed agents
   */
  async listAgents(): Promise<AgentInstance[]> {
    try {
      const response = await this.client.get("/agents");
      return response.data || [];
    } catch (error: any) {
      console.error("[SuperAGIMarketplace] Failed to list agents:", error.message);
      return [];
    }
  }

  /**
   * Publish agent template
   */
  async publishTemplate(
    template: Omit<AgentTemplate, "id" | "downloads" | "rating">
  ): Promise<{ success: boolean; templateId?: string; error?: string }> {
    try {
      const response = await this.client.post("/agents/templates", template);
      return {
        success: true,
        templateId: response.data.templateId,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

