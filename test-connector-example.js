// Test the exact example you provided
import { connectorBotV1 } from './server/connector-export.js';

const input = {
  currentState: "Frontend loaded",
  goal: "Connect frontend to admin wallet access",
  lastFailure: "Previous attempt failed due to invalid ENV setup",
  availableBots: ["WebsitePrepBot", "AdminDashboardAgent", "ConnectorBot"]
};

console.log('Testing connectorBotV1 with your input:');
console.log('Input:', JSON.stringify(input, null, 2));
console.log('Output:', JSON.stringify(connectorBotV1(input), null, 2));

// Additional test cases to show routing behavior
const testCases = [
  {
    name: "Database failure scenario",
    input: {
      currentState: "API calls failing",
      goal: "Restore database connectivity", 
      lastFailure: "DB connection timeout",
      availableBots: ["BackendPrepBot", "AdminDashboardAgent", "ConnectorBot"]
    }
  },
  {
    name: "Frontend enhancement",
    input: {
      currentState: "Basic UI working",
      goal: "Improve frontend user experience",
      availableBots: ["WebsitePrepBot", "AdminDashboardAgent", "ConnectorBot"]
    }
  }
];

testCases.forEach(test => {
  console.log(`\n--- ${test.name} ---`);
  console.log('Result:', JSON.stringify(connectorBotV1(test.input), null, 2));
});