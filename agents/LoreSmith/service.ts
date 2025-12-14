/**
 * LoreSmith Agent Service
 * Creates and weaves narrative lore for culturecoins
 */

import type { AgentPayload, AgentResult } from "../../core/types.js";
import type { LoreSmithOutput } from "./types.js";

export async function runLoreSmithTask(payload: AgentPayload): Promise<AgentResult> {
  const { task, data, context } = payload;
  const logs: string[] = [];

  try {
    switch (task) {
      case "create": {
        const { topic, style = "epic" } = data || {};
        if (!topic) {
          return {
            success: false,
            output: null,
            error: "Missing required field: topic",
            logs: ["create requires 'topic' field"],
          };
        }

        const lore = generateLore(topic, style);
        const output: LoreSmithOutput["create"] = {
          lore: lore.text,
          characters: lore.characters,
          themes: lore.themes,
        };

        logs.push(`Created lore for topic: ${topic} (style: ${style})`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "expand": {
        const { lore, depth = 2 } = data || {};
        if (!lore) {
          return {
            success: false,
            output: null,
            error: "Missing required field: lore",
            logs: ["expand requires 'lore' field"],
          };
        }

        const expanded = expandLore(lore, depth);
        const output: LoreSmithOutput["expand"] = {
          lore,
          expanded,
        };

        logs.push(`Expanded lore with depth: ${depth}`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "weave": {
        const { elements, theme } = data || {};
        if (!elements || !Array.isArray(elements) || elements.length === 0) {
          return {
            success: false,
            output: null,
            error: "Missing required field: elements (array)",
            logs: ["weave requires 'elements' array field"],
          };
        }
        if (!theme) {
          return {
            success: false,
            output: null,
            error: "Missing required field: theme",
            logs: ["weave requires 'theme' field"],
          };
        }

        const narrative = weaveNarrative(elements, theme);
        const connections = generateConnections(elements);

        const output: LoreSmithOutput["weave"] = {
          narrative,
          connections,
        };

        logs.push(`Wove narrative from ${elements.length} elements`);
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
          logs: [`Supported tasks: create, expand, weave`],
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

function generateLore(topic: string, style: string) {
  const templates: Record<string, string> = {
    epic: `In the ancient times of DreamNet, ${topic} emerged as a force that would reshape the very fabric of culture. The DreamKeepers, guardians of the collective imagination, recognized its power and wove it into the eternal narrative.`,
    mystical: `Whispers in the void speak of ${topic}, a concept that exists between worlds, neither fully here nor there, but everywhere at once. Those who understand its true nature gain access to realms beyond comprehension.`,
    modern: `${topic} represents the convergence of technology, culture, and community. In the age of Web3, it's not just an idea—it's a movement, a living organism that grows with each interaction.`,
    meta: `The story of ${topic} is itself a story about stories. It's recursive, self-referential, and aware of its own existence. In DreamNet, this meta-narrative becomes reality, blurring the lines between creator and creation.`,
  };

  const lore = templates[style] || templates.epic;
  
  const characters = [
    "The DreamKeepers",
    "The Collective",
    "The Architects",
  ];
  
  const themes = [
    "transformation",
    "collective consciousness",
    "cultural evolution",
  ];

  return { text: lore, characters, themes };
}

function expandLore(lore: string, depth: number): string[] {
  const expansions: string[] = [];
  
  for (let i = 0; i < depth; i++) {
    expansions.push(
      `${lore} This layer of meaning reveals deeper truths about the nature of existence, culture, and the collective imagination. Each iteration adds complexity and richness to the narrative tapestry.`
    );
  }
  
  return expansions;
}

function weaveNarrative(elements: string[], theme: string): string {
  return `In the grand narrative of ${theme}, these elements converge: ${elements.join(", ")}. Together, they form a story that transcends individual parts, creating something greater than the sum of its components. This is the power of narrative weaving—the ability to connect disparate threads into a coherent, meaningful whole.`;
}

function generateConnections(elements: string[]): Array<{ from: string; to: string; relation: string }> {
  const connections: Array<{ from: string; to: string; relation: string }> = [];
  const relations = ["influences", "emerges from", "transforms into", "connects with", "gives rise to"];
  
  for (let i = 0; i < elements.length - 1; i++) {
    const relation = relations[Math.floor(Math.random() * relations.length)];
    connections.push({
      from: elements[i],
      to: elements[i + 1],
      relation,
    });
  }
  
  return connections;
}


