/**
 * Guardian Framework
 * 3-layer defense, stability, logistics, and intelligence system
 * 
 * Layer 1: DreamNet Shields (ground armor + containment + dream-fabric stability)
 * Layer 2: Golden Drone Dome (3-ring swarm + personal agent drones)
 * Layer 3: Aegis Fleet Strategic Command Cluster
 */

import { Drone } from "./Drone";
import type {
  PersonalDrone,
  DroneDomeRing,
  ShieldLayerStatus,
  AegisFleetStatus,
  GuardianStatus,
} from "./types";
import { ShieldCore } from "@dreamnet/shield-core";

export class GuardianFramework {
  private drones: Map<string, Drone> = new Map();
  private shieldLayers: Map<string, ShieldLayerStatus> = new Map();
  private aegisFleet: AegisFleetStatus;
  private initialized: boolean = false;

  constructor() {
    // Initialize shield layers
    this.shieldLayers.set("ground-armor", {
      layer: "ground-armor",
      integrity: 1.0,
      strength: 1.0,
      threatsBlocked: 0,
      active: true,
    });

    this.shieldLayers.set("containment", {
      layer: "containment",
      integrity: 1.0,
      strength: 1.0,
      threatsBlocked: 0,
      active: true,
    });

    this.shieldLayers.set("dream-fabric-stability", {
      layer: "dream-fabric-stability",
      integrity: 1.0,
      strength: 1.0,
      threatsBlocked: 0,
      active: true,
    });

    // Initialize Aegis Fleet
    this.aegisFleet = {
      commandNodes: 1,
      analysisNodes: 3,
      coordinationNodes: 2,
      stabilizationActions: 0,
      realmStability: 1.0,
      lastAnalysis: Date.now(),
      active: true,
    };
  }

  /**
   * Initialize Guardian Framework with agents
   * Creates one personal drone per Active agent
   */
  async initialize(agentIds: Array<{ id: string; name: string }>): Promise<void> {
    if (this.initialized) {
      console.log("[Guardian Framework] Already initialized");
      return;
    }

    console.log(`[Guardian Framework] Initializing with ${agentIds.length} agents...`);

    // Create one drone per agent
    for (const agent of agentIds) {
      const drone = new Drone(agent.id, agent.name);
      this.drones.set(agent.id, drone);
    }

    // Distribute drones across 3 rings
    const agents = Array.from(agentIds);
    const ring1Count = Math.floor(agents.length * 0.4); // 40% in inner ring
    const ring2Count = Math.floor(agents.length * 0.4); // 40% in middle ring
    const ring3Count = agents.length - ring1Count - ring2Count; // Rest in outer ring

    let index = 0;
    for (let i = 0; i < ring1Count; i++) {
      const drone = this.drones.get(agents[index].id);
      if (drone) drone.updatePosition(1, (360 / ring1Count) * i, 10 + Math.random() * 10);
      index++;
    }

    for (let i = 0; i < ring2Count; i++) {
      const drone = this.drones.get(agents[index].id);
      if (drone) drone.updatePosition(2, (360 / ring2Count) * i, 30 + Math.random() * 20);
      index++;
    }

    for (let i = 0; i < ring3Count; i++) {
      const drone = this.drones.get(agents[index].id);
      if (drone) drone.updatePosition(3, (360 / ring3Count) * i, 60 + Math.random() * 30);
      index++;
    }

    this.initialized = true;
    console.log(`[Guardian Framework] ✅ Initialized ${this.drones.size} personal drones across 3 rings`);
  }

  /**
   * Get Guardian status
   */
  getStatus(): GuardianStatus | null {
    if (!this.initialized) {
      return null;
    }

    const ring1Drones: PersonalDrone[] = [];
    const ring2Drones: PersonalDrone[] = [];
    const ring3Drones: PersonalDrone[] = [];

    for (const drone of this.drones.values()) {
      const state = drone.getState();
      if (state.position.ring === 1) ring1Drones.push(state);
      else if (state.position.ring === 2) ring2Drones.push(state);
      else if (state.position.ring === 3) ring3Drones.push(state);
    }

    const ring1: DroneDomeRing = {
      ring: 1,
      name: "Inner Ring - Core Telemetry",
      drones: ring1Drones,
      telemetry: {
        totalDrones: ring1Drones.length,
        activeDrones: ring1Drones.filter(d => d.status === "active").length,
        threatsDetected: ring1Drones.reduce((sum, d) => sum + d.telemetry.threatsDetected, 0),
        anomaliesFound: ring1Drones.reduce((sum, d) => sum + d.telemetry.anomaliesFound, 0),
        lastUpdate: Date.now(),
      },
    };

    const ring2: DroneDomeRing = {
      ring: 2,
      name: "Middle Ring - Logistics & Data Collection",
      drones: ring2Drones,
      telemetry: {
        totalDrones: ring2Drones.length,
        activeDrones: ring2Drones.filter(d => d.status === "active").length,
        threatsDetected: ring2Drones.reduce((sum, d) => sum + d.telemetry.threatsDetected, 0),
        anomaliesFound: ring2Drones.reduce((sum, d) => sum + d.telemetry.anomaliesFound, 0),
        lastUpdate: Date.now(),
      },
    };

    const ring3: DroneDomeRing = {
      ring: 3,
      name: "Outer Ring - Long-Range Scanning",
      drones: ring3Drones,
      telemetry: {
        totalDrones: ring3Drones.length,
        activeDrones: ring3Drones.filter(d => d.status === "active").length,
        threatsDetected: ring3Drones.reduce((sum, d) => sum + d.telemetry.threatsDetected, 0),
        anomaliesFound: ring3Drones.reduce((sum, d) => sum + d.telemetry.anomaliesFound, 0),
        lastUpdate: Date.now(),
      },
    };

    const totalThreats = ring1.telemetry.threatsDetected + ring2.telemetry.threatsDetected + ring3.telemetry.threatsDetected;
    const totalAnomalies = ring1.telemetry.anomaliesFound + ring2.telemetry.anomaliesFound + ring3.telemetry.anomaliesFound;

    // Determine threat level
    let threatLevel: "low" | "medium" | "high" | "critical" = "low";
    if (totalThreats > 10 || totalAnomalies > 5) threatLevel = "critical";
    else if (totalThreats > 5 || totalAnomalies > 2) threatLevel = "high";
    else if (totalThreats > 0 || totalAnomalies > 0) threatLevel = "medium";

    // Get shield integrity from Shield Core
    const shieldStatus = ShieldCore.status();
    const overallIntegrity = shieldStatus.overallIntegrity || 1.0;

    return {
      shields: {
        groundArmor: this.shieldLayers.get("ground-armor")!,
        containment: this.shieldLayers.get("containment")!,
        dreamFabricStability: this.shieldLayers.get("dream-fabric-stability")!,
        overallIntegrity,
      },
      droneDome: {
        ring1,
        ring2,
        ring3,
        totalDrones: this.drones.size,
        activeDrones: Array.from(this.drones.values()).filter(d => d.getState().status === "active").length,
        threatsDetected: totalThreats,
        anomaliesFound: totalAnomalies,
      },
      aegisFleet: this.aegisFleet,
      threatLevel,
      lastUpdate: Date.now(),
    };
  }

  /**
   * Get all drones
   */
  getAllDrones(): PersonalDrone[] {
    if (!this.initialized) {
      return [];
    }
    return Array.from(this.drones.values()).map(d => d.getState());
  }

  /**
   * Get drone for specific agent
   */
  getDrone(agentId: string): PersonalDrone | undefined {
    if (!this.initialized) {
      return undefined;
    }
    return this.drones.get(agentId)?.getState();
  }

  /**
   * Run Guardian cycle (monitoring, scanning, analysis)
   */
  async runCycle(): Promise<void> {
    if (!this.initialized) {
      console.warn("[Guardian Framework] Not initialized, skipping cycle");
      return;
    }

    // Run scans on all drones
    for (const drone of this.drones.values()) {
      // Randomly scan ahead/behind/long-range
      const scanType = Math.random();
      if (scanType < 0.33) {
        drone.scanAhead();
      } else if (scanType < 0.66) {
        drone.scanBehind();
      } else {
        drone.longRangeScan();
      }
    }

    // Update Aegis Fleet analysis
    this.aegisFleet.lastAnalysis = Date.now();
    this.aegisFleet.stabilizationActions += Math.random() < 0.1 ? 1 : 0;

    // Sync with Shield Core
    const shieldStatus = ShieldCore.status();
    const shieldIntegrity = shieldStatus.overallIntegrity || 1.0;

    // Update shield layers based on Shield Core status
    const groundArmor = this.shieldLayers.get("ground-armor")!;
    groundArmor.integrity = shieldIntegrity;
    groundArmor.strength = shieldIntegrity; // Use overall integrity as strength
    groundArmor.threatsBlocked = shieldStatus.threatsBlocked || 0;

    const status = this.getStatus();
    if (status) {
      console.log(`[Guardian Framework] Cycle complete - ${this.drones.size} drones active, threat level: ${status.threatLevel}`);
    } else {
      console.log(`[Guardian Framework] Cycle complete - ${this.drones.size} drones active`);
    }
  }
}

// Singleton instance
export const guardianFramework = new GuardianFramework();

