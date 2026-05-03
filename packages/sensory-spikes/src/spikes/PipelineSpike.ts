import { randomUUID } from "node:crypto";

export interface PipelineStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  durationMs?: number;
}

export interface Pipeline {
  id: string;
  name: string;
  type: "input" | "output";
  steps: PipelineStep[];
  status: "idle" | "running" | "completed" | "failed";
  lastRunAt: string;
}

export class PipelineSpike {
  private pipelines: Map<string, Pipeline> = new Map();

  constructor() {
    this.initializePipelines();
  }

  private initializePipelines() {
    this.createPipeline("Alpha Ingestion", "input", ["Ingest", "Normalize", "Enrich", "Commit"]);
    this.createPipeline("Swarm Synthesis", "output", ["Aggregate", "Reason", "Format", "Publish"]);
    this.createPipeline("Ticker Research", "input", ["Scan", "Verify", "Score", "Alert"]);
  }

  public createPipeline(name: string, type: "input" | "output", steps: string[]) {
    const id = randomUUID();
    this.pipelines.set(id, {
      id,
      name,
      type,
      steps: steps.map(s => ({ id: randomUUID(), name: s, status: "pending" })),
      status: "idle",
      lastRunAt: new Date().toISOString()
    });
    console.log(`🚀 [PipelineSpike] Created ${type} pipeline: ${name}`);
  }

  public async runPipeline(id: string): Promise<void> {
    const pipeline = this.pipelines.get(id);
    if (!pipeline) return;

    pipeline.status = "running";
    pipeline.lastRunAt = new Date().toISOString();

    for (const step of pipeline.steps) {
      step.status = "running";
      const start = Date.now();
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
      step.status = "completed";
      step.durationMs = Date.now() - start;
    }

    pipeline.status = "completed";
  }

  public getStatus() {
    return Array.from(this.pipelines.values());
  }
}

export const pipelineSpike = new PipelineSpike();
