/**
 * Guardian Framework Types
 * 3-layer defense, stability, logistics, and intelligence system
 */

export interface PersonalDrone {
  id: string;
  agentId: string;
  agentName: string;
  status: "active" | "idle" | "scanning" | "assisting" | "offline";
  position: {
    ring: 1 | 2 | 3; // Inner, Middle, Outer
    angle: number; // 0-360 degrees
    distance: number; // Distance from center
  };
  capabilities: {
    follow: boolean;
    observe: boolean;
    scanAhead: boolean;
    scanBehind: boolean;
    longRangeScan: boolean;
    taskAssistance: boolean;
  };
  telemetry: {
    lastScan: number;
    threatsDetected: number;
    anomaliesFound: number;
    tasksAssisted: number;
    lastUpdate: number;
  };
  meta?: Record<string, any>;
}

export interface DroneDomeRing {
  ring: 1 | 2 | 3;
  name: string;
  drones: PersonalDrone[];
  telemetry: {
    totalDrones: number;
    activeDrones: number;
    threatsDetected: number;
    anomaliesFound: number;
    lastUpdate: number;
  };
}

export interface ShieldLayerStatus {
  layer: "ground-armor" | "containment" | "dream-fabric-stability";
  integrity: number; // 0-1
  strength: number; // 0-1
  threatsBlocked: number;
  lastBreach?: number;
  active: boolean;
}

export interface AegisFleetStatus {
  commandNodes: number;
  analysisNodes: number;
  coordinationNodes: number;
  stabilizationActions: number;
  realmStability: number; // 0-1
  lastAnalysis: number;
  active: boolean;
}

export interface GuardianStatus {
  shields: {
    groundArmor: ShieldLayerStatus;
    containment: ShieldLayerStatus;
    dreamFabricStability: ShieldLayerStatus;
    overallIntegrity: number; // 0-1
  };
  droneDome: {
    ring1: DroneDomeRing;
    ring2: DroneDomeRing;
    ring3: DroneDomeRing;
    totalDrones: number;
    activeDrones: number;
    threatsDetected: number;
    anomaliesFound: number;
  };
  aegisFleet: AegisFleetStatus;
  threatLevel: "low" | "medium" | "high" | "critical";
  lastUpdate: number;
}

