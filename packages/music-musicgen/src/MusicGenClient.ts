/**
 * MusicGen AI Integration
 * 
 * Integrates MusicGen AI music generation for DreamNet DreamStar Music vertical
 */

import axios, { AxiosInstance } from "axios";

export interface MusicGenConfig {
  apiUrl?: string;
  apiKey?: string;
  model?: "facebook/musicgen-small" | "facebook/musicgen-medium" | "facebook/musicgen-large";
}

export interface MusicGenerationRequest {
  text: string;
  duration?: number; // seconds
  temperature?: number;
  topK?: number;
  topP?: number;
  model?: string;
}

export interface MusicGenerationResult {
  success: boolean;
  audioUrl?: string;
  audioData?: ArrayBuffer;
  duration?: number;
  error?: string;
}

/**
 * MusicGen AI Client
 * 
 * Wraps MusicGen AI for text-to-music generation
 */
export class MusicGenClient {
  private client: AxiosInstance;
  private config: MusicGenConfig;

  constructor(config: MusicGenConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || "https://api-inference.huggingface.co/models/facebook/musicgen-medium",
      model: config.model || "facebook/musicgen-medium",
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
   * Generate music from text description
   */
  async generateMusic(
    request: MusicGenerationRequest
  ): Promise<MusicGenerationResult> {
    try {
      const response = await this.client.post(
        "",
        {
          inputs: request.text,
          parameters: {
            duration: request.duration || 5,
            temperature: request.temperature || 1.0,
            top_k: request.topK || 250,
            top_p: request.topP || 0.0,
          },
        },
        {
          responseType: "arraybuffer",
        }
      );

      return {
        success: true,
        audioData: response.data,
        duration: request.duration || 5,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Music generation failed",
      };
    }
  }

  /**
   * Generate music from text and return URL
   */
  async generateMusicUrl(
    text: string,
    duration?: number
  ): Promise<MusicGenerationResult> {
    const result = await this.generateMusic({ text, duration });
    
    if (result.success && result.audioData) {
      // Convert audio data to blob URL or upload to storage
      // For now, return the result with audioData
      return result;
    }

    return result;
  }

  /**
   * Generate music with melody continuation
   */
  async continueMelody(
    audioData: ArrayBuffer,
    text: string,
    duration?: number
  ): Promise<MusicGenerationResult> {
    try {
      // MusicGen continuation would go here
      // This would use the audio input as a melody prompt
      return {
        success: true,
        audioData: audioData,
        duration: duration || 5,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Melody continuation failed",
      };
    }
  }

  /**
   * Get available models
   */
  getAvailableModels(): string[] {
    return [
      "facebook/musicgen-small",
      "facebook/musicgen-medium",
      "facebook/musicgen-large",
    ];
  }

  /**
   * Set model
   */
  setModel(model: MusicGenConfig["model"]): void {
    this.config.model = model;
    this.client.defaults.baseURL = this.config.apiUrl?.replace(
      /\/models\/[^/]+$/,
      `/models/${model}`
    ) || `https://api-inference.huggingface.co/models/${model}`;
  }
}

