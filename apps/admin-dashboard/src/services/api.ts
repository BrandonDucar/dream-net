/**
 * API client for DreamNet Admin Dashboard
 * Connects to Control Core endpoints
 */

import type {
  OverviewSnapshot,
  ConsciousnessSnapshot,
  GovernanceSnapshot,
} from "../types/api";

const API_BASE = "/api/admin";

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch overview snapshot
 */
export async function fetchOverview(): Promise<OverviewSnapshot> {
  return fetchJSON<OverviewSnapshot>(`${API_BASE}/overview`);
}

/**
 * Fetch consciousness snapshot
 */
export async function fetchConsciousness(): Promise<ConsciousnessSnapshot> {
  return fetchJSON<ConsciousnessSnapshot>(`${API_BASE}/consciousness`);
}

/**
 * Fetch governance snapshot
 */
export async function fetchGovernance(): Promise<GovernanceSnapshot> {
  return fetchJSON<GovernanceSnapshot>(`${API_BASE}/governance/laws`);
}

