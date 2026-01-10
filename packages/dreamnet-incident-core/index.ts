/**
 * DreamNet Incident Core
 * Incident management system
 */

import { incidentStore } from './store/incidentStore.js';
import type { Incident, IncidentEvent, IncidentQuery, IncidentStatus, IncidentSeverity } from './types.js';
import { bridgeToSpiderWeb } from "@dreamnet/dreamnet-operational-bridge";

export const DreamNetIncidentCore = {
  /**
   * Create a new incident
   */
  createIncident(
    title: string,
    description: string,
    severity: IncidentSeverity,
    clusterId?: string,
    metadata?: Record<string, any>
  ): Incident {
    const incident: Incident = {
      id: `incident-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      title,
      description,
      status: "open",
      severity,
      clusterId,
      detectedAt: Date.now(),
      timeline: [
        {
          id: `event-${Date.now()}`,
          timestamp: Date.now(),
          type: "detected",
          message: `Incident detected: ${title}`,
        },
      ],
      tags: [],
      metadata: metadata || {},
    };

    incidentStore.createIncident(incident);
    
    // Bridge incident creation to Spider Web
    bridgeToSpiderWeb({
      type: "incident_created",
      clusterId: incident.clusterId,
      severity: incident.severity,
      message: `Incident created: ${incident.title}`,
      metadata: {
        incidentId: incident.id,
        description: incident.description,
      },
      timestamp: incident.detectedAt,
    });
    
    return incident;
  },

  /**
   * Update incident status
   */
  updateIncidentStatus(
    incidentId: string,
    status: IncidentStatus,
    userId?: string,
    message?: string
  ): void {
    const incident = incidentStore.getIncident(incidentId);
    if (!incident) {
      return;
    }

    const now = Date.now();
    if (status === "resolved" && !incident.resolvedAt) {
      incident.resolvedAt = now;
    }
    if (status === "closed" && !incident.closedAt) {
      incident.closedAt = now;
    }

    incident.status = status;

    incidentStore.addEvent(incidentId, {
      id: `event-${now}`,
      timestamp: now,
      type: status === "investigating" ? "investigating" : status === "resolved" ? "resolved" : status === "closed" ? "closed" : "updated",
      userId,
      message: message || `Status changed to ${status}`,
    });

    incidentStore.updateIncident(incidentId, incident);
    
    // Bridge incident resolution to Spider Web
    if (status === "resolved") {
      bridgeToSpiderWeb({
        type: "incident_resolved",
        clusterId: incident.clusterId,
        severity: incident.severity,
        message: `Incident resolved: ${incident.title}`,
        metadata: {
          incidentId: incident.id,
          resolution: incident.resolution,
        },
        timestamp: Date.now(),
      });
    }
  },

  /**
   * Add event to incident timeline
   */
  addEvent(incidentId: string, event: Omit<IncidentEvent, "id" | "timestamp">): void {
    const fullEvent: IncidentEvent = {
      id: `event-${Date.now()}`,
      timestamp: Date.now(),
      ...event,
    };
    incidentStore.addEvent(incidentId, fullEvent);
  },

  /**
   * Query incidents
   */
  queryIncidents(query: IncidentQuery): Incident[] {
    return incidentStore.queryIncidents(query);
  },

  /**
   * Get open incidents
   */
  getOpenIncidents(): Incident[] {
    return incidentStore.getOpenIncidents();
  },

  /**
   * Get incident by ID
   */
  getIncident(incidentId: string): Incident | undefined {
    return incidentStore.getIncident(incidentId);
  },
};

export * from './types.js';
export default DreamNetIncidentCore;

