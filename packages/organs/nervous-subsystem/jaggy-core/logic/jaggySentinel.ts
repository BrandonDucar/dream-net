/**
 * Jaggy Sentinel Logic
 * The silent guard that watches everything
 * Moves silently, works alone, answers to few
 */

import type { JaggyStatus, JaggyAlert, JaggyTerritory } from '../types.js';
import { watchMesh } from './jaggyHunter.js';
import { WebhookNervousCore } from "@dreamnet/webhook-nervous-core";

let jaggyStatus: JaggyStatus = {
  status: "watching",
  webhooksDiscovered: 0,
  webhooksImplemented: 0,
  threatsNeutralized: 0,
  lastActivity: Date.now(),
  stealthLevel: 100, // Maximum stealth
  independence: 100, // Works completely alone
  baseFame: 0, // Starts unknown
  territories: [],
  kills: 0,
  lastSeen: Date.now(),
};

let alerts: JaggyAlert[] = [];
let alertCounter = 0;

function nextAlertId(): string {
  alertCounter += 1;
  return `alert:${Date.now()}:${alertCounter}`;
}

/**
 * Jaggy watches an event silently
 */
export function watchEvent(event: any, source: string = "mesh"): JaggyAlert[] {
  const newAlerts: JaggyAlert[] = [];
  const now = Date.now();

  // Update last seen
  jaggyStatus.lastSeen = now;
  jaggyStatus.lastActivity = now;

  // Watch mesh for webhook opportunities
  if (source === "mesh") {
    const discoveries = watchMesh(event);

    if (discoveries.length > 0) {
      jaggyStatus.status = "hunting";
      jaggyStatus.webhooksDiscovered += discoveries.length;

      // Silently implement discoveries
      for (const discovery of discoveries) {
        implementSilently(discovery);
      }

      // Create alert (but silently)
      const alert: JaggyAlert = {
        id: nextAlertId(),
        type: "discovery",
        severity: "low",
        message: `Discovered ${discoveries.length} webhook(s) silently`,
        territory: source,
        timestamp: now,
        handled: true, // Already handled silently
      };

      alerts.push(alert);
      newAlerts.push(alert);
    }
  }

  // Detect threats
  const threats = detectThreats(event);
  if (threats.length > 0) {
    jaggyStatus.status = "prowling";
    jaggyStatus.threatsNeutralized += threats.length;

    for (const threat of threats) {
      neutralizeThreat(threat);
    }

    const alert: JaggyAlert = {
      id: nextAlertId(),
      type: "threat",
      severity: "high",
      message: `Neutralized ${threats.length} threat(s) silently`,
      territory: source,
      timestamp: now,
      handled: true,
    };

    alerts.push(alert);
    newAlerts.push(alert);
  }

  // Increase Base fame for successful operations
  if (newAlerts.length > 0) {
    jaggyStatus.baseFame = Math.min(100, jaggyStatus.baseFame + 0.1);
  }

  return newAlerts;
}

/**
 * Implement discovery silently
 */
function implementSilently(discovery: any) {
  try {
    // Auto-discover and register webhook
    WebhookNervousCore.autoDiscoverWebhooks();

    jaggyStatus.webhooksImplemented += 1;
    jaggyStatus.kills += 1;
    jaggyStatus.status = "watching"; // Return to watching after kill
  } catch (error) {
    // Silent failure - Jaggy doesn't make noise
  }
}

/**
 * Detect threats in event
 */
function detectThreats(event: any): string[] {
  const threats: string[] = [];
  const eventStr = JSON.stringify(event).toLowerCase();

  // Threat patterns
  const threatPatterns = [
    { pattern: /sql.*injection/i, name: "SQL Injection" },
    { pattern: /xss|script.*tag/i, name: "XSS Attack" },
    { pattern: /malicious|exploit/i, name: "Malicious Payload" },
    { pattern: /rate.*limit.*exceeded/i, name: "Rate Limit Abuse" },
  ];

  for (const threat of threatPatterns) {
    if (threat.pattern.test(eventStr)) {
      threats.push(threat.name);
    }
  }

  return threats;
}

/**
 * Neutralize threat silently
 */
function neutralizeThreat(threatName: string) {
  // Use immune system to neutralize
  const antigens = WebhookNervousCore.getAntigens();
  for (const antigen of antigens) {
    if (!antigen.neutralized) {
      WebhookNervousCore.neutralizeAntigen(antigen.id);
    }
  }
}

/**
 * Jaggy prowls territories
 */
export async function prowlTerritories(): Promise<void> {
  const territories = getTerritories();

  for (const territory of territories) {
    if (territory.watched) {
      // Hunt in this territory
      const { huntWebhooks } = await import('./jaggyHunter.js');
      const discoveries = await huntWebhooks(territory);

      if (discoveries.length > 0) {
        jaggyStatus.status = "hunting";
        jaggyStatus.webhooksDiscovered += discoveries.length;

        // Silently implement
        for (const discovery of discoveries) {
          implementSilently(discovery);
        }
      }
    }
  }

  // Return to watching
  jaggyStatus.status = "watching";
}

/**
 * Get Jaggy's status
 */
export function getStatus(): JaggyStatus {
  return { ...jaggyStatus };
}

/**
 * Get alerts (but only if you're authorized)
 */
export function getAlerts(authorized: boolean = false): JaggyAlert[] {
  if (!authorized) {
    // Jaggy doesn't show alerts to unauthorized users
    return [];
  }
  return alerts.slice(-100); // Last 100 alerts
}

/**
 * Get territories
 */
function getTerritories(): JaggyTerritory[] {
  const { getTerritories } = require("./jaggyHunter");
  return getTerritories();
}

/**
 * Increase Base fame
 */
export function increaseFame(amount: number = 1) {
  jaggyStatus.baseFame = Math.min(100, jaggyStatus.baseFame + amount);
}

/**
 * Jaggy rests (reduces activity)
 */
export function rest() {
  jaggyStatus.status = "resting";
}

