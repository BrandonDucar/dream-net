"use strict";
/**
 * Export the standalone connector function for external use
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorBotV1 = connectorBotV1;
function connectorBotV1(input) {
    var currentState = input.currentState, goal = input.goal, lastFailure = input.lastFailure, availableBots = input.availableBots;
    if (lastFailure === null || lastFailure === void 0 ? void 0 : lastFailure.includes("DB")) {
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
