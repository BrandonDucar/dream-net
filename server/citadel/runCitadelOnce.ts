/**
 * Run The Citadel Once
 * 
 * Runs all Citadel agents (1-8) and collects their outputs into a structured response
 */

import CitadelCore from "../../packages/citadel-core/index.js";
import {
  readSnapshot,
  readDomeReport,
  readDomeCommands,
  readEventFabricSpec,
  readMonitoringBlueprint,
  readDreamkeeperSpec,
  readSurgeonProtocols,
  readDeploykeeperBlueprint,
  readInfraUnificationPlan,
  readDataSpineSpec,
  readStoragePlan,
  readMigrationRecommendations,
  readSocialopsSpec,
  readExternalEdgePlaybooks,
  readRiskAndSafetyGuidelines,
  readMasterBlueprint,
  readEvolutionRoadmap,
  readRiskMatrix,
} from "../services/AgentHelpers.js";

export interface CitadelState {
  snapshot: any;
  dome: {
    report: any;
    commands: any[];
  };
  eventFabric: any;
  monitoring: any;
  dreamkeeper: {
    spec: any;
    protocols: any;
  };
  deploykeeper: {
    blueprint: any;
    infraPlan: any;
  };
  dataSpine: {
    spec: any;
    storagePlan: any;
    migrationRecommendations: any;
  };
  socialops: {
    spec: any;
    playbooks: any;
    guidelines: any;
  };
  masterPlan: {
    blueprint: any;
    roadmap: any;
    riskMatrix: any;
  };
  meta: {
    agentsRun: number[];
    errors: string[];
    timestamp: string;
  };
}

/**
 * Run The Citadel once and collect all outputs
 */
export async function runCitadelOnce(): Promise<CitadelState> {
  console.log("[Citadel] Running Citadel cycle and collecting outputs...");

  // Run the Citadel cycle
  const { agentsRun, errors } = await CitadelCore.run();

  // Collect all agent outputs
  const [
    snapshot,
    domeReport,
    domeCommands,
    eventFabric,
    monitoring,
    dreamkeeperSpec,
    surgeonProtocols,
    deploykeeperBlueprint,
    infraPlan,
    dataSpineSpec,
    storagePlan,
    migrationRecommendations,
    socialopsSpec,
    playbooks,
    guidelines,
    masterBlueprint,
    roadmap,
    riskMatrix,
  ] = await Promise.all([
    readSnapshot(),
    readDomeReport(),
    readDomeCommands(),
    readEventFabricSpec(),
    readMonitoringBlueprint(),
    readDreamkeeperSpec(),
    readSurgeonProtocols(),
    readDeploykeeperBlueprint(),
    readInfraUnificationPlan(),
    readDataSpineSpec(),
    readStoragePlan(),
    readMigrationRecommendations(),
    readSocialopsSpec(),
    readExternalEdgePlaybooks(),
    readRiskAndSafetyGuidelines(),
    readMasterBlueprint(),
    readEvolutionRoadmap(),
    readRiskMatrix(),
  ]);

  const state: CitadelState = {
    snapshot: snapshot || null,
    dome: {
      report: domeReport || null,
      commands: domeCommands || [],
    },
    eventFabric: eventFabric || null,
    monitoring: monitoring || null,
    dreamkeeper: {
      spec: dreamkeeperSpec || null,
      protocols: surgeonProtocols || null,
    },
    deploykeeper: {
      blueprint: deploykeeperBlueprint || null,
      infraPlan: infraPlan || null,
    },
    dataSpine: {
      spec: dataSpineSpec || null,
      storagePlan: storagePlan || null,
      migrationRecommendations: migrationRecommendations || null,
    },
    socialops: {
      spec: socialopsSpec || null,
      playbooks: playbooks || null,
      guidelines: guidelines || null,
    },
    masterPlan: {
      blueprint: masterBlueprint || null,
      roadmap: roadmap || null,
      riskMatrix: riskMatrix || null,
    },
    meta: {
      agentsRun,
      errors,
      timestamp: new Date().toISOString(),
    },
  };

  console.log(`[Citadel] Collected outputs from ${agentsRun.length} agents`);

  return state;
}

