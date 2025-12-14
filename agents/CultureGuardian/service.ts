/**
 * CultureGuardian Agent Service
 * Protects and moderates culturecoin content and communities
 */

import type { AgentPayload, AgentResult } from "../../core/types.js";
import type { CultureGuardianOutput } from "./types.js";

export async function runCultureGuardianTask(payload: AgentPayload): Promise<AgentResult> {
  const { task, data, context } = payload;
  const logs: string[] = [];

  try {
    switch (task) {
      case "moderate": {
        const { content, type = "text" } = data || {};
        if (!content) {
          return {
            success: false,
            output: null,
            error: "Missing required field: content",
            logs: ["moderate requires 'content' field"],
          };
        }

        const flags = checkContent(content);
        const safe = flags.length === 0;

        const output: CultureGuardianOutput["moderate"] = {
          safe,
          flags,
          reason: safe ? undefined : `Content flagged for: ${flags.join(", ")}`,
        };

        logs.push(`Moderated ${type} content: ${safe ? "safe" : "flagged"}`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "protect": {
        const { community, rules = [] } = data || {};
        if (!community) {
          return {
            success: false,
            output: null,
            error: "Missing required field: community",
            logs: ["protect requires 'community' field"],
          };
        }

        const violations = analyzeViolations(community, rules);
        const status = violations.length === 0 ? "protected" : "violations_detected";

        const output: CultureGuardianOutput["protect"] = {
          status,
          violations,
        };

        logs.push(`Protected community: ${status}`);
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
          logs: [`Supported tasks: moderate, protect`],
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

function checkContent(content: string): string[] {
  const flags: string[] = [];
  
  const harmfulPatterns = [
    { pattern: /hate|violence|harm/i, flag: "harmful_language" },
    { pattern: /spam|scam|rug/i, flag: "spam_scam" },
    { pattern: /nsfw|explicit/i, flag: "nsfw" },
  ];
  
  for (const { pattern, flag } of harmfulPatterns) {
    if (pattern.test(content)) {
      flags.push(flag);
    }
  }
  
  return flags;
}

function analyzeViolations(community: string, rules: string[]): Array<{ rule: string; count: number }> {
  const violations: Array<{ rule: string; count: number }> = [];
  
  // Mock violation analysis
  for (const rule of rules) {
    const count = Math.floor(Math.random() * 5);
    if (count > 0) {
      violations.push({ rule, count });
    }
  }
  
  return violations;
}


