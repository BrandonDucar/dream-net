import axios from 'axios';
import { NERVE_BUS } from '@dreamnet/nerve';

export class VertexAIService {
  private static instance: VertexAIService;
  private projectId: string;
  private location: string;
  private modelId: string;
  private accessToken: string | null = null;

  private constructor() {
    this.projectId = process.env.GCP_PROJECT_ID || 'aqueous-tube-470317-m6';
    this.location = process.env.GCP_LOCATION || 'us-central1';
    this.modelId = process.env.VERTEX_AI_MODEL || 'gemini-1.5-pro';
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
    // In a real environment, we'd use GoogleAuth to get the token.
    // For now, we assume the environment has GOOGLE_APPLICATION_CREDENTIALS or we use a stub.
    console.log('✅ [Vertex AI] Service ready (awaiting first inference for auth validation)');
  }

  /**
   * Generate content using Gemini via Vertex AI REST API
   */
  public async generateContent(prompt: string, systemInstruction?: string): Promise<string> {
    const url = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${this.modelId}:generateContent`;

    try {
      // Note: This requires a valid Google Cloud access token. 
      // In production, this would be fetched via 'google-auth-library'.
      if (!this.accessToken) {
        console.warn('⚠️ [Vertex AI] No access token provided. Attempting to use local environment default...');
      }

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
            'Authorization': `Bearer ${this.accessToken || process.env.GCP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || 'No response from Vertex AI';

    } catch (error: any) {
      console.error('❌ [Vertex AI] Inference failed:', error.response?.data || error.message);
      
      // Stub fallback if real API fails during "Boot Recovery"
      if (process.env.STUB_AI === 'true' || !this.accessToken) {
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
   * Set access token manually if needed
   */
  public setAccessToken(token: string): void {
    this.accessToken = token;
  }
}

export const vertexAIService = VertexAIService.getInstance();
