/**
 * LoreSmith Agent Types
 * Creates and weaves narrative lore for culturecoins
 */

export interface LoreSmithTask {
  create: {
    topic: string;
    style?: "epic" | "mystical" | "modern" | "meta";
  };
  expand: {
    lore: string;
    depth?: number;
  };
  weave: {
    elements: string[];
    theme: string;
  };
}

export interface LoreSmithOutput {
  create: {
    lore: string;
    characters?: string[];
    themes: string[];
  };
  expand: {
    lore: string;
    expanded: string[];
  };
  weave: {
    narrative: string;
    connections: Array<{
      from: string;
      to: string;
      relation: string;
    }>;
  };
}


