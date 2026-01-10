/**
 * DreamNet Incident Core Types
 * Incident management system
 */

export type IncidentStatus = "open" | "investigating" | "resolved" | "closed";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  clusterId?: string;
  detectedAt: number;
  resolvedAt?: number;
  closedAt?: number;
  assignedTo?: string;
  timeline: IncidentEvent[];
  rootCause?: string;
  resolution?: string;
  tags: string[];
  metadata: Record<string, any>;
}

export interface IncidentEvent {
  id: string;
  timestamp: number;
  type: "detected" | "updated" | "assigned" | "investigating" | "resolved" | "closed" | "comment";
  userId?: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface IncidentQuery {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  clusterId?: string;
  startTime?: number;
  endTime?: number;
  assignedTo?: string;
  limit?: number;
  offset?: number;
}

