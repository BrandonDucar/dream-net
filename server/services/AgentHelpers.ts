/**
 * Agent Helper Utilities
 * 
 * Helper functions for Vertex AI agents (1-8) to easily read upstream outputs
 * and validate their own outputs
 */

import {
  getLatestOutput,
  getAgentOutputs,
  type AgentOutputType,
  type AgentOutput,
} from "./AgentOutputStore";

/**
 * Read upstream output from a specific agent
 */
export async function readUpstreamOutput(
  agentId: number,
  outputType: AgentOutputType
): Promise<any | null> {
  try {
    const output = await getLatestOutput(agentId, outputType);
    return output?.data || null;
  } catch (error) {
    console.error(`[Agent Helpers] Failed to read upstream output from Agent ${agentId}:`, error);
    return null;
  }
}

/**
 * Read Agent 1's vertex_fusion_snapshot
 */
export async function readSnapshot(): Promise<any | null> {
  return readUpstreamOutput(1, "vertex_fusion_snapshot");
}

/**
 * Read Agent 2's outputs
 */
export async function readDomeReport(): Promise<any | null> {
  return readUpstreamOutput(2, "drone_dome_report");
}

export async function readDomeCommands(): Promise<any | null> {
  return readUpstreamOutput(2, "drone_dome_commands");
}

/**
 * Read Agent 3's outputs
 */
export async function readEventFabricSpec(): Promise<any | null> {
  return readUpstreamOutput(3, "event_fabric_spec");
}

export async function readMonitoringBlueprint(): Promise<any | null> {
  return readUpstreamOutput(3, "monitoring_blueprint");
}

/**
 * Read Agent 4's outputs
 */
export async function readDreamkeeperSpec(): Promise<any | null> {
  return readUpstreamOutput(4, "dreamkeeper_spec");
}

export async function readSurgeonProtocols(): Promise<any | null> {
  return readUpstreamOutput(4, "surgeon_protocols");
}

/**
 * Read Agent 5's outputs
 */
export async function readDeploykeeperBlueprint(): Promise<any | null> {
  return readUpstreamOutput(5, "deploykeeper_blueprint");
}

export async function readInfraUnificationPlan(): Promise<any | null> {
  return readUpstreamOutput(5, "infra_unification_plan");
}

/**
 * Read Agent 6's outputs
 */
export async function readDataSpineSpec(): Promise<any | null> {
  return readUpstreamOutput(6, "data_spine_spec");
}

export async function readStoragePlan(): Promise<any | null> {
  return readUpstreamOutput(6, "storage_plan");
}

export async function readMigrationRecommendations(): Promise<any | null> {
  return readUpstreamOutput(6, "migration_recommendations");
}

/**
 * Read Agent 7's outputs
 */
export async function readSocialopsSpec(): Promise<any | null> {
  return readUpstreamOutput(7, "socialops_spec");
}

export async function readExternalEdgePlaybooks(): Promise<any | null> {
  return readUpstreamOutput(7, "external_edge_playbooks");
}

export async function readRiskAndSafetyGuidelines(): Promise<any | null> {
  return readUpstreamOutput(7, "risk_and_safety_guidelines");
}

/**
 * Read Agent 8's outputs
 */
export async function readMasterBlueprint(): Promise<any | null> {
  return readUpstreamOutput(8, "master_blueprint");
}

export async function readEvolutionRoadmap(): Promise<any | null> {
  return readUpstreamOutput(8, "evolution_roadmap");
}

export async function readRiskMatrix(): Promise<any | null> {
  return readUpstreamOutput(8, "risk_matrix");
}

/**
 * Get all dependencies for an agent
 * Returns a map of outputType -> data
 */
export async function getAgentDependencies(agentId: number): Promise<Record<string, any>> {
  const dependencies: Record<string, any> = {};

  // Agent 1 depends on nothing (it generates the snapshot)
  if (agentId === 1) {
    return dependencies;
  }

  // Agent 2 depends on Agent 1
  if (agentId === 2) {
    const snapshot = await readSnapshot();
    if (snapshot) dependencies.vertex_fusion_snapshot = snapshot;
    return dependencies;
  }

  // Agent 3 depends on Agent 1 and 2
  if (agentId === 3) {
    const snapshot = await readSnapshot();
    const domeReport = await readDomeReport();
    const domeCommands = await readDomeCommands();
    if (snapshot) dependencies.vertex_fusion_snapshot = snapshot;
    if (domeReport) dependencies.drone_dome_report = domeReport;
    if (domeCommands) dependencies.drone_dome_commands = domeCommands;
    return dependencies;
  }

  // Agent 4 depends on Agents 1, 2, 3
  if (agentId === 4) {
    const snapshot = await readSnapshot();
    const domeReport = await readDomeReport();
    const eventFabric = await readEventFabricSpec();
    const monitoring = await readMonitoringBlueprint();
    if (snapshot) dependencies.vertex_fusion_snapshot = snapshot;
    if (domeReport) dependencies.drone_dome_report = domeReport;
    if (eventFabric) dependencies.event_fabric_spec = eventFabric;
    if (monitoring) dependencies.monitoring_blueprint = monitoring;
    return dependencies;
  }

  // Agent 5 depends on Agents 1, 2
  if (agentId === 5) {
    const snapshot = await readSnapshot();
    const domeReport = await readDomeReport();
    if (snapshot) dependencies.vertex_fusion_snapshot = snapshot;
    if (domeReport) dependencies.drone_dome_report = domeReport;
    return dependencies;
  }

  // Agent 6 depends on Agent 1
  if (agentId === 6) {
    const snapshot = await readSnapshot();
    if (snapshot) dependencies.vertex_fusion_snapshot = snapshot;
    return dependencies;
  }

  // Agent 7 depends on Agent 1, 2
  if (agentId === 7) {
    const snapshot = await readSnapshot();
    const domeReport = await readDomeReport();
    if (snapshot) dependencies.vertex_fusion_snapshot = snapshot;
    if (domeReport) dependencies.drone_dome_report = domeReport;
    return dependencies;
  }

  // Agent 8 depends on all previous agents (1-7)
  if (agentId === 8) {
    const snapshot = await readSnapshot();
    const domeReport = await readDomeReport();
    const domeCommands = await readDomeCommands();
    const eventFabric = await readEventFabricSpec();
    const monitoring = await readMonitoringBlueprint();
    const dreamkeeper = await readDreamkeeperSpec();
    const surgeon = await readSurgeonProtocols();
    const deploykeeper = await readDeploykeeperBlueprint();
    const infraPlan = await readInfraUnificationPlan();
    const dataSpine = await readDataSpineSpec();
    const storagePlan = await readStoragePlan();
    const socialops = await readSocialopsSpec();

    if (snapshot) dependencies.vertex_fusion_snapshot = snapshot;
    if (domeReport) dependencies.drone_dome_report = domeReport;
    if (domeCommands) dependencies.drone_dome_commands = domeCommands;
    if (eventFabric) dependencies.event_fabric_spec = eventFabric;
    if (monitoring) dependencies.monitoring_blueprint = monitoring;
    if (dreamkeeper) dependencies.dreamkeeper_spec = dreamkeeper;
    if (surgeon) dependencies.surgeon_protocols = surgeon;
    if (deploykeeper) dependencies.deploykeeper_blueprint = deploykeeper;
    if (infraPlan) dependencies.infra_unification_plan = infraPlan;
    if (dataSpine) dependencies.data_spine_spec = dataSpine;
    if (storagePlan) dependencies.storage_plan = storagePlan;
    if (socialops) dependencies.socialops_spec = socialops;

    return dependencies;
  }

  return dependencies;
}

/**
 * Validate that required dependencies exist for an agent
 */
export async function validateDependencies(agentId: number): Promise<{
  valid: boolean;
  missing: string[];
  available: string[];
}> {
  const dependencies = await getAgentDependencies(agentId);
  const available = Object.keys(dependencies);
  
  // Define required dependencies per agent
  const required: Record<number, string[]> = {
    1: [], // Agent 1 has no dependencies
    2: ["vertex_fusion_snapshot"],
    3: ["vertex_fusion_snapshot", "drone_dome_report"],
    4: ["vertex_fusion_snapshot", "drone_dome_report", "event_fabric_spec"],
    5: ["vertex_fusion_snapshot", "drone_dome_report"],
    6: ["vertex_fusion_snapshot"],
    7: ["vertex_fusion_snapshot", "drone_dome_report"],
    8: ["vertex_fusion_snapshot", "drone_dome_report"], // At minimum
  };

  const requiredForAgent = required[agentId] || [];
  const missing = requiredForAgent.filter((dep) => !available.includes(dep));

  return {
    valid: missing.length === 0,
    missing,
    available,
  };
}

