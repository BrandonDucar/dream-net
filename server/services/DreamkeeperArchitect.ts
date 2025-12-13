/**
 * DreamKeeper Health & Diagnostic Architect Service (Agent 4)
 * 
 * Designs health scores for dreams, agents, services, and infra
 */

import {
  readSnapshot,
  readDomeReport,
  readEventFabricSpec,
  readMonitoringBlueprint,
} from "./AgentHelpers";
import { storeOutput } from "./AgentOutputStore";

interface Entity {
  type: string;
  id_field: string;
  description: string;
}

interface Metric {
  name: string;
  entity_type: string;
  description: string;
  source_events: string[];
  calculation_notes: string[];
}

interface ScoringModel {
  name: string;
  entity_type: string;
  inputs: string[];
  output_range: string;
  interpretation: Record<string, string>;
}

interface HealthBand {
  range: string;
  label: string;
  color: string;
  action: string;
}

interface DiagnosticCheck {
  id: string;
  entity_type: string;
  description: string;
  conditions: string[];
  required_data: string[];
}

interface DreamkeeperSpec {
  entities: Entity[];
  metrics: Metric[];
  scoring_models: ScoringModel[];
  health_bands: HealthBand[];
  diagnostic_checks: DiagnosticCheck[];
}

interface SurgeonPlaybook {
  id: string;
  applies_to: string;
  trigger_checks: string[];
  steps: string[];
}

interface EscalationRule {
  id: string;
  description: string;
  targets: string[];
  notification_channels: string[];
}

interface SurgeonProtocols {
  playbooks: SurgeonPlaybook[];
  escalation_rules: EscalationRule[];
  integration_points: Array<{
    system: string;
    purpose: string;
    method: string;
  }>;
}

/**
 * Generate dreamkeeper spec
 */
export async function generateDreamkeeperSpec(): Promise<DreamkeeperSpec> {
  const snapshot = await readSnapshot();
  const domeReport = await readDomeReport();
  const eventFabric = await readEventFabricSpec();

  if (!snapshot) {
    throw new Error("No vertex_fusion_snapshot found.");
  }

  const entities: Entity[] = [
    {
      type: "dream",
      id_field: "dream_id",
      description: "Dream objects that evolve over time",
    },
    {
      type: "agent",
      id_field: "agent_id",
      description: "AI agents and GPTs in the DreamNet ecosystem",
    },
    {
      type: "service",
      id_field: "service_id",
      description: "Backend services and API endpoints",
    },
    {
      type: "infra_component",
      id_field: "component_id",
      description: "Infrastructure components (deployments, databases, etc.)",
    },
    {
      type: "wallet",
      id_field: "wallet_address",
      description: "Wallet addresses with reputation scores",
    },
  ];

  const metrics: Metric[] = [
    {
      name: "dream_activity_score",
      entity_type: "dream",
      description: "Composite score of interactions, events, and recency",
      source_events: ["dream.*", "social_activity.*"],
      calculation_notes: [
        "Higher for frequent healthy engagement",
        "Decay over time without interactions",
        "Weight recent events more heavily",
      ],
    },
    {
      name: "agent_error_rate",
      entity_type: "agent",
      description: "Error rate per minute for an agent",
      source_events: ["agent.error", "agent.heartbeat"],
      calculation_notes: [
        "Calculate errors per minute over rolling 5-minute window",
        "Compare to baseline error rate",
      ],
    },
    {
      name: "agent_uptime_percentage",
      entity_type: "agent",
      description: "Percentage of time agent is online and responding",
      source_events: ["agent.heartbeat", "agent.started", "agent.stopped"],
      calculation_notes: [
        "Calculate over rolling 24-hour window",
        "Based on heartbeat frequency",
      ],
    },
    {
      name: "service_response_time",
      entity_type: "service",
      description: "Average response time for service endpoints",
      source_events: ["service.request", "service.response"],
      calculation_notes: [
        "Track p50, p95, p99 response times",
        "Alert on p95 > threshold",
      ],
    },
    {
      name: "infra_deployment_success_rate",
      entity_type: "infra_component",
      description: "Percentage of successful deployments",
      source_events: ["deployment.completed"],
      calculation_notes: [
        "Calculate over rolling 7-day window",
        "Track by service/environment",
      ],
    },
    {
      name: "positive_engagement_ratio",
      entity_type: "dream",
      description: "Ratio of positive to negative interactions",
      source_events: ["social.interaction", "dream.evolved"],
      calculation_notes: [
        "Positive: likes, shares, positive evolution",
        "Negative: reports, infections",
      ],
    },
  ];

  const scoring_models: ScoringModel[] = [
    {
      name: "dream_health_score",
      entity_type: "dream",
      inputs: ["dream_activity_score", "error_incident_count", "positive_engagement_ratio"],
      output_range: "0-100",
      interpretation: {
        "80-100": "healthy",
        "60-79": "watch",
        "40-59": "unstable",
        "0-39": "critical",
      },
    },
    {
      name: "agent_health_score",
      entity_type: "agent",
      inputs: ["agent_uptime_percentage", "agent_error_rate", "agent.task_completion_rate"],
      output_range: "0-100",
      interpretation: {
        "80-100": "healthy",
        "60-79": "watch",
        "40-59": "unstable",
        "0-39": "critical",
      },
    },
    {
      name: "service_health_score",
      entity_type: "service",
      inputs: ["service_response_time", "service_error_rate", "service_availability"],
      output_range: "0-100",
      interpretation: {
        "80-100": "healthy",
        "60-79": "watch",
        "40-59": "unstable",
        "0-39": "critical",
      },
    },
  ];

  const health_bands: HealthBand[] = [
    {
      range: "80-100",
      label: "Healthy",
      color: "green",
      action: "Monitor",
    },
    {
      range: "60-79",
      label: "Watch",
      color: "yellow",
      action: "Investigate",
    },
    {
      range: "40-59",
      label: "Unstable",
      color: "orange",
      action: "Intervene",
    },
    {
      range: "0-39",
      label: "Critical",
      color: "red",
      action: "Emergency Response",
    },
  ];

  const diagnostic_checks: DiagnosticCheck[] = [
    {
      id: "agent_error_burst",
      entity_type: "agent",
      description: "Detects sudden error bursts",
      conditions: [
        "agent.error_count_5m > threshold",
        "or agent.error_rate_5m > baseline * 3",
      ],
      required_data: ["agent_activity events", "monitoring_blueprint.alerts"],
    },
    {
      id: "dream_infection_detected",
      entity_type: "dream",
      description: "Detects when a dream is infected",
      conditions: [
        "dream.infected event received",
        "positive_engagement_ratio < 0.3",
      ],
      required_data: ["dream_lifecycle events", "social_activity events"],
    },
    {
      id: "service_degradation",
      entity_type: "service",
      description: "Detects service performance degradation",
      conditions: [
        "service_response_time.p95 > threshold",
        "service_error_rate > baseline * 2",
      ],
      required_data: ["service metrics", "monitoring_blueprint.alerts"],
    },
    {
      id: "deployment_failure",
      entity_type: "infra_component",
      description: "Detects deployment failures",
      conditions: [
        "deployment.completed with status=failed",
        "deployment_success_rate < 0.8",
      ],
      required_data: ["deployment_pipeline events"],
    },
  ];

  const spec: DreamkeeperSpec = {
    entities,
    metrics,
    scoring_models,
    health_bands,
    diagnostic_checks,
  };

  return spec;
}

/**
 * Generate surgeon protocols
 */
export async function generateSurgeonProtocols(): Promise<SurgeonProtocols> {
  const snapshot = await readSnapshot();
  const eventFabric = await readEventFabricSpec();

  const playbooks: SurgeonPlaybook[] = [
    {
      id: "restart_agent_with_safe_mode",
      applies_to: "agent",
      trigger_checks: ["agent_error_burst"],
      steps: [
        "Mark agent state as 'degraded'",
        "Reduce its workload or route traffic elsewhere",
        "Notify operator / DreamScope",
        "Attempt safe restart or fallback config",
        "Monitor for recovery",
      ],
    },
    {
      id: "heal_infected_dream",
      applies_to: "dream",
      trigger_checks: ["dream_infection_detected"],
      steps: [
        "Identify infection type and severity",
        "Route healing agents to dream",
        "Apply appropriate healing protocol",
        "Monitor recovery progress",
        "Update dream health score",
      ],
    },
    {
      id: "scale_service",
      applies_to: "service",
      trigger_checks: ["service_degradation"],
      steps: [
        "Check current load and capacity",
        "Scale up instances if needed",
        "Route traffic to healthy instances",
        "Monitor recovery",
      ],
    },
    {
      id: "rollback_deployment",
      applies_to: "infra_component",
      trigger_checks: ["deployment_failure"],
      steps: [
        "Identify failed deployment",
        "Revert to previous known-good version",
        "Notify DeployKeeper",
        "Update deployment status",
      ],
    },
  ];

  const escalation_rules: EscalationRule[] = [
    {
      id: "escalate_critical_infra",
      description: "Escalate when core infra is in critical health for >10 minutes",
      targets: ["human_ops", "core_operator", "console"],
      notification_channels: ["email", "chat", "dashboard_banner"],
    },
    {
      id: "escalate_agent_critical",
      description: "Escalate when critical agent fails repeatedly",
      targets: ["DreamKeeper", "infra_team"],
      notification_channels: ["alert", "dashboard"],
    },
  ];

  const integration_points = [
    {
      system: "Event Fabric",
      purpose: "Consume events for health monitoring",
      method: "Subscribe to event streams defined in event_fabric_spec",
    },
    {
      system: "Monitoring Streams",
      purpose: "Feed health metrics to monitoring dashboards",
      method: "Publish health scores to monitoring streams",
    },
    {
      system: "DeployKeeper",
      purpose: "Coordinate deployment-related health checks",
      method: "API integration for deployment status",
    },
    {
      system: "Social / External Edge",
      purpose: "Monitor external platform health",
      method: "Consume social platform health metrics",
    },
  ];

  const protocols: SurgeonProtocols = {
    playbooks,
    escalation_rules,
    integration_points,
  };

  return protocols;
}

/**
 * Run full Agent 4 analysis
 */
export async function runDreamkeeperAnalysis(): Promise<{
  dreamkeeperSpec: DreamkeeperSpec;
  surgeonProtocols: SurgeonProtocols;
}> {
  const dreamkeeperSpec = await generateDreamkeeperSpec();
  const surgeonProtocols = await generateSurgeonProtocols();

  // Store outputs
  await storeOutput(4, "dreamkeeper_spec", dreamkeeperSpec, {
    dependencies: ["vertex_fusion_snapshot", "drone_dome_report", "event_fabric_spec"],
    notes: "Generated by DreamKeeper Architect (Agent 4)",
  });

  await storeOutput(4, "surgeon_protocols", surgeonProtocols, {
    dependencies: ["vertex_fusion_snapshot", "event_fabric_spec"],
    notes: "Generated by DreamKeeper Architect (Agent 4)",
  });

  return { dreamkeeperSpec, surgeonProtocols };
}

