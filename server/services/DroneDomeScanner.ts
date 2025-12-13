/**
 * Drone Dome Scanner Service (Agent 2)
 * 
 * Ingests vertex_fusion_snapshot from Agent 1 and builds dome view of overall health,
 * risk, and priorities across agents, apps, services, data, events, integrations, and infra.
 */

import { readSnapshot } from "./AgentHelpers";
import { storeOutput } from "./AgentOutputStore";

interface DroneDomeReport {
  summary: string;
  overall_health: "stable" | "fragile" | "unknown" | "critical";
  risk_zones: Array<{
    id: string;
    category: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    evidence: string[];
    recommended_actions: string[];
  }>;
  priority_zones: Array<{
    id: string;
    category: string;
    impact: string;
    description: string;
    owners: string[];
    dependencies: string[];
  }>;
  maps: {
    agents: Array<{
      id: string;
      name: string;
      status: "planned" | "active" | "unclear";
      risk: "low" | "medium" | "high" | "unknown";
      importance: "core" | "supporting" | "experimental";
      notes: string;
    }>;
    apps: Array<{
      id: string;
      name: string;
      status: "planned" | "active" | "unclear";
      risk: "low" | "medium" | "high" | "unknown";
      importance: "core" | "supporting" | "experimental";
      notes: string;
    }>;
    services: Array<{
      id: string;
      name: string;
      status: "planned" | "active" | "unclear";
      risk: "low" | "medium" | "high" | "unknown";
      importance: "core" | "supporting" | "experimental";
      notes: string;
    }>;
    data: Array<{
      id: string;
      name: string;
      status: "planned" | "active" | "unclear";
      risk: "low" | "medium" | "high" | "unknown";
      importance: "core" | "supporting" | "experimental";
      notes: string;
    }>;
    events: Array<{
      id: string;
      name: string;
      status: "planned" | "active" | "unclear";
      risk: "low" | "medium" | "high" | "unknown";
      importance: "core" | "supporting" | "experimental";
      notes: string;
    }>;
    integrations: Array<{
      id: string;
      name: string;
      status: "planned" | "active" | "unclear";
      risk: "low" | "medium" | "high" | "unknown";
      importance: "core" | "supporting" | "experimental";
      notes: string;
    }>;
    infra: Array<{
      id: string;
      name: string;
      status: "planned" | "active" | "unclear";
      risk: "low" | "medium" | "high" | "unknown";
      importance: "core" | "supporting" | "experimental";
      notes: string;
    }>;
  };
}

interface DroneDomeCommand {
  id: string;
  target_agent: number;
  goal: string;
  context_refs: string[];
  priority: "high" | "medium" | "low";
  steps: string[];
}

/**
 * Generate drone dome report from snapshot
 */
export async function generateDomeReport(): Promise<DroneDomeReport> {
  const snapshot = await readSnapshot();

  if (!snapshot) {
    throw new Error("No vertex_fusion_snapshot found. Generate one first with Agent 1.");
  }

  // Analyze snapshot and build dome view
  const agents = snapshot.domains?.ai_agents || [];
  const apps = snapshot.domains?.apps || [];
  const services = snapshot.domains?.services || [];
  const data = snapshot.domains?.data || [];
  const events = snapshot.domains?.events || [];
  const integrations = snapshot.domains?.integrations || [];
  const infra = snapshot.domains?.infra || [];

  // Determine overall health
  const activeAgents = agents.filter((a: any) => a.status === "active").length;
  const totalAgents = agents.length;
  const hasInfraIssues = infra.some((i: any) => i.issues_or_risks?.length > 0);
  const hasMissingDetails = snapshot.todo?.missing_details?.length > 0;

  let overall_health: "stable" | "fragile" | "unknown" | "critical" = "unknown";
  if (activeAgents > 0 && !hasInfraIssues && !hasMissingDetails) {
    overall_health = "stable";
  } else if (hasInfraIssues || hasMissingDetails) {
    overall_health = "fragile";
  } else if (totalAgents === 0) {
    overall_health = "critical";
  }

  // Build risk zones
  const risk_zones = [];
  
  if (hasInfraIssues) {
    risk_zones.push({
      id: "infra_misconfigured_deploys",
      category: "infra",
      severity: "high" as const,
      description: "Infrastructure has known issues or risks that need attention",
      evidence: [
        "infra entries have issues_or_risks fields",
        "Multiple deployment targets need coordination",
      ],
      recommended_actions: [
        "Agent 5 (DEPLOYKEEPER) should align infra entries with real deployment configs",
        "Unify deployment pipeline across platforms",
      ],
    });
  }

  if (hasMissingDetails) {
    risk_zones.push({
      id: "missing_critical_details",
      category: "data",
      severity: "medium" as const,
      description: "Snapshot is missing critical details needed for full understanding",
      evidence: snapshot.todo?.missing_details || [],
      recommended_actions: [
        "Agent 1 should gather missing details",
        "Update snapshot with complete information",
      ],
    });
  }

  if (events.length === 0 || events[0].example_events?.length === 0) {
    risk_zones.push({
      id: "incomplete_event_schema",
      category: "events",
      severity: "medium" as const,
      description: "Event schema definitions are incomplete or missing",
      evidence: [
        "domains.events has minimal or placeholder definitions",
      ],
      recommended_actions: [
        "Agent 3 (EVENT & MONITORING BLUEPRINT BUILDER) should design complete event schemas",
      ],
    });
  }

  // Bridge security risks (Star Bridge, BridgeShield patterns)
  const starBridgeIntegration = integrations.find((i: any) => 
    i.id === "star_bridge_lungs" || 
    i.id?.includes("bridge") || 
    i.type === "bridge" ||
    i.role?.includes("bridge")
  );
  
  if (starBridgeIntegration || integrations.some((i: any) => i.id?.includes("bridge"))) {
    risk_zones.push({
      id: "cross_chain_bridge_vulnerabilities",
      category: "security",
      severity: "high" as const,
      description: "Modular bridges (Star Bridge, Hyperlane, LayerZero concepts) introduce complex cross-chain semantics that can be exploited. Holistic monitoring is required to detect anomalies.",
      evidence: [
        "Cross-chain bridge integrations detected in snapshot",
        "BridgeShield research indicates heterogeneous-graph analysis needed for security",
        "Modular bridge architectures increase attack surface",
      ],
      recommended_actions: [
        "Agent 4 (DREAMKEEPER) should design cross-chain anomaly detection for Star Bridge",
        "Agent 3 (EVENT FABRIC) should include bridge flow events in monitoring blueprint",
        "Agent 5 (DEPLOYKEEPER) should review bridge security configurations",
        "Implement BridgeShield-inspired graph-based security monitoring",
      ],
    });
  } else {
    // Even if no bridge is detected, note the risk for future implementation
    risk_zones.push({
      id: "future_bridge_security_considerations",
      category: "security",
      severity: "medium" as const,
      description: "When Star Bridge or other cross-chain bridges are implemented, they will require specialized security monitoring",
      evidence: [
        "Modular bridge concepts (Hyperlane/LayerZero) are referenced in architecture",
        "Cross-chain operations introduce complex security challenges",
      ],
      recommended_actions: [
        "Agent 4 should prepare diagnostic checks for bridge anomalies",
        "Agent 3 should design event schemas for bridge lifecycle events",
      ],
    });
  }

  // World/lore health risks
  const worldData = snapshot.domains?.world;
  if (worldData) {
    // Check for nightmare corruption indicators
    const nightmareFaction = worldData.factions?.find((f: any) => 
      f.id === "NIGHTMARES" || 
      f.name?.toLowerCase().includes("nightmare") ||
      f.alignment === "chaos"
    );
    
    if (nightmareFaction) {
      risk_zones.push({
        id: "nightmare_corruption_risk",
        category: "world",
        severity: "high" as const,
        description: "Nightmare faction detected in world data. Nightmares spread chaos and corruption. Regions may become corrupted if not monitored and cleansed.",
        evidence: [
          "domains.world.factions includes NIGHTMARES faction",
          "Nightmares have alignment: chaos and corruption abilities",
          "World regions may be vulnerable to nightmare incursions",
        ],
        recommended_actions: [
          "Agent 4 (DREAMKEEPER) should design health metrics for world regions",
          "Agent 4 should create diagnostic checks for nightmare incursion detection",
          "Agent 4 should design surgeon protocols for dispatching cleansing agents",
          "Monitor region_corruption_level metric",
        ],
      });
    }

    // Check for branch stability
    const branchRealms = worldData.regions?.filter((r: any) => 
      r.layer === "BRANCH_REALMS" || 
      r.id?.includes("realm") ||
      r.id?.includes("branch")
    );
    
    if (branchRealms && branchRealms.length > 0) {
      const unstableBranches = branchRealms.filter((r: any) => 
        r.tags?.includes("unstable") || 
        r.description?.toLowerCase().includes("unstable") ||
        r.description?.toLowerCase().includes("corrupt")
      );
      
      if (unstableBranches.length > 0) {
        risk_zones.push({
          id: "branch_realm_instability",
          category: "world",
          severity: "medium" as const,
          description: "Some Branch Realms show signs of instability or corruption. These need monitoring and potential cleansing actions.",
          evidence: [
            `domains.world.regions includes ${unstableBranches.length} unstable branch realms`,
            "Unstable branches may indicate nightmare influence or system stress",
          ],
          recommended_actions: [
            "Agent 4 should monitor branch realm health scores",
            "Agent 4 should design protocols for branch stabilization",
            "Consider dispatching Dream Knights or Cleansing Agents to affected regions",
          ],
        });
      }
    }

    // General world health monitoring recommendation
    if (worldData.regions?.length > 0 || worldData.factions?.length > 0) {
      risk_zones.push({
        id: "world_health_monitoring_needed",
        category: "world",
        severity: "low" as const,
        description: "DreamNet World has active regions and factions. Health monitoring should be integrated into the overall system health framework.",
        evidence: [
          `domains.world contains ${worldData.regions?.length || 0} regions and ${worldData.factions?.length || 0} factions`,
          "World state changes may impact system stability",
        ],
        recommended_actions: [
          "Agent 4 should include world_region as a monitored entity type",
          "Agent 3 should include world_lifecycle events in event fabric",
          "Monitor world events for correlation with system health",
        ],
      });
    }
  }

  // Build priority zones
  const priority_zones = [
    {
      id: "event_fabric_foundation",
      category: "monitoring",
      impact: "network_visibility",
      description: "Event fabric needs to be designed before other monitoring components can be built",
      owners: ["agent_3"],
      dependencies: ["vertex_fusion_snapshot.domains.events", "infra.hosting_stack"],
    },
    {
      id: "health_system_foundation",
      category: "health",
      impact: "system_reliability",
      description: "Health scoring and diagnostic systems need to be designed for DreamKeeper",
      owners: ["agent_4"],
      dependencies: ["vertex_fusion_snapshot", "event_fabric_spec"],
    },
    {
      id: "deployment_unification",
      category: "infra",
      impact: "deployment_efficiency",
      description: "Unified deployment pipeline needed across GCP, Netlify, Vercel",
      owners: ["agent_5"],
      dependencies: ["vertex_fusion_snapshot.domains.infra"],
    },
  ];

  // Build maps
  const mapEntity = (entity: any, type: string) => ({
    id: entity.id || entity.name?.toLowerCase().replace(/\s+/g, "_") || "unknown",
    name: entity.name || entity.id || "Unknown",
    status: entity.status === "active" ? "active" : entity.status === "planned" ? "planned" : "unclear",
    risk: determineRisk(entity),
    importance: determineImportance(entity, type),
    notes: entity.notes || entity.description || "",
  });

  // Build world map if world data exists
  const worldMap: any[] = [];
  if (worldData) {
    if (worldData.regions) {
      worldData.regions.forEach((region: any) => {
        worldMap.push({
          id: region.id,
          name: region.name,
          status: "active",
          risk: region.tags?.includes("corrupt") || region.tags?.includes("unstable") ? "high" : "low",
          importance: region.layer === "SEED" || region.id === "tree.firstTree" ? "core" : "supporting",
          notes: `${region.layer} layer: ${region.description?.substring(0, 100)}...`,
        });
      });
    }
  }

  const report: DroneDomeReport = {
    summary: `DreamNet ecosystem has ${totalAgents} agents (${activeAgents} active), ${apps.length} apps, ${services.length} services. ${hasInfraIssues ? "Infrastructure has known issues." : "Infrastructure appears stable."} ${hasMissingDetails ? "Some critical details are missing." : "Snapshot is complete."}${worldData ? ` World/lore data present: ${worldData.regions?.length || 0} regions, ${worldData.factions?.length || 0} factions.` : ""}`,
    overall_health,
    risk_zones,
    priority_zones,
    maps: {
      agents: agents.map((a: any) => mapEntity(a, "agent")),
      apps: apps.map((a: any) => mapEntity(a, "app")),
      services: services.map((s: any) => mapEntity(s, "service")),
      data: data.map((d: any) => mapEntity(d, "data")),
      events: events.map((e: any) => mapEntity(e, "event")),
      integrations: integrations.map((i: any) => mapEntity(i, "integration")),
      infra: infra.map((i: any) => mapEntity(i, "infra")),
      ...(worldMap.length > 0 ? { world: worldMap } : {}),
    },
  };

  return report;
}

function determineRisk(entity: any): "low" | "medium" | "high" | "unknown" {
  if (entity.issues_or_risks?.length > 0) return "high";
  if (entity.status === "active" && !entity.issues_or_risks) return "low";
  if (entity.status === "planned") return "medium";
  return "unknown";
}

function determineImportance(entity: any, type: string): "core" | "supporting" | "experimental" {
  if (type === "agent" && entity.layer === "orchestration") return "core";
  if (type === "infra" && entity.id === "hosting_stack") return "core";
  if (entity.status === "experimental") return "experimental";
  return "supporting";
}

/**
 * Generate drone dome commands for downstream agents
 */
export async function generateDomeCommands(): Promise<DroneDomeCommand[]> {
  const snapshot = await readSnapshot();
  const domeReport = await generateDomeReport();

  if (!snapshot) {
    throw new Error("No vertex_fusion_snapshot found.");
  }

  const commands: DroneDomeCommand[] = [];

  // Command for Agent 3: Event & Monitoring Blueprint Builder
  commands.push({
    id: "cmd_001_define_event_fabric",
    target_agent: 3,
    goal: "Define initial event schemas and monitoring fabric for DreamScope",
    context_refs: [
      "vertex_fusion_snapshot.domains.events",
      "vertex_fusion_snapshot.domains.services",
      "drone_dome_report.maps.agents",
    ],
    priority: "high",
    steps: [
      "Review existing event definitions in snapshot",
      "Design complete event families (dream_lifecycle, agent_activity, deployment_pipeline, etc.)",
      "Define event schemas with required and optional fields",
      "Create monitoring blueprint with streams, dashboards, and alerts",
      "Output event_fabric_spec and monitoring_blueprint",
    ],
  });

  // Command for Agent 4: DreamKeeper Health & Diagnostic Architect
  commands.push({
    id: "cmd_002_design_health_system",
    target_agent: 4,
    goal: "Design health scores and diagnostic checks for DreamNet entities",
    context_refs: [
      "vertex_fusion_snapshot",
      "drone_dome_report",
      "event_fabric_spec",
    ],
    priority: "high",
    steps: [
      "Define health entities (dreams, agents, services, infra)",
      "Design metrics and scoring models",
      "Create diagnostic checks",
      "Design surgeon protocols for automated repair",
      "Output dreamkeeper_spec and surgeon_protocols",
    ],
  });

  // Command for Agent 5: DeployKeeper Infra & Deploy Architect
  commands.push({
    id: "cmd_003_unify_deployment",
    target_agent: 5,
    goal: "Design unified deployment and infrastructure model",
    context_refs: [
      "vertex_fusion_snapshot.domains.infra",
      "drone_dome_report.risk_zones",
    ],
    priority: "high",
    steps: [
      "Catalog current deployment targets (GCP, Netlify, Vercel)",
      "Design unified deployment blueprint",
      "Create infrastructure unification plan",
      "Define CI/CD flows and config management",
      "Output deploykeeper_blueprint and infra_unification_plan",
    ],
  });

  // Command for Agent 6: Data Spine & Schema Architect
  commands.push({
    id: "cmd_004_design_data_spine",
    target_agent: 6,
    goal: "Transform conceptual domains into concrete data spine",
    context_refs: [
      "vertex_fusion_snapshot.domains",
    ],
    priority: "medium",
    steps: [
      "Define core entities and relations",
      "Choose storage strategies (OLTP/OLAP)",
      "Design event data materialization",
      "Create migration recommendations",
      "Output data_spine_spec, storage_plan, and migration_recommendations",
    ],
  });

  // Command for Agent 7: SocialOps / External-Edge Architect
  commands.push({
    id: "cmd_005_map_external_edges",
    target_agent: 7,
    goal: "Map external platforms and design social operations playbooks",
    context_refs: [
      "vertex_fusion_snapshot.domains.integrations",
    ],
    priority: "medium",
    steps: [
      "Map all social platforms (X, Base, Farcaster, TikTok, etc.)",
      "Map content platforms (Canva, Whatnot, Gumroad)",
      "Map onchain surfaces (Base, Zora, HyperSub)",
      "Design standardized playbooks",
      "Output socialops_spec, external_edge_playbooks, and risk_and_safety_guidelines",
    ],
  });

  // Command for Agent 8: Master Blueprint & Evolution Planner
  commands.push({
    id: "cmd_006_create_master_plan",
    target_agent: 8,
    goal: "Synthesize all agent outputs into phased build plan",
    context_refs: [
      "All outputs from Agents 1-7",
    ],
    priority: "high",
    steps: [
      "Consume all outputs from Agents 1-7",
      "Create phased build plan",
      "Define component dependencies",
      "Set milestones and success criteria",
      "Output master_blueprint, evolution_roadmap, and risk_matrix",
    ],
  });

  return commands;
}

/**
 * Run full Agent 2 analysis
 */
export async function runDroneDomeAnalysis(): Promise<{
  report: DroneDomeReport;
  commands: DroneDomeCommand[];
}> {
  const report = await generateDomeReport();
  const commands = await generateDomeCommands();

  // Store outputs
  await storeOutput(2, "drone_dome_report", report, {
    dependencies: ["vertex_fusion_snapshot"],
    notes: "Generated by Drone Dome Scanner (Agent 2)",
  });

  await storeOutput(2, "drone_dome_commands", commands, {
    dependencies: ["vertex_fusion_snapshot", "drone_dome_report"],
    notes: "Commands for downstream agents (3-8)",
  });

  return { report, commands };
}

