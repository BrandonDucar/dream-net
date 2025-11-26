/**
 * GPT Orchestrator
 * 
 * Enables multi-GPT workflows and coordination.
 * Manages sequential and parallel execution of GPT tasks.
 */

import { gptAgentRegistry } from "./GPTAgentRegistry";
import { gptCommunicationBridge } from "./GPTCommunicationBridge";
import { cleanGPTId } from "./mappers";
import type { CustomGPT } from "./types";

export interface GPTWorkflowStep {
  stepId: string;
  gpt: string; // GPT name or ID
  action: string; // Action to perform
  params?: Record<string, any>;
  waitFor?: string[]; // Step IDs to wait for
  condition?: string; // Condition expression (e.g., "previous.success === true")
  timeout?: number; // Timeout in milliseconds
}

export interface GPTWorkflow {
  workflowId: string;
  name?: string;
  description?: string;
  steps: GPTWorkflowStep[];
  parallel: boolean; // If true, run steps in parallel (respecting waitFor)
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  results: Record<string, GPTWorkflowStepResult>;
  metadata?: Record<string, any>;
}

export interface GPTWorkflowStepResult {
  stepId: string;
  gpt: string;
  success: boolean;
  data?: any;
  error?: string;
  duration?: number;
  startedAt?: string;
  completedAt?: string;
}

export interface GPTWorkflowExecution {
  workflow: GPTWorkflow;
  currentStep?: string;
  completedSteps: string[];
  failedSteps: string[];
}

class GPTOrchestrator {
  private workflows: Map<string, GPTWorkflow> = new Map();
  private executions: Map<string, GPTWorkflowExecution> = new Map();

  /**
   * Create a new workflow
   */
  createWorkflow(
    steps: GPTWorkflowStep[],
    options?: {
      name?: string;
      description?: string;
      parallel?: boolean;
      metadata?: Record<string, any>;
    }
  ): GPTWorkflow {
    const workflowId = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const workflow: GPTWorkflow = {
      workflowId,
      name: options?.name,
      description: options?.description,
      steps,
      parallel: options?.parallel || false,
      status: "pending",
      createdAt: new Date().toISOString(),
      results: {},
      metadata: options?.metadata,
    };

    this.workflows.set(workflowId, workflow);
    return workflow;
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string): Promise<GPTWorkflow> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    if (workflow.status === "running") {
      throw new Error(`Workflow already running: ${workflowId}`);
    }

      workflow.status = "running";
      workflow.startedAt = new Date().toISOString();

      // Emit workflow started event
      try {
        const { gptEventStream } = await import("./GPTEventStream");
        await gptEventStream.emitGPTEvent(
          workflow.metadata?.initiator || "system",
          "gpt.workflow.started",
          {
            workflowId: workflow.workflowId,
            name: workflow.name,
            stepCount: workflow.steps.length,
          }
        );
      } catch (error: any) {
        // Event emission failed, continue
        console.warn("[GPT Orchestrator] Failed to emit event:", error.message);
      }

    const execution: GPTWorkflowExecution = {
      workflow,
      completedSteps: [],
      failedSteps: [],
    };

    this.executions.set(workflowId, execution);

    try {
      if (workflow.parallel) {
        await this.executeParallel(workflow, execution);
      } else {
        await this.executeSequential(workflow, execution);
      }

      // Check if all steps completed successfully
      const allSuccess = workflow.steps.every(
        (step) => execution.completedSteps.includes(step.stepId) && !execution.failedSteps.includes(step.stepId)
      );

      if (allSuccess) {
        workflow.status = "completed";
        // Emit workflow completed event
        try {
          const { gptEventStream } = await import("./GPTEventStream");
          await gptEventStream.emitGPTEvent(
            workflow.metadata?.initiator || "system",
            "gpt.workflow.completed",
            {
              workflowId: workflow.workflowId,
              name: workflow.name,
              completedSteps: execution.completedSteps.length,
              totalSteps: workflow.steps.length,
            }
          );
        } catch (error: any) {
          // Event emission failed, continue
          console.warn("[GPT Orchestrator] Failed to emit event:", error.message);
        }
      } else {
        workflow.status = "failed";
        // Emit workflow failed event
        try {
          const { gptEventStream } = await import("./GPTEventStream");
          await gptEventStream.emitGPTEvent(
            workflow.metadata?.initiator || "system",
            "gpt.workflow.failed",
            {
              workflowId: workflow.workflowId,
              name: workflow.name,
              failedSteps: execution.failedSteps,
            }
          );
        } catch (error: any) {
          // Event emission failed, continue
          console.warn("[GPT Orchestrator] Failed to emit event:", error.message);
        }
      }

      workflow.completedAt = new Date().toISOString();
    } catch (error: any) {
      workflow.status = "failed";
      workflow.completedAt = new Date().toISOString();
      console.error(`[GPT Orchestrator] Workflow ${workflowId} failed:`, error);
    }

    return workflow;
  }

  /**
   * Execute workflow steps sequentially
   */
  private async executeSequential(workflow: GPTWorkflow, execution: GPTWorkflowExecution): Promise<void> {
    for (const step of workflow.steps) {
      execution.currentStep = step.stepId;

      // Check waitFor dependencies
      if (step.waitFor && step.waitFor.length > 0) {
        const allDepsCompleted = step.waitFor.every((depStepId) => execution.completedSteps.includes(depStepId));
        if (!allDepsCompleted) {
          console.warn(`[GPT Orchestrator] Step ${step.stepId} waiting for dependencies: ${step.waitFor.join(", ")}`);
          // In a real implementation, we'd wait or retry
          // For now, skip if dependencies not met
          continue;
        }
      }

      // Check condition
      if (step.condition) {
        const conditionMet = this.evaluateCondition(step.condition, workflow.results);
        if (!conditionMet) {
          console.log(`[GPT Orchestrator] Step ${step.stepId} condition not met, skipping`);
          continue;
        }
      }

      // Execute step
      const result = await this.executeStep(step, workflow);
      workflow.results[step.stepId] = result;

      if (result.success) {
        execution.completedSteps.push(step.stepId);
      } else {
        execution.failedSteps.push(step.stepId);
        // Stop on first failure (can be made configurable)
        break;
      }
    }
  }

  /**
   * Execute workflow steps in parallel (respecting waitFor)
   */
  private async executeParallel(workflow: GPTWorkflow, execution: GPTWorkflowExecution): Promise<void> {
    const stepPromises: Array<Promise<GPTWorkflowStepResult>> = [];

    for (const step of workflow.steps) {
      // Check waitFor dependencies
      if (step.waitFor && step.waitFor.length > 0) {
        // Wait for dependencies before starting
        await this.waitForDependencies(step.waitFor, execution);
      }

      // Execute step
      const stepPromise = this.executeStep(step, workflow).then((result) => {
        workflow.results[step.stepId] = result;
        if (result.success) {
          execution.completedSteps.push(step.stepId);
        } else {
          execution.failedSteps.push(step.stepId);
        }
        return result;
      });

      stepPromises.push(stepPromise);
    }

    await Promise.all(stepPromises);
  }

  /**
   * Wait for dependencies to complete
   */
  private async waitForDependencies(depStepIds: string[], execution: GPTWorkflowExecution): Promise<void> {
    const maxWait = 60000; // 60 seconds max wait
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const allCompleted = depStepIds.every((depId) => execution.completedSteps.includes(depId));
      if (allCompleted) {
        return;
      }

      // Check if any dependency failed
      const anyFailed = depStepIds.some((depId) => execution.failedSteps.includes(depId));
      if (anyFailed) {
        throw new Error(`Dependency failed: ${depStepIds.join(", ")}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    }

    throw new Error(`Timeout waiting for dependencies: ${depStepIds.join(", ")}`);
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(step: GPTWorkflowStep, workflow: GPTWorkflow): Promise<GPTWorkflowStepResult> {
    const startTime = Date.now();
    const startedAt = new Date().toISOString();

    try {
      // Resolve GPT
      const gpt = gptAgentRegistry.getAllGPTs().find(
        (g) => g.name === step.gpt || cleanGPTId(g.name) === cleanGPTId(step.gpt)
      );

      if (!gpt) {
        return {
          stepId: step.stepId,
          gpt: step.gpt,
          success: false,
          error: `GPT not found: ${step.gpt}`,
          duration: Date.now() - startTime,
          startedAt,
        };
      }

      // Check registration
      const status = gptAgentRegistry.getStatus(gpt.name);
      if (!status?.isRegistered) {
        return {
          stepId: step.stepId,
          gpt: step.gpt,
          success: false,
          error: `GPT not registered: ${step.gpt}`,
          duration: Date.now() - startTime,
          startedAt,
        };
      }

      // Execute action based on action type
      let result: any;
      const timeout = step.timeout || 30000; // Default 30 seconds

      if (step.action === "message" || step.action === "send") {
        // Send message
        const messageResult = await Promise.race([
          gptCommunicationBridge.sendMessage({
            from: workflow.metadata?.initiator || "system",
            to: step.gpt,
            topic: step.params?.topic || "workflow",
            text: step.params?.message || step.params?.text || "",
            meta: {
              ...step.params?.meta,
              workflowId: workflow.workflowId,
              stepId: step.stepId,
            },
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout)),
        ]);

        result = { messageSent: messageResult.success };
      } else if (step.action === "query") {
        // Query GPT
        const queryResult = await Promise.race([
          gptCommunicationBridge.queryGPT({
            from: workflow.metadata?.initiator || "system",
            to: step.gpt,
            query: step.params?.query || "",
            context: step.params?.context,
            sessionId: workflow.workflowId,
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout)),
        ]);

        result = queryResult.response || queryResult;
      } else {
        // Generic action - send as message with action flag
        const actionResult = await Promise.race([
          gptCommunicationBridge.sendMessage({
            from: workflow.metadata?.initiator || "system",
            to: step.gpt,
            topic: "action",
            text: JSON.stringify({
              action: step.action,
              params: step.params,
            }),
            meta: {
              workflowId: workflow.workflowId,
              stepId: step.stepId,
              action: step.action,
            },
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout)),
        ]);

        result = { actionSent: actionResult.success };
      }

      return {
        stepId: step.stepId,
        gpt: step.gpt,
        success: true,
        data: result,
        duration: Date.now() - startTime,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        stepId: step.stepId,
        gpt: step.gpt,
        success: false,
        error: error.message,
        duration: Date.now() - startTime,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Evaluate condition expression
   */
  private evaluateCondition(condition: string, results: Record<string, GPTWorkflowStepResult>): boolean {
    try {
      // Simple condition evaluation
      // Supports: "previous.success === true", "step1.success && step2.success", etc.
      // Replace step references with actual results
      let evalCondition = condition;
      for (const [stepId, result] of Object.entries(results)) {
        evalCondition = evalCondition.replace(
          new RegExp(`\\b${stepId}\\.(success|data|error)`, "g"),
          `results['${stepId}'].${RegExp.$1}`
        );
        evalCondition = evalCondition.replace(new RegExp(`\\b${stepId}\\b`, "g"), `results['${stepId}']`);
      }

      // Replace "previous" with last result
      const lastStepId = Object.keys(results).pop();
      if (lastStepId) {
        evalCondition = evalCondition.replace(/previous\./g, `results['${lastStepId}'].`);
      }

      // Evaluate (in a real implementation, use a safe evaluator)
      // For now, simple boolean checks
      if (evalCondition.includes("success === true") || evalCondition.includes("success == true")) {
        const stepId = evalCondition.match(/results\['([^']+)'\]/)?.[1];
        if (stepId) {
          return results[stepId]?.success === true;
        }
      }

      // Default: return true if condition can't be evaluated (permissive)
      return true;
    } catch (error: any) {
      console.warn(`[GPT Orchestrator] Condition evaluation failed: ${error.message}`);
      return true; // Default to allowing step
    }
  }

  /**
   * Get workflow status
   */
  getWorkflow(workflowId: string): GPTWorkflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get all workflows
   */
  getAllWorkflows(): GPTWorkflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Cancel a workflow
   */
  cancelWorkflow(workflowId: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return false;
    }

    if (workflow.status === "running") {
      workflow.status = "cancelled";
      workflow.completedAt = new Date().toISOString();
      return true;
    }

    return false;
  }

  /**
   * Get workflow execution status
   */
  getExecutionStatus(workflowId: string): GPTWorkflowExecution | undefined {
    return this.executions.get(workflowId);
  }
}

// Singleton instance
export const gptOrchestrator = new GPTOrchestrator();

