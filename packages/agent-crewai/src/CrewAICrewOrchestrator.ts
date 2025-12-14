/**
 * CrewAI Crew Orchestrator Integration
 * 
 * Wraps CrewAI patterns for DreamNet multi-agent collaboration
 */

import { Crew, Agent, Task, Process } from "crewai";

export interface DreamNetCrewAgent {
  id: string;
  role: string;
  goal: string;
  backstory: string;
  tools?: any[];
  verbose?: boolean;
}

export interface DreamNetCrewTask {
  id: string;
  description: string;
  agentId: string;
  expectedOutput?: string;
}

export interface DreamNetCrewConfig {
  agents: DreamNetCrewAgent[];
  tasks: DreamNetCrewTask[];
  process?: "sequential" | "hierarchical" | "consensual";
  verbose?: boolean;
}

/**
 * CrewAI Crew Orchestrator - Multi-agent collaboration
 */
export class CrewAICrewOrchestrator {
  private crew: Crew | null = null;
  private config: DreamNetCrewConfig;

  constructor(config: DreamNetCrewConfig) {
    this.config = {
      process: config.process || "sequential",
      verbose: config.verbose ?? true,
      ...config,
    };
  }

  /**
   * Initialize crew with agents and tasks
   */
  async initialize(): Promise<void> {
    try {
      // Convert DreamNet agents to CrewAI agents
      const crewaiAgents = this.config.agents.map((agent) => {
        return new Agent({
          role: agent.role,
          goal: agent.goal,
          backstory: agent.backstory,
          tools: agent.tools || [],
          verbose: agent.verbose ?? true,
        });
      });

      // Convert DreamNet tasks to CrewAI tasks
      const crewaiTasks = this.config.tasks.map((task) => {
        const agent = crewaiAgents.find(
          (a) => a.role === this.config.agents.find((da) => da.id === task.agentId)?.role
        );

        return new Task({
          description: task.description,
          agent: agent!,
          expectedOutput: task.expectedOutput,
        });
      });

      // Create crew
      this.crew = new Crew({
        agents: crewaiAgents,
        tasks: crewaiTasks,
        process: this.config.process as Process,
        verbose: this.config.verbose,
      });

      console.log("[CrewAICrewOrchestrator] Crew initialized successfully");
    } catch (error: any) {
      console.error("[CrewAICrewOrchestrator] Initialization failed:", error.message);
      throw error;
    }
  }

  /**
   * Execute crew (run all tasks)
   */
  async execute(input?: string): Promise<{
    result: string;
    tasks: Array<{ id: string; result: string }>;
    error?: string;
  }> {
    if (!this.crew) {
      await this.initialize();
    }

    try {
      const result = await this.crew!.kickoff({ inputs: input || "" });

      return {
        result: String(result),
        tasks: this.config.tasks.map((task, index) => ({
          id: task.id,
          result: String(result),
        })),
      };
    } catch (error: any) {
      return {
        result: "",
        tasks: [],
        error: error.message || "Crew execution failed",
      };
    }
  }

  /**
   * Get crew status
   */
  getStatus(): {
    initialized: boolean;
    agentCount: number;
    taskCount: number;
    process: string;
  } {
    return {
      initialized: this.crew !== null,
      agentCount: this.config.agents.length,
      taskCount: this.config.tasks.length,
      process: this.config.process || "sequential",
    };
  }
}

