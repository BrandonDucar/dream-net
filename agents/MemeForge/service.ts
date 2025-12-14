/**
 * MemeForge Agent Service
 * Core logic for meme creation and content generation
 */

import type { AgentPayload, AgentResult } from "../../core/types.js";
import type { MemeForgeOutput } from "./types.js";

export async function runMemeForgeTask(payload: AgentPayload): Promise<AgentResult> {
  const { task, data, context } = payload;
  const logs: string[] = [];

  try {
    switch (task) {
      case "create_2panel": {
        const { topic, style = "classic" } = data || {};
        if (!topic) {
          return {
            success: false,
            output: null,
            error: "Missing required field: topic",
            logs: ["create_2panel requires 'topic' field"],
          };
        }

        // Generate 2-panel meme text
        const output: MemeForgeOutput["create_2panel"] = {
          top: generateTopPanel(topic, style),
          bottom: generateBottomPanel(topic, style),
          variations: generateVariations(topic, style),
        };

        logs.push(`Generated 2-panel meme for topic: ${topic} (style: ${style})`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "caption": {
        const { topic, tone = "funny", length = "medium" } = data || {};
        if (!topic) {
          return {
            success: false,
            output: null,
            error: "Missing required field: topic",
            logs: ["caption requires 'topic' field"],
          };
        }

        const captions = generateCaptions(topic, tone, length);
        const output: MemeForgeOutput["caption"] = {
          captions,
          recommended: captions[0] || "",
        };

        logs.push(`Generated ${captions.length} captions for topic: ${topic}`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "platform_variants": {
        const { text, platforms = ["twitter", "farcaster", "telegram"] } = data || {};
        if (!text) {
          return {
            success: false,
            output: null,
            error: "Missing required field: text",
            logs: ["platform_variants requires 'text' field"],
          };
        }

        const output: MemeForgeOutput["platform_variants"] = {};
        for (const platform of platforms) {
          output[platform] = adaptForPlatform(text, platform);
        }

        logs.push(`Generated platform variants for ${platforms.length} platforms`);
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
          logs: [`Supported tasks: create_2panel, caption, platform_variants`],
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

// Helper functions (pure, no external APIs yet)
function generateTopPanel(topic: string, style: string): string {
  const templates: Record<string, string[]> = {
    classic: [
      "When you realize",
      "Me explaining",
      "How I feel when",
      "When someone says",
    ],
    edgy: [
      "Society when",
      "The system",
      "They expect us to",
      "Reality check:",
    ],
    wholesome: [
      "Finding out that",
      "When you discover",
      "The moment you realize",
      "Learning that",
    ],
    meta: [
      "The algorithm when",
      "Crypto Twitter after",
      "When you understand",
      "Me trying to explain",
    ],
  };

  const options = templates[style] || templates.classic;
  const template = options[Math.floor(Math.random() * options.length)];
  return `${template} ${topic}`;
}

function generateBottomPanel(topic: string, style: string): string {
  const templates: Record<string, string[]> = {
    classic: [
      "But it's actually true",
      "And you're not wrong",
      "But you keep doing it anyway",
      "And everyone agrees",
    ],
    edgy: [
      "But we keep buying",
      "And nobody cares",
      "But we're still here",
      "And it still works",
    ],
    wholesome: [
      "And it makes you smile",
      "And everything is okay",
      "And you feel good",
      "And the world is beautiful",
    ],
    meta: [
      "But engagement goes up",
      "And we all know it",
      "But we keep scrolling",
      "And the cycle continues",
    ],
  };

  const options = templates[style] || templates.classic;
  const template = options[Math.floor(Math.random() * options.length)];
  return template;
}

function generateVariations(topic: string, style: string) {
  const variations = [];
  const styles = ["classic", "edgy", "wholesome", "meta"];
  
  for (const s of styles.slice(0, 3)) {
    variations.push({
      top: generateTopPanel(topic, s),
      bottom: generateBottomPanel(topic, s),
      style: s,
    });
  }
  
  return variations;
}

function generateCaptions(topic: string, tone: string, length: string): string[] {
  const captions: string[] = [];
  
  // Generate 3-5 captions based on tone and length
  const count = length === "short" ? 3 : length === "long" ? 5 : 4;
  
  for (let i = 0; i < count; i++) {
    let caption = "";
    
    switch (tone) {
      case "funny":
        caption = `${topic}? More like ${topic} but make it spicy 🌶️`;
        break;
      case "serious":
        caption = `Let's talk about ${topic}. This matters.`;
        break;
      case "absurd":
        caption = `${topic} is just ${topic} wearing a hat. Change my mind.`;
        break;
      case "philosophical":
        caption = `What if ${topic} is actually the question, not the answer?`;
        break;
      default:
        caption = `${topic} hits different.`;
    }
    
    if (length === "long") {
      caption += ` Here's why: ${topic} represents a fundamental shift in how we understand culture, value, and community.`;
    }
    
    captions.push(caption);
  }
  
  return captions;
}

function adaptForPlatform(text: string, platform: string): string {
  const maxLengths: Record<string, number> = {
    twitter: 280,
    farcaster: 320,
    telegram: 4096,
    instagram: 2200,
    tiktok: 150,
  };

  const maxLength = maxLengths[platform.toLowerCase()] || 280;
  
  if (text.length <= maxLength) {
    return text;
  }
  
  // Truncate and add ellipsis
  return text.substring(0, maxLength - 3) + "...";
}

