import { BlackboardScheduler } from './packages/organs/integumentary/server/src/agents/BlackboardScheduler.js';

async function testBlackboard() {
    console.log("🧪 Testing Blackboard Scheduler...");

    await BlackboardScheduler.postTask("test-agent", {
        id: "test-task-1",
        goal: "Verify Blackboard Sync",
        status: "ACTIVE",
        action: "Testing the surgical YAML parser."
    }, "Testing Agent");

    console.log("✅ Test complete. Check root/blackboard.md for 'test-agent'.");
}

testBlackboard();
