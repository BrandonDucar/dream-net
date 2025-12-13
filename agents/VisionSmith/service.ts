/**
 * VisionSmith Agent Service
 * Creates visual content and image generation prompts
 */

import type { AgentPayload, AgentResult } from "../../core/types.js";
import type { VisionSmithOutput } from "./types.js";

export async function runVisionSmithTask(payload: AgentPayload): Promise<AgentResult> {
  const { task, data, context } = payload;
  const logs: string[] = [];

  try {
    switch (task) {
      case "generate": {
        const { prompt, style = "vibrant" } = data || {};
        if (!prompt) {
          return {
            success: false,
            output: null,
            error: "Missing required field: prompt",
            logs: ["generate requires 'prompt' field"],
          };
        }

        // Enhanced prompt for image generation
        const enhancedPrompt = enhancePrompt(prompt, style);
        const imageUrl = `https://placeholder.dreamnet.ink/${Date.now()}.png`;

        const output: VisionSmithOutput["generate"] = {
          imageUrl,
          prompt: enhancedPrompt,
          metadata: {
            style,
            originalPrompt: prompt,
            timestamp: Date.now(),
          },
        };

        logs.push(`Generated visual content for prompt: ${prompt}`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "enhance": {
        const { image, enhancements = [] } = data || {};
        if (!image) {
          return {
            success: false,
            output: null,
            error: "Missing required field: image",
            logs: ["enhance requires 'image' field"],
          };
        }

        const applied = applyEnhancements(image, enhancements);
        const enhanced = `enhanced_${image}`;

        const output: VisionSmithOutput["enhance"] = {
          enhanced,
          applied,
        };

        logs.push(`Applied ${applied.length} enhancements`);
        return {
          success: true,
          output,
          logs,
        };
      }

      default:
        return {
          success: false,
          output: null,
          error: `Unknown task: ${task}`,
          logs: [`Supported tasks: generate, enhance`],
        };
    }
  } catch (error: any) {
    return {
      success: false,
      output: null,
      error: error?.message || String(error),
      logs: [...logs, `Error: ${error?.message || String(error)}`],
    };
  }
}

function enhancePrompt(prompt: string, style: string): string {
  const stylePrefixes: Record<string, string> = {
    vibrant: "vibrant, colorful, high contrast, ",
    minimalist: "minimalist, clean, simple, ",
    epic: "epic, dramatic, cinematic, ",
    playful: "playful, fun, whimsical, ",
  };

  const prefix = stylePrefixes[style] || "";
  return `${prefix}${prompt}, high quality, detailed, culturecoin aesthetic`;
}

function applyEnhancements(image: string, enhancements: string[]): string[] {
  const applied: string[] = [];
  
  const availableEnhancements = ["upscale", "color_correct", "add_effects", "optimize"];
  
  for (const enhancement of enhancements) {
    if (availableEnhancements.includes(enhancement)) {
      applied.push(enhancement);
    }
  }
  
  return applied;
}


