"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Direct test of the connector function as requested
var task_connector_1 = require("./task-connector");
var input = {
    currentState: "Frontend loaded",
    goal: "Connect frontend to admin wallet access",
    lastFailure: "Previous attempt failed due to invalid ENV setup",
    availableBots: ["WebsitePrepBot", "AdminDashboardAgent", "ConnectorBot"]
};
console.log('=== Direct Connector Test ===');
console.log('Input:', JSON.stringify(input, null, 2));
var result = task_connector_1.TaskConnector.connectorBotV1(input);
console.log('Output:', JSON.stringify(result, null, 2));
// Test the full routing (which includes fallback to original algorithm)
var fullResult = task_connector_1.TaskConnector.route(input);
console.log('\nFull routing result:', JSON.stringify(fullResult, null, 2));
