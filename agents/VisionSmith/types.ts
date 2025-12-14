/**
 * VisionSmith Agent Types
 * Creates visual content and image generation prompts
 */

export interface VisionSmithTask {
  generate: {
    prompt: string;
    style?: string;
  };
  enhance: {
    image: string;
    enhancements: string[];
  };
}

export interface VisionSmithOutput {
  generate: {
    imageUrl: string;
    prompt: string;
    metadata: any;
  };
  enhance: {
    enhanced: string;
    applied: string[];
  };
}

