/**
 * MemeEngineCore Agent Service
 * Core orchestration engine for meme generation pipeline
 */

import type { AgentPayload, AgentResult } from "../../core/types.js";
import type { MemeEngineCoreOutput } from "./types.js";

export async function runMemeEngineCoreTask(payload: AgentPayload): Promise<AgentResult> {
  const { task, data, context } = payload;
  const logs: string[] = [];

  try {
    switch (task) {
      case "generate": {
        const { topic, style = "classic", platforms = ["twitter"] } = data || {};
        if (!topic) {
          return {
            success: false,
            output: null,
            error: "Missing required field: topic",
            logs: ["generate requires 'topic' field"],
          };
        }

        // Generate memes for each platform
        const memes = platforms.map(platform => ({
          text: generateMemeText(topic, style, platform),
          style,
          platform,
          score: Math.random() * 0.3 + 0.7, // 0.7-1.0
        }));

        // Find best meme
        const bestMeme = memes.reduce((best, current) => 
          current.score > best.score ? current : best
        );

        const output: MemeEngineCoreOutput["generate"] = {
          memes,
          recommended: {
            text: bestMeme.text,
            platform: bestMeme.platform,
            reason: `Highest score (${(bestMeme.score * 100).toFixed(1)}%) for ${bestMeme.platform}`,
          },
        };

        logs.push(`Generated ${memes.length} memes across ${platforms.length} platforms`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "pipeline": {
        const { steps, input } = data || {};
        if (!steps || !Array.isArray(steps)) {
          return {
            success: false,
            output: null,
            error: "Missing required field: steps (array)",
            logs: ["pipeline requires 'steps' array field"],
          };
        }

        const results = [];
        let currentInput = input;

        for (const step of steps) {
          try {
            const stepOutput = executePipelineStep(step, currentInput);
            results.push({
              step,
              output: stepOutput,
              success: true,
            });
            currentInput = stepOutput;
          } catch (error: any) {
            results.push({
              step,
              output: null,
              success: false,
            });
            logs.push(`Pipeline step '${step}' failed: ${error?.message}`);
          }
        }

        const output: MemeEngineCoreOutput["pipeline"] = {
          results,
        };

        logs.push(`Executed pipeline with ${steps.length} steps`);
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
          logs: [`Supported tasks: generate, pipeline`],
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

function generateMemeText(topic: string, style: string, platform: string): string {
  const templates: Record<string, string[]> = {
    classic: [
      `When you realize ${topic}`,
      `${topic} hits different`,
      `Me explaining ${topic} to normies`,
      `${topic} but make it spicy`,
    ],
    edgy: [
      `Society when ${topic}`,
      `${topic} is just ${topic} with extra steps`,
      `The system wants you to think ${topic}`,
    ],
    wholesome: [
      `Finding out that ${topic}`,
      `When you discover ${topic}`,
      `${topic} makes everything better`,
    ],
  };

  const options = templates[style] || templates.classic;
  const template = options[Math.floor(Math.random() * options.length)];
  
  // Platform-specific adaptation
  if (platform === "twitter" && template.length > 280) {
    return template.substring(0, 277) + "...";
  }
  
  return template;
}

function executePipelineStep(step: string, input: any): any {
  switch (step) {
    case "remix":
      return { ...input, remixed: true };
    case "score":
      return { ...input, score: Math.random() };
    case "optimize":
      return { ...input, optimized: true };
    default:
      return input;
  }
}


