/**
 * Google Agent Starter Pack Integration
 * Connects DreamNet to Google Cloud Platform's Agent Starter Pack
 * 
 * GitHub: https://github.com/GoogleCloudPlatform/agent-starter-pack
 * Docs: https://googlecloudplatform.github.io/agent-starter-pack/
 */

interface GoogleAgentRequest {
  task: string;
  agent_type?: 'react' | 'rag' | 'multi-agent' | 'live-api';
  context?: Record<string, unknown>;
}

interface GoogleAgentResponse {
  success: boolean;
  result: unknown;
  agent: string;
  metadata?: Record<string, unknown>;
}

export class GoogleAgentStarterPackClient {
  private baseUrl: string;
  private initialized: boolean = false;

  constructor(baseUrl?: string) {
    // Get from env or use default Cloud Run URL
    this.baseUrl = baseUrl || process.env.GOOGLE_AGENT_STARTER_PACK_URL || '';
    
    if (!this.baseUrl) {
      console.warn('[Google Agent Starter Pack] No URL configured. Set GOOGLE_AGENT_STARTER_PACK_URL');
    } else {
      this.initialized = true;
    }
  }

  /**
   * Check if client is configured
   */
  isConfigured(): boolean {
    return this.initialized && !!this.baseUrl;
  }

  /**
   * Execute task with Google Agent Starter Pack
   */
  async executeTask(request: GoogleAgentRequest): Promise<GoogleAgentResponse> {
    if (!this.isConfigured()) {
      throw new Error('Google Agent Starter Pack not configured. Set GOOGLE_AGENT_STARTER_PACK_URL');
    }

    try {
      const response = await fetch(`${this.baseUrl}/dreamnet/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: request.task,
          agent_type: request.agent_type || 'react',
          context: request.context || {}
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Agent Starter Pack error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('[Google Agent Starter Pack] Execution failed:', error);
      throw new Error(`Failed to execute with Agent Starter Pack: ${error.message}`);
    }
  }

  /**
   * Use ReAct agent template (Reasoning + Acting)
   */
  async reactAgent(task: string, context?: Record<string, unknown>): Promise<GoogleAgentResponse> {
    return this.executeTask({
      task,
      agent_type: 'react',
      context
    });
  }

  /**
   * Use RAG agent template (Retrieval-Augmented Generation)
   */
  async ragAgent(task: string, context?: Record<string, unknown>): Promise<GoogleAgentResponse> {
    return this.executeTask({
      task,
      agent_type: 'rag',
      context
    });
  }

  /**
   * Use multi-agent template (Multiple agents working together)
   */
  async multiAgent(task: string, context?: Record<string, unknown>): Promise<GoogleAgentResponse> {
    return this.executeTask({
      task,
      agent_type: 'multi-agent',
      context
    });
  }

  /**
   * Use live API agent template (Real-time API integration)
   */
  async liveApiAgent(task: string, context?: Record<string, unknown>): Promise<GoogleAgentResponse> {
    return this.executeTask({
      task,
      agent_type: 'live-api',
      context
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const googleAgentStarterPack = new GoogleAgentStarterPackClient();

