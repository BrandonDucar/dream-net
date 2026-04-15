/**
 * Export the standalone connector function for external use
 */

import type { ConnectorInput, ConnectorOutput } from './task-connector';

export function connectorBotV1(input: ConnectorInput): ConnectorOutput {
  const { currentState, goal, lastFailure, availableBots } = input;

  if (lastFailure?.includes("DB")) {
    return {
      nextBot: "BackendPrepBot",
      instructions: "Repair the database schema and reconfigure connection settings.",
      fallbackOptions: ["ConnectorBot", "AdminDashboardAgent"]
    };
  }

  if (goal.includes("frontend") && availableBots.includes("WebsitePrepBot")) {
    return {
      nextBot: "WebsitePrepBot",
      instructions: "Scaffold and deploy frontend for current Dream Core.",
      fallbackOptions: ["DreamIntakeBot", "ConnectorBot"]
    };
  }

  if (goal.includes("admin") && availableBots.includes("AdminDashboardAgent")) {
    return {
      nextBot: "AdminDashboardAgent",
      instructions: "Set up wallet-based admin interface and secret key handling.",
      fallbackOptions: ["BackendPrepBot", "ConnectorBot"]
    };
  }

  return {
    nextBot: "ConnectorBot",
    instructions: "Unable to determine next step. Ask user for more detail or reattempt with different fallback.",
    fallbackOptions: ["WebsitePrepBot", "BackendPrepBot"]
  };
}

// Export types for external use
export type { ConnectorInput, ConnectorOutput };