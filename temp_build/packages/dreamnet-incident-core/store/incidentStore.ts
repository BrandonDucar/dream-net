/**
 * Incident Store
 * Stores incidents and their events
 */

import type { Incident, IncidentEvent, IncidentQuery } from "../types";

class IncidentStore {
  private incidents: Map<string, Incident> = new Map();
  private maxIncidents = 10000;

  createIncident(incident: Incident): void {
    this.incidents.set(incident.id, incident);
    
    // Keep only recent incidents
    if (this.incidents.size > this.maxIncidents) {
      const oldest = Array.from(this.incidents.values())
        .sort((a, b) => a.detectedAt - b.detectedAt)[0];
      this.incidents.delete(oldest.id);
    }
  }

  getIncident(incidentId: string): Incident | undefined {
    return this.incidents.get(incidentId);
  }

  updateIncident(incidentId: string, updates: Partial<Incident>): void {
    const incident = this.incidents.get(incidentId);
    if (incident) {
      Object.assign(incident, updates);
      this.incidents.set(incidentId, incident);
    }
  }

  addEvent(incidentId: string, event: IncidentEvent): void {
    const incident = this.incidents.get(incidentId);
    if (incident) {
      incident.timeline.push(event);
      this.incidents.set(incidentId, incident);
    }
  }

  queryIncidents(query: IncidentQuery): Incident[] {
    let filtered = Array.from(this.incidents.values());

    if (query.status) {
      filtered = filtered.filter((i) => i.status === query.status);
    }

    if (query.severity) {
      filtered = filtered.filter((i) => i.severity === query.severity);
    }

    if (query.clusterId) {
      filtered = filtered.filter((i) => i.clusterId === query.clusterId);
    }

    if (query.assignedTo) {
      filtered = filtered.filter((i) => i.assignedTo === query.assignedTo);
    }

    if (query.startTime) {
      filtered = filtered.filter((i) => i.detectedAt >= query.startTime!);
    }

    if (query.endTime) {
      filtered = filtered.filter((i) => i.detectedAt <= query.endTime!);
    }

    // Sort by detectedAt descending
    filtered.sort((a, b) => b.detectedAt - a.detectedAt);

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    return filtered.slice(offset, offset + limit);
  }

  getOpenIncidents(): Incident[] {
    return Array.from(this.incidents.values()).filter(
      (i) => i.status === "open" || i.status === "investigating"
    );
  }
}

export const incidentStore = new IncidentStore();

