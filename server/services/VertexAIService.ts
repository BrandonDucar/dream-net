import axios from 'axios';
import { NERVE_BUS } from '@dreamnet/nerve';
import { GoogleAuth } from 'google-auth-library';

export class VertexAIService {
  private static instance: VertexAIService;
  private projectId: string;
  private location: string;
  private modelId: string;
  private auth: GoogleAuth;
  private cachedToken: string | null = null;
  private tokenExpiry: number = 0;

  private constructor() {
    this.projectId = process.env.GCP_PROJECT_ID || 'aqueous-tube-470317-m6';
    this.location = process.env.GCP_LOCATION || 'us-central1';
    this.modelId = process.env.VERTEX_AI_MODEL || 'gemini-1.5-pro';
    
    // Initialize GoogleAuth for seamless production deployment
    this.auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
      projectId: this.projectId,
    });
  }

  public static getInstance(): VertexAIService {
    if (!VertexAIService.instance) {
      VertexAIService.instance = new VertexAIService();
    }
    return VertexAIService.instance;
  }

  /**
   * Initialize the service
   */
  public async initialize(): Promise<void> {
    console.log(`🧠 [Vertex AI] Initializing for project ${this.projectId} in ${this.location}...`);
    try {
        // Test auth by fetching project ID
        await this.auth.getProjectId();
        console.log('✅ [Vertex AI] Service ready and authenticated');
    } catch (e) {
        console.warn('⚠️ [Vertex AI] Auth check failed, but service is ready for fallback inference:', e);
    }
  }

  /**
   * Helper to fetch the current access token
   */
  private async getAccessToken(): Promise<string | null> {
    if (this.cachedToken && Date.now() < this.tokenExpiry) {
        return this.cachedToken;
    }

    try {
        const client = await this.auth.getClient();
        const tokenResp = await client.getAccessToken();
        
        if (tokenResp.token) {
            this.cachedToken = tokenResp.token;
            this.tokenExpiry = Date.now() + 3000 * 1000; // Cache for 50 minutes
            return this.cachedToken;
        }
    } catch (error) {
        console.warn('⚠️ [Vertex AI] Failed to fetch access token:', error);
    }
    return null;
  }

  /**
   * Generate content using Gemini via Vertex AI REST API
   */
  public async generateContent(prompt: string, systemInstruction?: string): Promise<string> {
    const url = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.modelId}:generateContent`;

    try {
      const token = await this.getAccessToken();
      if (!token && !process.env.GCP_ACCESS_TOKEN) {
        console.warn('⚠️ [Vertex AI] No access token provided. Attempting to use local environment default...');
      }

      const activeToken = token || process.env.GCP_ACCESS_TOKEN;

      const response = await axios.post(
        url,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          systemInstruction: systemInstruction ? {
            parts: [{ text: systemInstruction }]
          } : undefined,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || 'No response from Vertex AI';

    } catch (error: any) {
      console.error('❌ [Vertex AI] Inference failed:', error.response?.data || error.message);
      
      // Stub fallback if real API fails during "Boot Recovery"
      if (process.env.STUB_AI === 'true' || !process.env.GCP_PROJECT_ID) {
        console.log('🔮 [Vertex AI] Falling back to heuristic stub...');
        return this.getHeuristicResponse(prompt);
      }
      
      throw error;
    }
  }

  /**
   * Heuristic fallback for when API is unavailable
   */
  private getHeuristicResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('status')) return 'System health: Optimal. All neural pathways clear.';
    if (lowerPrompt.includes('arya')) return 'The Faceless One awaits her task. The list is long, but justice is certain.';
    return `[Heuristic Mode] DreamNet has processed your request: "${prompt}". Logic integration pending.`;
  }

  /**
   * Set access token manually if needed (Legacy / Test override)
   */
  public setAccessToken(token: string): void {
    this.cachedToken = token;
    this.tokenExpiry = Date.now() + 3000 * 1000;
  }
}

export const vertexAIService = VertexAIService.getInstance();
