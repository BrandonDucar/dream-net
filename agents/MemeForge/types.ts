/**
 * MemeForge Agent Types
 * Creates memes, captions, and platform-optimized content
 */

export interface MemeForgeTask {
  create_2panel: {
    topic: string;
    style?: "classic" | "edgy" | "wholesome" | "meta";
  };
  caption: {
    topic: string;
    tone?: "funny" | "serious" | "absurd" | "philosophical";
    length?: "short" | "medium" | "long";
  };
  platform_variants: {
    text: string;
    platforms: string[];
  };
}

export interface MemeForgeOutput {
  create_2panel: {
    top: string;
    bottom: string;
    variations: Array<{
      top: string;
      bottom: string;
      style: string;
    }>;
  };
  caption: {
    captions: string[];
    recommended: string;
  };
  platform_variants: {
    [platform: string]: string;
  };
}

