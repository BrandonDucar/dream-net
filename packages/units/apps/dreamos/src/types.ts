export type CapabilityId =
  | "deploy.vercel"
  | "migrate.drizzle"
  | "scan.integrations";

export type TaskStatus = "queued" | "running" | "succeeded" | "failed" | "needs_approval";

export interface Capability {
  id: CapabilityId;
  desc: string;
  inputs: string[];
  scopes: string[];
  cost_hint: "low" | "medium" | "high";
}

export interface Task {
  id: string;
  capability: CapabilityId;
  payload: Record<string, any>;
  requester: string; // e.g. "chatgpt-pro" or user id
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
  logs: string[];
  artifacts?: Record<string, any>;
}
