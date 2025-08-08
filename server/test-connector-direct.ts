// Direct test of the connector function as requested
import { TaskConnector, type ConnectorInput } from './task-connector';

const input: ConnectorInput = {
  currentState: "Frontend loaded",
  goal: "Connect frontend to admin wallet access",
  lastFailure: "Previous attempt failed due to invalid ENV setup",
  availableBots: ["WebsitePrepBot", "AdminDashboardAgent", "ConnectorBot"]
};

console.log('=== Direct Connector Test ===');
console.log('Input:', JSON.stringify(input, null, 2));

const result = TaskConnector.connectorBotV1(input);
console.log('Output:', JSON.stringify(result, null, 2));

// Test the full routing (which includes fallback to original algorithm)
const fullResult = TaskConnector.route(input);
console.log('\nFull routing result:', JSON.stringify(fullResult, null, 2));