/**
 * Ohara AI Client Integration
 * 
 * Connects to Ohara AI platform to fetch and manage mini-apps
 * 
 * Usage:
 *   import { OharaClient } from './integrations/oharaClient';
 *   const client = new OharaClient(apiKey);
 *   const apps = await client.listApps();
 */

interface OharaApp {
  id: string;
  name: string;
  description?: string;
  code?: string;
  config?: any;
  createdAt?: string;
  updatedAt?: string;
  status?: 'draft' | 'published' | 'archived';
}

interface OharaApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class OharaClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || process.env.OHARA_API_KEY || '';
    this.baseUrl = baseUrl || process.env.OHARA_API_URL || 'https://api.ohara.ai';
  }

  /**
   * Verify API connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * List all apps
   */
  async listApps(): Promise<OharaApp[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/apps`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Ohara API error: ${response.status}`);
      }

      const data: OharaApiResponse<{ apps: OharaApp[] }> = await response.json();
      return data.data?.apps || [];
    } catch (error: any) {
      console.error('Failed to fetch Ohara apps:', error.message);
      throw error;
    }
  }

  /**
   * Get specific app
   */
  async getApp(appId: string): Promise<OharaApp | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/apps/${appId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Ohara API error: ${response.status}`);
      }

      const data: OharaApiResponse<OharaApp> = await response.json();
      return data.data || null;
    } catch (error: any) {
      console.error(`Failed to fetch app ${appId}:`, error.message);
      throw error;
    }
  }

  /**
   * Export app code
   */
  async exportApp(appId: string): Promise<{ code: string; config: any } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/apps/${appId}/export`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Ohara API error: ${response.status}`);
      }

      const data: OharaApiResponse<{ code: string; config: any }> = await response.json();
      return data.data || null;
    } catch (error: any) {
      console.error(`Failed to export app ${appId}:`, error.message);
      throw error;
    }
  }

  /**
   * Create app in Ohara (if needed)
   */
  async createApp(name: string, description?: string): Promise<OharaApp | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/apps`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description
        })
      });

      if (!response.ok) {
        throw new Error(`Ohara API error: ${response.status}`);
      }

      const data: OharaApiResponse<OharaApp> = await response.json();
      return data.data || null;
    } catch (error: any) {
      console.error('Failed to create app:', error.message);
      throw error;
    }
  }

  /**
   * Update app in Ohara
   */
  async updateApp(appId: string, updates: Partial<OharaApp>): Promise<OharaApp | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/apps/${appId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Ohara API error: ${response.status}`);
      }

      const data: OharaApiResponse<OharaApp> = await response.json();
      return data.data || null;
    } catch (error: any) {
      console.error(`Failed to update app ${appId}:`, error.message);
      throw error;
    }
  }
}

/**
 * Default client instance
 */
export const oharaClient = new OharaClient();

