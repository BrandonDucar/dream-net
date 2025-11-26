/**
 * Browser Agent Core Types
 * Type definitions for safe, governed browser capability
 */

/**
 * Browser actions that agents can perform
 */
export type BrowserAction =
  | { type: "open_url"; url: string }
  | { type: "click"; selector: string }
  | { type: "type"; selector: string; text: string }
  | { type: "wait"; ms: number }
  | { type: "extract_text"; selector?: string }
  | { type: "screenshot"; label?: string };

/**
 * Observation returned after a browser action
 */
export interface BrowserObservation {
  url: string;
  htmlSnippet?: string;
  textSnippet?: string;
  screenshotId?: string;
  notes?: string;
  success: boolean;
  error?: string;
}

/**
 * Mission contract defining what an agent can do
 */
export interface BrowserMission {
  missionId: string;
  allowedDomains: string[];
  mode: "read_only" | "limited_write";
  maxSteps: number;
  expiresAt: string; // ISO timestamp
  description: string; // Natural language summary for logs
  agentId: string; // Which agent is running this mission
  createdAt: string; // ISO timestamp
  status: "active" | "completed" | "failed" | "aborted";
  currentStep: number;
}

/**
 * Log entry for audit trail
 */
export interface BrowserLogEntry {
  missionId: string;
  step: number;
  timestamp: string;
  action: BrowserAction;
  observationSummary?: string;
  url?: string;
  success: boolean;
  error?: string;
  duration?: number; // milliseconds
}

/**
 * Credential profile names
 * Credentials are stored in env/secrets and never exposed to the model
 */
export type CredentialProfile = "dreamnet_admin" | "partner_dashboard" | "test_account";

/**
 * Tool input for browser_mission_step
 */
export interface BrowserToolInput {
  mission: BrowserMission | string; // Mission object or missionId
  previousObservation?: BrowserObservation;
  goal: string; // Natural language description of what to do
  action?: BrowserAction; // Optional: specific action to take
}

/**
 * Tool output from browser_mission_step
 */
export interface BrowserToolOutput {
  observation: BrowserObservation;
  notes: string; // Summary of what changed
  missionStatus: BrowserMission["status"];
  remainingSteps: number;
}

/**
 * Mission summary for reporting to DreamKeeper
 */
export interface BrowserMissionSummary {
  missionId: string;
  agentId: string;
  description: string;
  status: BrowserMission["status"];
  totalSteps: number;
  successfulSteps: number;
  failedSteps: number;
  domainsAccessed: string[];
  actionsPerformed: string[];
  startedAt: string;
  completedAt?: string;
  duration?: number; // milliseconds
}

