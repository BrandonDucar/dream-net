/**
 * PulseCaster Agent Types
 * Casts content across platforms and channels
 */

export interface PulseCasterTask {
  cast: {
    content: string;
    platforms: string[];
    schedule?: string;
  };
  analyze: {
    platform: string;
    content: string;
  };
}

export interface PulseCasterOutput {
  cast: {
    results: Array<{
      platform: string;
      success: boolean;
      postId?: string;
      error?: string;
    }>;
  };
  analyze: {
    platform: string;
    optimized: string;
    recommendations: string[];
  };
}


