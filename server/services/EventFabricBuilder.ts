/**
 * Event Fabric Builder Service (Agent 3)
 * 
 * Designs coherent, future-proof event fabric and monitoring blueprint for DreamNet
 */

import {
  readSnapshot,
  readDomeReport,
  readDomeCommands,
} from "./AgentHelpers";
import { storeOutput } from "./AgentOutputStore";

interface EventFamily {
  id: string;
  description: string;
  events: Array<{
    name: string;
    required_fields: string[];
    optional_fields: string[];
    semantics: string;
  }>;
}

interface EventFabricSpec {
  families: EventFamily[];
  global_conventions: {
    naming: string;
    timestamps: string;
    ids: string;
    versioning: string;
  };
  implementation_notes: string[];
}

interface MonitoringStream {
  id: string;
  source_events: string[];
  purpose: string;
  aggregation_rules: string[];
}

interface Dashboard {
  id: string;
  title: string;
  widgets: string[];
  source_streams: string[];
}

interface Alert {
  id: string;
  description: string;
  conditions: string[];
  severity: "medium" | "high" | "critical";
  targets: string[];
}

interface MonitoringBlueprint {
  streams: MonitoringStream[];
  dashboards: Dashboard[];
  alerts: Alert[];
  storage: Array<{
    type: string;
    retention: string;
    purpose: string;
  }>;
  rollup_jobs: Array<{
    id: string;
    frequency: string;
    purpose: string;
    aggregations: string[];
  }>;
}

/**
 * Generate event fabric spec
 */
export async function generateEventFabricSpec(): Promise<EventFabricSpec> {
  const snapshot = await readSnapshot();
  const domeReport = await readDomeReport();

  if (!snapshot) {
    throw new Error("No vertex_fusion_snapshot found. Generate one first with Agent 1.");
  }

  const families: EventFamily[] = [
    {
      id: "dream_lifecycle",
      description: "Events about dream creation, evolution, infection, healing, archiving",
      events: [
        {
          name: "dream.created",
          required_fields: ["dream_id", "creator_id", "tags", "timestamp"],
          optional_fields: ["chain", "tx_hash", "metadata"],
          semantics: "Fired when a new dream is registered in the network",
        },
        {
          name: "dream.evolved",
          required_fields: ["dream_id", "from_state", "to_state", "agent_id", "timestamp"],
          optional_fields: ["reason", "score_delta"],
          semantics: "Fired when a dream changes its evolution state",
        },
        {
          name: "dream.infected",
          required_fields: ["dream_id", "infection_type", "timestamp"],
          optional_fields: ["severity", "source"],
          semantics: "Fired when a dream is infected by negative signals",
        },
        {
          name: "dream.healed",
          required_fields: ["dream_id", "healing_agent_id", "timestamp"],
          optional_fields: ["healing_method", "recovery_score"],
          semantics: "Fired when a dream recovers from infection",
        },
        {
          name: "dream.archived",
          required_fields: ["dream_id", "reason", "timestamp"],
          optional_fields: ["final_state", "archive_location"],
          semantics: "Fired when a dream is archived or removed",
        },
      ],
    },
    {
      id: "agent_activity",
      description: "Events about agent actions, errors, and status changes",
      events: [
        {
          name: "agent.started",
          required_fields: ["agent_id", "agent_name", "timestamp"],
          optional_fields: ["version", "config"],
          semantics: "Fired when an agent starts or restarts",
        },
        {
          name: "agent.stopped",
          required_fields: ["agent_id", "reason", "timestamp"],
          optional_fields: ["uptime_seconds", "final_status"],
          semantics: "Fired when an agent stops or crashes",
        },
        {
          name: "agent.error",
          required_fields: ["agent_id", "error_type", "error_message", "timestamp"],
          optional_fields: ["stack_trace", "context"],
          semantics: "Fired when an agent encounters an error",
        },
        {
          name: "agent.heartbeat",
          required_fields: ["agent_id", "timestamp"],
          optional_fields: ["metrics", "status"],
          semantics: "Fired periodically to indicate agent is alive",
        },
        {
          name: "agent.task_completed",
          required_fields: ["agent_id", "task_id", "result", "timestamp"],
          optional_fields: ["duration_ms", "output"],
          semantics: "Fired when an agent completes a task",
        },
      ],
    },
    {
      id: "deployment_pipeline",
      description: "Events about deployments, builds, and infrastructure changes",
      events: [
        {
          name: "deployment.started",
          required_fields: ["deployment_id", "service", "environment", "timestamp"],
          optional_fields: ["commit_hash", "branch"],
          semantics: "Fired when a deployment starts",
        },
        {
          name: "deployment.completed",
          required_fields: ["deployment_id", "status", "timestamp"],
          optional_fields: ["duration_ms", "url"],
          semantics: "Fired when a deployment completes (success or failure)",
        },
        {
          name: "deployment.rolled_back",
          required_fields: ["deployment_id", "reason", "timestamp"],
          optional_fields: ["previous_version"],
          semantics: "Fired when a deployment is rolled back",
        },
        {
          name: "build.started",
          required_fields: ["build_id", "service", "timestamp"],
          optional_fields: ["trigger", "config"],
          semantics: "Fired when a build starts",
        },
        {
          name: "build.completed",
          required_fields: ["build_id", "status", "timestamp"],
          optional_fields: ["duration_ms", "artifacts"],
          semantics: "Fired when a build completes",
        },
      ],
    },
    {
      id: "wallet_scoring",
      description: "Events about wallet scoring and reputation changes",
      events: [
        {
          name: "wallet.scored",
          required_fields: ["wallet_address", "score", "timestamp"],
          optional_fields: ["score_components", "previous_score"],
          semantics: "Fired when a wallet score is calculated or updated",
        },
        {
          name: "wallet.reputation_changed",
          required_fields: ["wallet_address", "from_tier", "to_tier", "timestamp"],
          optional_fields: ["reason"],
          semantics: "Fired when a wallet's reputation tier changes",
        },
      ],
    },
    {
      id: "social_activity",
      description: "Events about social media posts, interactions, and external platform activity",
      events: [
        {
          name: "social.posted",
          required_fields: ["platform", "post_id", "content_type", "timestamp"],
          optional_fields: ["url", "engagement_metrics"],
          semantics: "Fired when content is posted to a social platform",
        },
        {
          name: "social.interaction",
          required_fields: ["platform", "interaction_type", "post_id", "timestamp"],
          optional_fields: ["user_id", "engagement_value"],
          semantics: "Fired when there's engagement (like, share, comment) on social content",
        },
      ],
    },
    {
      id: "mini_app_usage",
      description: "Events about mini app launches, usage, and interactions",
      events: [
        {
          name: "miniapp.launched",
          required_fields: ["app_id", "user_id", "timestamp"],
          optional_fields: ["platform", "referrer"],
          semantics: "Fired when a mini app is launched",
        },
        {
          name: "miniapp.feature_used",
          required_fields: ["app_id", "feature_id", "user_id", "timestamp"],
          optional_fields: ["duration_ms", "success"],
          semantics: "Fired when a mini app feature is used",
        },
      ],
    },
    {
      id: "security_incidents",
      description: "Events about security threats, attacks, and mitigations",
      events: [
        {
          name: "security.threat_detected",
          required_fields: ["threat_type", "severity", "timestamp"],
          optional_fields: ["source", "mitigation_actions"],
          semantics: "Fired when a security threat is detected",
        },
        {
          name: "security.incident_resolved",
          required_fields: ["incident_id", "resolution_method", "timestamp"],
          optional_fields: ["duration_ms", "impact"],
          semantics: "Fired when a security incident is resolved",
        },
      ],
    },
  ];

  const spec: EventFabricSpec = {
    families,
    global_conventions: {
      naming: "domain.action (e.g., dream.created, agent.error)",
      timestamps: "ISO 8601 timestamp field, optional event_time for event occurrence time",
      ids: "*_id fields, UUID v4 or snowflake IDs recommended",
      versioning: "schema_version field for breaking changes, increment major version",
    },
    implementation_notes: [
      "Use Pub/Sub (GCP) or Kafka for event streaming",
      "Ensure replayability by storing events in durable storage",
      "Integrate with existing infra described in vertex_fusion_snapshot.domains.infra",
      "Events should be idempotent where possible",
      "Use CloudEvents format for cross-platform compatibility",
    ],
  };

  return spec;
}

/**
 * Generate monitoring blueprint
 */
export async function generateMonitoringBlueprint(): Promise<MonitoringBlueprint> {
  const snapshot = await readSnapshot();
  const domeReport = await readDomeReport();

  if (!snapshot) {
    throw new Error("No vertex_fusion_snapshot found.");
  }

  const streams: MonitoringStream[] = [
    {
      id: "dreamscope_main_stream",
      source_events: ["dream.*", "agent.*", "wallet_scoring.*"],
      purpose: "Feeds DreamScope dashboard with core lifecycle and score data",
      aggregation_rules: [
        "Keep 24h high-resolution logs",
        "Keep 30d rollups for trends",
      ],
    },
    {
      id: "infra_monitoring_stream",
      source_events: ["deployment.*", "build.*", "agent.heartbeat"],
      purpose: "Monitors infrastructure health and deployment pipeline",
      aggregation_rules: [
        "Keep 7d high-resolution logs",
        "Keep 90d rollups for deployment history",
      ],
    },
    {
      id: "security_stream",
      source_events: ["security.*", "agent.error"],
      purpose: "Security incident detection and response",
      aggregation_rules: [
        "Keep 90d high-resolution logs",
        "Alert on critical severity immediately",
      ],
    },
  ];

  const dashboards: Dashboard[] = [
    {
      id: "dreamscope_overview",
      title: "DreamNet Overview",
      widgets: [
        "Total active dreams",
        "Dream lifecycle funnel",
        "Agent error rate",
        "Wallet score distribution",
        "Top performing dreams",
      ],
      source_streams: ["dreamscope_main_stream"],
    },
    {
      id: "infra_health",
      title: "Infrastructure Health",
      widgets: [
        "Deployment success rate",
        "Build times",
        "Agent uptime",
        "Error rates by service",
      ],
      source_streams: ["infra_monitoring_stream"],
    },
    {
      id: "security_dashboard",
      title: "Security Monitoring",
      widgets: [
        "Active threats",
        "Incident resolution time",
        "Agent error patterns",
        "Threat trends",
      ],
      source_streams: ["security_stream"],
    },
  ];

  const alerts: Alert[] = [
    {
      id: "agent_error_spike",
      description: "High error rate for any single agent",
      conditions: ["agent.errors_per_minute > threshold for 5+ minutes"],
      severity: "high",
      targets: ["DreamKeeper", "infra_team", "operator_dashboard"],
    },
    {
      id: "deployment_failure",
      description: "Deployment failure detected",
      conditions: ["deployment.completed with status=failed"],
      severity: "critical",
      targets: ["DeployKeeper", "infra_team"],
    },
    {
      id: "security_threat_critical",
      description: "Critical security threat detected",
      conditions: ["security.threat_detected with severity=critical"],
      severity: "critical",
      targets: ["Aegis", "security_team", "operator_dashboard"],
    },
  ];

  const blueprint: MonitoringBlueprint = {
    streams,
    dashboards,
    alerts,
    storage: [
      {
        type: "high_resolution_logs",
        retention: "24h-7d depending on stream",
        purpose: "Real-time monitoring and debugging",
      },
      {
        type: "aggregated_metrics",
        retention: "30d-90d",
        purpose: "Trend analysis and historical queries",
      },
      {
        type: "alert_history",
        retention: "90d",
        purpose: "Alert audit trail",
      },
    ],
    rollup_jobs: [
      {
        id: "daily_dream_metrics",
        frequency: "daily",
        purpose: "Aggregate dream lifecycle metrics",
        aggregations: [
          "dreams_created_per_day",
          "dreams_evolved_per_day",
          "average_dream_score",
        ],
      },
      {
        id: "weekly_agent_health",
        frequency: "weekly",
        purpose: "Weekly agent health summary",
        aggregations: [
          "agent_uptime_percentage",
          "total_errors_per_agent",
          "average_task_completion_time",
        ],
      },
    ],
  };

  return blueprint;
}

/**
 * Run full Agent 3 analysis
 */
export async function runEventFabricAnalysis(): Promise<{
  eventFabricSpec: EventFabricSpec;
  monitoringBlueprint: MonitoringBlueprint;
}> {
  const eventFabricSpec = await generateEventFabricSpec();
  const monitoringBlueprint = await generateMonitoringBlueprint();

  // Store outputs
  await storeOutput(3, "event_fabric_spec", eventFabricSpec, {
    dependencies: ["vertex_fusion_snapshot", "drone_dome_report"],
    notes: "Generated by Event Fabric Builder (Agent 3)",
  });

  await storeOutput(3, "monitoring_blueprint", monitoringBlueprint, {
    dependencies: ["vertex_fusion_snapshot", "drone_dome_report"],
    notes: "Generated by Event Fabric Builder (Agent 3)",
  });

  return { eventFabricSpec, monitoringBlueprint };
}

