/**
 * RemixEngine Agent Service
 * Core logic for text remixing and transformation
 */

import type { AgentPayload, AgentResult } from "../../core/types.js";
import type { RemixEngineOutput } from "./types.js";

export async function runRemixEngineTask(payload: AgentPayload): Promise<AgentResult> {
  const { task, data, context } = payload;
  const logs: string[] = [];

  try {
    switch (task) {
      case "remix": {
        const { text, style = "edgy" } = data || {};
        if (!text) {
          return {
            success: false,
            output: null,
            error: "Missing required field: text",
            logs: ["remix requires 'text' field"],
          };
        }

        const variations = generateRemixes(text, style);
        const output: RemixEngineOutput["remix"] = {
          variations,
        };

        logs.push(`Generated ${variations.length} remix variations`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "shorten": {
        const { text, targetLength = 100 } = data || {};
        if (!text) {
          return {
            success: false,
            output: null,
            error: "Missing required field: text",
            logs: ["shorten requires 'text' field"],
          };
        }

        const shortened = compressText(text, targetLength);
        const output: RemixEngineOutput["shorten"] = {
          text: shortened,
          originalLength: text.length,
          newLength: shortened.length,
        };

        logs.push(`Compressed text from ${text.length} to ${shortened.length} chars`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "expand": {
        const { text, lore = false } = data || {};
        if (!text) {
          return {
            success: false,
            output: null,
            error: "Missing required field: text",
            logs: ["expand requires 'text' field"],
          };
        }

        const expanded = expandText(text, lore);
        const output: RemixEngineOutput["expand"] = {
          text: expanded.text,
          ...(lore && { lore: expanded.lore }),
        };

        logs.push(`Expanded text with ${lore ? "lore" : "context"}`);
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
          logs: [`Supported tasks: remix, shorten, expand`],
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

function generateRemixes(text: string, style: string): Array<{ text: string; style: string }> {
  const variations: Array<{ text: string; style: string }> = [];
  
  const styles = ["edgy", "safe", "surreal"];
  
  for (const s of styles) {
    let remixed = text;
    
    switch (s) {
      case "edgy":
        remixed = text
          .replace(/good/g, "based")
          .replace(/bad/g, "cringe")
          .replace(/amazing/g, "fire")
          .replace(/terrible/g, "mid");
        break;
      case "safe":
        remixed = text
          .replace(/based/g, "good")
          .replace(/cringe/g, "not ideal")
          .replace(/fire/g, "great")
          .replace(/mid/g, "average");
        break;
      case "surreal":
        remixed = text
          .split(" ")
          .map((word, i) => i % 3 === 0 ? word.toUpperCase() : word)
          .join(" ");
        break;
    }
    
    variations.push({ text: remixed, style: s });
  }
  
  return variations;
}

function compressText(text: string, targetLength: number): string {
  if (text.length <= targetLength) {
    return text;
  }
  
  // Simple compression: remove filler words, shorten
  const compressed = text
    .replace(/\s+/g, " ")
    .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/gi, "")
    .trim();
  
  if (compressed.length <= targetLength) {
    return compressed;
  }
  
  // Truncate at word boundary
  const truncated = compressed.substring(0, targetLength);
  const lastSpace = truncated.lastIndexOf(" ");
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + "...";
  }
  
  return truncated + "...";
}

function expandText(text: string, includeLore: boolean): { text: string; lore?: string } {
  const expanded = `${text} This represents a fundamental shift in how we understand culture, value, and community. The implications extend far beyond the surface, touching on deeper questions of identity, belonging, and collective meaning-making.`;
  
  const lore = includeLore
    ? `In the DreamNet mythology, this concept connects to the ancient traditions of the DreamKeepers, who understood that culture is not static but flows like a river, constantly remaking itself through the collective imagination of the community.`
    : undefined;
  
  return { text: expanded, lore };
}

