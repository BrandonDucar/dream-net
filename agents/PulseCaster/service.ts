/**
 * PulseCaster Agent Service
 * Casts content across platforms and channels
 */

import type { AgentPayload, AgentResult } from "../../core/types.js";
import type { PulseCasterOutput } from "./types.js";

export async function runPulseCasterTask(payload: AgentPayload): Promise<AgentResult> {
  const { task, data, context } = payload;
  const logs: string[] = [];

  try {
    switch (task) {
      case "cast": {
        const { content, platforms = [], schedule } = data || {};
        if (!content) {
          return {
            success: false,
            output: null,
            error: "Missing required field: content",
            logs: ["cast requires 'content' field"],
          };
        }
        if (!platforms || platforms.length === 0) {
          return {
            success: false,
            output: null,
            error: "Missing required field: platforms (array)",
            logs: ["cast requires 'platforms' array field"],
          };
        }

        const results = platforms.map(platform => {
          const optimized = optimizeForPlatform(content, platform);
          return {
            platform,
            success: true,
            postId: `mock-${platform}-${Date.now()}`,
            optimized,
          };
        });

        const output: PulseCasterOutput["cast"] = {
          results,
        };

        logs.push(`Casted content to ${platforms.length} platforms`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "analyze": {
        const { platform, content } = data || {};
        if (!platform || !content) {
          return {
            success: false,
            output: null,
            error: "Missing required fields: platform, content",
            logs: ["analyze requires 'platform' and 'content' fields"],
          };
        }

        const optimized = optimizeForPlatform(content, platform);
        const recommendations = generateRecommendations(content, platform);

        const output: PulseCasterOutput["analyze"] = {
          platform,
          optimized,
          recommendations,
        };

        logs.push(`Analyzed content for platform: ${platform}`);
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
          logs: [`Supported tasks: cast, analyze`],
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

function optimizeForPlatform(content: string, platform: string): string {
  const maxLengths: Record<string, number> = {
    twitter: 280,
    farcaster: 320,
    telegram: 4096,
    instagram: 2200,
    tiktok: 150,
  };

  const maxLength = maxLengths[platform.toLowerCase()] || 280;
  
  if (content.length <= maxLength) {
    return content;
  }
  
  return content.substring(0, maxLength - 3) + "...";
}

function generateRecommendations(content: string, platform: string): string[] {
  const recommendations: string[] = [];
  
  const maxLengths: Record<string, number> = {
    twitter: 280,
    farcaster: 320,
    telegram: 4096,
    instagram: 2200,
    tiktok: 150,
  };
  
  const maxLength = maxLengths[platform.toLowerCase()] || 280;
  
  if (content.length > maxLength) {
    recommendations.push(`Content exceeds ${platform} limit (${maxLength} chars). Consider shortening.`);
  }
  
  if (!content.includes("#") && platform === "twitter") {
    recommendations.push("Consider adding hashtags for better discoverability");
  }
  
  if (!content.includes("@") && platform === "farcaster") {
    recommendations.push("Consider mentioning other users for engagement");
  }
  
  if (content.length < 50) {
    recommendations.push("Content is quite short. Consider adding more context.");
  }
  
  return recommendations.length > 0 ? recommendations : ["Content looks good for this platform!"];
}


