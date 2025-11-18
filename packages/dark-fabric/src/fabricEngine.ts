import type { FabricTask, DiffResult, SandboxResult } from "./types";
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { runSandbox } from "./sandbox";
import { computeFileDiff } from "./diffEngine";
import { validateTask, validateCodeSafety } from "./validators";

const FABRIC_STORE_PATH = join(__dirname, "../store/fabricStore.json");

interface FabricStore {
  tasks: FabricTask[];
}

function loadStore(): FabricStore {
  if (!existsSync(FABRIC_STORE_PATH)) {
    return { tasks: [] };
  }
  try {
    const content = readFileSync(FABRIC_STORE_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return { tasks: [] };
  }
}

function saveStore(store: FabricStore): void {
  const dir = join(FABRIC_STORE_PATH, "..");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(FABRIC_STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function createFabricTask(data: Omit<FabricTask, "id" | "createdAt" | "updatedAt" | "status"> & Partial<Pick<FabricTask, "id" | "status">>): FabricTask {
  const store = loadStore();
  const task: FabricTask = {
    ...data,
    id: data.id ?? `fabric-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    status: data.status ?? "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  store.tasks.push(task);
  saveStore(store);
  return task;
}

export function getFabricTask(id: string): FabricTask | null {
  return loadStore().tasks.find((t) => t.id === id) ?? null;
}

export function listFabricTasks(filters?: {
  type?: FabricTask["type"];
  status?: FabricTask["status"];
}): FabricTask[] {
  let tasks = loadStore().tasks;
  if (filters?.type) {
    tasks = tasks.filter((t) => t.type === filters.type);
  }
  if (filters?.status) {
    tasks = tasks.filter((t) => t.status === filters.status);
  }
  return tasks;
}

export function updateFabricTask(id: string, patch: Partial<FabricTask>): FabricTask | null {
  const store = loadStore();
  const index = store.tasks.findIndex((t) => t.id === id);
  if (index < 0) return null;
  store.tasks[index] = {
    ...store.tasks[index],
    ...patch,
    updatedAt: new Date(),
  };
  saveStore(store);
  return store.tasks[index];
}

export async function generateCode(task: FabricTask): Promise<FabricTask> {
  // Phase 1: Placeholder code generation
  // Phase 2: Integrate with LLM API for actual code generation
  const generatedCode = `// Generated code for: ${task.instruction}\n// Target: ${JSON.stringify(task.target)}\n\nexport function generated() {\n  // TODO: Implement\n}`;

  const updated = updateFabricTask(task.id, {
    status: "running",
    generated: {
      code: generatedCode,
    },
  });

  if (!updated) {
    throw new Error(`Task ${task.id} not found`);
  }

  return updated;
}

export async function runFabricTask(taskId: string): Promise<FabricTask> {
  const task = getFabricTask(taskId);
  if (!task) {
    throw new Error(`Task ${taskId} not found`);
  }

  // Generate code if not present
  if (!task.generated?.code) {
    await generateCode(task);
  }

  const updatedTask = getFabricTask(taskId);
  if (!updatedTask || !updatedTask.generated?.code) {
    throw new Error(`Failed to generate code for task ${taskId}`);
  }

  // Run in sandbox
  const sandboxResult = await runSandbox(updatedTask.generated.code);

  // Compute diff if target file exists
  let diff: DiffResult | null = null;
  if (updatedTask.target.filePath) {
    diff = await computeFileDiff(updatedTask.target.filePath, updatedTask.generated.code);
  }

  // Validate
  const validation = validateTask(updatedTask);
  const codeSafety = validateCodeSafety(updatedTask.generated.code);

  // Update task with results
  const finalTask = updateFabricTask(taskId, {
    status: sandboxResult.success && validation.passed ? "completed" : "failed",
    sandbox: {
      runId: sandboxResult.runId,
      testResults: sandboxResult.testResults,
      executionTime: sandboxResult.executionTime,
    },
    generated: {
      ...updatedTask.generated,
      diff: diff?.diff,
    },
    validation: {
      passed: validation.passed && codeSafety.passed,
      issues: [...validation.issues, ...codeSafety.issues],
      warnings: [...validation.warnings, ...codeSafety.warnings],
    },
  });

  if (!finalTask) {
    throw new Error(`Failed to update task ${taskId}`);
  }

  return finalTask;
}

export function approveFabricTask(taskId: string, approvedBy: string, reason?: string): FabricTask | null {
  return updateFabricTask(taskId, {
    status: "approved",
    approval: {
      approvedBy,
      approvedAt: new Date(),
      reason,
    },
  });
}

export function rejectFabricTask(taskId: string, rejectedBy: string, reason?: string): FabricTask | null {
  return updateFabricTask(taskId, {
    status: "rejected",
    approval: {
      rejectedBy,
      rejectedAt: new Date(),
      reason,
    },
  });
}

