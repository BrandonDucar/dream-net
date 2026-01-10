// main.ts

import { connectorBotV1, type ConnectorInput } from './server/connector-export';

const testInput: ConnectorInput = {
  currentState: "Dream garden feed loaded",
  goal: "Connect frontend to admin wallet control",
  lastFailure: "Failed ENV connection",
  availableBots: ["ConnectorBot", "WebsitePrepBot", "AdminDashboardAgent"]
};

const result = connectorBotV1(testInput);
console.log("🤖 ConnectorBot Decision:\n", result);

// Additional test cases for comprehensive routing
const testCases = [
  {
    name: "Database Recovery",
    input: {
      currentState: "API endpoints failing",
      goal: "Restore database connectivity",
      lastFailure: "DB timeout error",
      availableBots: ["BackendPrepBot", "ConnectorBot"]
    }
  },
  {
    name: "Pure Admin Task",
    input: {
      currentState: "Backend working",
      goal: "Set up admin dashboard",
      availableBots: ["AdminDashboardAgent", "WebsitePrepBot", "ConnectorBot"]
    }
  },
  {
    name: "Unclear Goal",
    input: {
      currentState: "System partially working",
      goal: "Fix everything",
      availableBots: ["WebsitePrepBot", "BackendPrepBot", "ConnectorBot"]
    }
  }
];

console.log("\n--- Additional Test Cases ---");
testCases.forEach(test => {
  console.log(`\n${test.name}:`);
  console.log(JSON.stringify(connectorBotV1(test.input), null, 2));
});