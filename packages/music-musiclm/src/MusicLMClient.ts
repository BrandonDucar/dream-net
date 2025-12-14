/**
 * MusicLM Integration
 * 
 * Integrates MusicLM text-to-music generation for DreamNet DreamStar Music vertical
 */

import axios, { AxiosInstance } from "axios";

export interface MusicLMConfig {
  apiUrl?: string;
  apiKey?: string;
}

export interface MusicLMRequest {
  text: string;
  duration?: number; // seconds
  temperature?: number;
}

export interface MusicLMResult {
  success: boolean;
  audioUrl?: string;
  audioData?: ArrayBuffer;
  duration?: number;
  error?: string;
}

/**
 * MusicLM Client
 * 
 * Wraps MusicLM for text-to-music generation
 */
export class MusicLMClient {
  private client: AxiosInstance;
  private config: MusicLMConfig;

  constructor(config: MusicLMConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || "https://api.musiclm.ai",
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
   * Generate music from text
   */
  async generateMusic(request: MusicLMRequest): Promise<MusicLMResult> {
    try {
      const response = await this.client.post("/generate", {
        text: request.text,
        duration: request.duration || 30,
        temperature: request.temperature || 1.0,
      }, {
        responseType: "arraybuffer",
      });

      return {
        success: true,
        audioData: response.data,
        duration: request.duration || 30,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Music generation failed",
      };
    }
  }
}

