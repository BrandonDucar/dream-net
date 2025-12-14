/**
 * Personal Agent Drone
 * One drone per agent that follows, observes, scans, and assists
 */

import type { PersonalDrone } from "./types";

export class Drone {
  private drone: PersonalDrone;

  constructor(agentId: string, agentName: string) {
    this.drone = {
      id: `drone-${agentId}`,
      agentId,
      agentName,
      status: "active",
      position: {
        ring: 1, // Start in inner ring
        angle: Math.random() * 360,
        distance: 10 + Math.random() * 20, // 10-30 units from center
      },
      capabilities: {
        follow: true,
        observe: true,
        scanAhead: true,
        scanBehind: true,
        longRangeScan: true,
        taskAssistance: true,
      },
      telemetry: {
        lastScan: Date.now(),
        threatsDetected: 0,
        anomaliesFound: 0,
        tasksAssisted: 0,
        lastUpdate: Date.now(),
      },
    };
  }

  /**
   * Get drone state
   */
  getState(): PersonalDrone {
    return { ...this.drone };
  }

  /**
   * Update drone position (follows agent)
   */
  updatePosition(ring?: 1 | 2 | 3, angle?: number, distance?: number): void {
    if (ring !== undefined) this.drone.position.ring = ring;
    if (angle !== undefined) this.drone.position.angle = angle;
    if (distance !== undefined) this.drone.position.distance = distance;
    this.drone.telemetry.lastUpdate = Date.now();
  }

  /**
   * Scan ahead of agent
   */
  scanAhead(): { threats: number; anomalies: number } {
    this.drone.status = "scanning";
    this.drone.telemetry.lastScan = Date.now();
    
    // Simulate scanning (in production, would check for actual threats)
    const threats = Math.random() < 0.1 ? 1 : 0;
    const anomalies = Math.random() < 0.05 ? 1 : 0;
    
    this.drone.telemetry.threatsDetected += threats;
    this.drone.telemetry.anomaliesFound += anomalies;
    this.drone.status = "active";
    this.drone.telemetry.lastUpdate = Date.now();
    
    return { threats, anomalies };
  }

  /**
   * Scan behind agent
   */
  scanBehind(): { threats: number; anomalies: number } {
    return this.scanAhead(); // Same logic for now
  }

  /**
   * Long-range scan
   */
  longRangeScan(): { threats: number; anomalies: number; distance: number } {
    this.drone.status = "scanning";
    this.drone.telemetry.lastScan = Date.now();
    
    const threats = Math.random() < 0.15 ? 1 : 0;
    const anomalies = Math.random() < 0.08 ? 1 : 0;
    const distance = 100 + Math.random() * 200; // 100-300 units
    
    this.drone.telemetry.threatsDetected += threats;
    this.drone.telemetry.anomaliesFound += anomalies;
    this.drone.status = "active";
    this.drone.telemetry.lastUpdate = Date.now();
    
    return { threats, anomalies, distance };
  }

  /**
   * Assist agent with task
   */
  assistTask(task: string): { success: boolean; assistance: string } {
    this.drone.status = "assisting";
    this.drone.telemetry.tasksAssisted++;
    this.drone.telemetry.lastUpdate = Date.now();
    
    // Simulate task assistance
    const success = Math.random() > 0.2;
    const assistance = `Drone ${this.drone.id} assisted with: ${task}`;
    
    this.drone.status = "active";
    
    return { success, assistance };
  }

  /**
   * Observe agent activity
   */
  observe(): { activity: string; status: string } {
    this.drone.status = "active"; // Use "active" instead of "observe"
    this.drone.telemetry.lastUpdate = Date.now();
    
    const activity = `Observing ${this.drone.agentName} (${this.drone.agentId})`;
    const status = "monitoring";
    
    return { activity, status };
  }

  /**
   * Update drone status
   */
  setStatus(status: PersonalDrone["status"]): void {
    this.drone.status = status;
    this.drone.telemetry.lastUpdate = Date.now();
  }
}

