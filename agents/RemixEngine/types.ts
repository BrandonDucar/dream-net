/**
 * RemixEngine Agent Types
 * Remixes and transforms text content
 */

export interface RemixEngineTask {
  remix: {
    text: string;
    style?: "edgy" | "safe" | "surreal";
  };
  shorten: {
    text: string;
    targetLength?: number;
  };
  expand: {
    text: string;
    lore?: boolean;
  };
}

export interface RemixEngineOutput {
  remix: {
    variations: Array<{
      text: string;
      style: string;
    }>;
  };
  shorten: {
    text: string;
    originalLength: number;
    newLength: number;
  };
  expand: {
    text: string;
    lore?: string;
  };
}

