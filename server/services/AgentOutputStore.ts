/**
 * Agent Output Store
 * 
 * Stores and retrieves outputs from the 8 Vertex AI agents:
 * - Agent 1: vertex_fusion_snapshot
 * - Agent 2: drone_dome_report, drone_dome_commands
 * - Agent 3: event_fabric_spec, monitoring_blueprint
 * - Agent 4: dreamkeeper_spec, surgeon_protocols
 * - Agent 5: deploykeeper_blueprint, infra_unification_plan
 * - Agent 6: data_spine_spec, storage_plan, migration_recommendations
 * - Agent 7: socialops_spec, external_edge_playbooks, risk_and_safety_guidelines
 * - Agent 8: master_blueprint, evolution_roadmap, risk_matrix
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_DIR = path.join(process.cwd(), "data", "agent-outputs");
const LATEST_DIR = path.join(STORE_DIR, "latest");
const HISTORY_DIR = path.join(STORE_DIR, "history");

// Agent output types
export type AgentOutputType =
  | "vertex_fusion_snapshot"
  | "drone_dome_report"
  | "drone_dome_commands"
  | "event_fabric_spec"
  | "monitoring_blueprint"
  | "dreamkeeper_spec"
  | "surgeon_protocols"
  | "deploykeeper_blueprint"
  | "infra_unification_plan"
  | "data_spine_spec"
  | "storage_plan"
  | "migration_recommendations"
  | "socialops_spec"
  | "external_edge_playbooks"
  | "risk_and_safety_guidelines"
  | "master_blueprint"
  | "evolution_roadmap"
  | "risk_matrix";

export interface AgentOutput {
  agentId: number;
  outputType: AgentOutputType;
  data: any;
  version: string;
  createdAt: string;
  metadata?: {
    dependencies?: string[]; // Which other outputs this depends on
    notes?: string;
  };
}

async function ensureDirectories(): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.mkdir(LATEST_DIR, { recursive: true });
  await fs.mkdir(HISTORY_DIR, { recursive: true });
}

/**
 * Store an agent output (latest version)
 */
export async function storeOutput(
  agentId: number,
  outputType: AgentOutputType,
  data: any,
  metadata?: AgentOutput["metadata"]
): Promise<AgentOutput> {
  await ensureDirectories();

  const output: AgentOutput = {
    agentId,
    outputType,
    data,
    version: "1.0.0",
    createdAt: new Date().toISOString(),
    metadata,
  };

  // Store latest version
  const latestPath = path.join(LATEST_DIR, `agent-${agentId}-${outputType}.json`);
  await fs.writeFile(latestPath, JSON.stringify(output, null, 2), "utf-8");

  // Store in history with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const historyPath = path.join(
    HISTORY_DIR,
    `agent-${agentId}-${outputType}-${timestamp}.json`
  );
  await fs.writeFile(historyPath, JSON.stringify(output, null, 2), "utf-8");

  return output;
}

/**
 * Get the latest output for an agent and output type
 */
export async function getLatestOutput(
  agentId: number,
  outputType: AgentOutputType
): Promise<AgentOutput | null> {
  await ensureDirectories();

  const latestPath = path.join(LATEST_DIR, `agent-${agentId}-${outputType}.json`);

  try {
    const data = await fs.readFile(latestPath, "utf-8");
    return JSON.parse(data) as AgentOutput;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get all latest outputs for an agent
 */
export async function getAgentOutputs(agentId: number): Promise<AgentOutput[]> {
  await ensureDirectories();

  const outputs: AgentOutput[] = [];

  try {
    const files = await fs.readdir(LATEST_DIR);
    const agentFiles = files.filter((f) => f.startsWith(`agent-${agentId}-`));

    for (const file of agentFiles) {
      const filePath = path.join(LATEST_DIR, file);
      const data = await fs.readFile(filePath, "utf-8");
      outputs.push(JSON.parse(data) as AgentOutput);
    }
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  return outputs;
}

/**
 * Get all latest outputs across all agents
 */
export async function getAllLatestOutputs(): Promise<Record<string, AgentOutput[]>> {
  await ensureDirectories();

  const result: Record<string, AgentOutput[]> = {};

  try {
    const files = await fs.readdir(LATEST_DIR);
    const agentGroups = new Map<number, AgentOutput[]>();

    for (const file of files) {
      const match = file.match(/^agent-(\d+)-(.+)\.json$/);
      if (match) {
        const agentId = parseInt(match[1], 10);
        const filePath = path.join(LATEST_DIR, file);
        const data = await fs.readFile(filePath, "utf-8");
        const output = JSON.parse(data) as AgentOutput;

        if (!agentGroups.has(agentId)) {
          agentGroups.set(agentId, []);
        }
        agentGroups.get(agentId)!.push(output);
      }
    }

    for (const [agentId, outputs] of agentGroups.entries()) {
      result[`agent-${agentId}`] = outputs;
    }
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  return result;
}

/**
 * Get history of outputs for an agent and output type
 */
export async function getOutputHistory(
  agentId: number,
  outputType: AgentOutputType,
  limit: number = 10
): Promise<AgentOutput[]> {
  await ensureDirectories();

  const history: AgentOutput[] = [];

  try {
    const files = await fs.readdir(HISTORY_DIR);
    const pattern = new RegExp(`^agent-${agentId}-${outputType}-(.+)\\.json$`);
    const matchingFiles = files
      .filter((f) => pattern.test(f))
      .sort()
      .reverse()
      .slice(0, limit);

    for (const file of matchingFiles) {
      const filePath = path.join(HISTORY_DIR, file);
      const data = await fs.readFile(filePath, "utf-8");
      history.push(JSON.parse(data) as AgentOutput);
    }
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  return history;
}

