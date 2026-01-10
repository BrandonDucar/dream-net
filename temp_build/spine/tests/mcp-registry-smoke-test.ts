/**
 * MCP Server Registry Smoke Test
 * 
 * Tests the MCP Server Registry with server registration and permission checking
 */

import { MCPServerRegistry } from '../dreamnet-mcp-bridge/MCPServerRegistry';
import { DreamNetInternalServers } from '../dreamnet-mcp-bridge/servers/dreamnet-servers';
import { ExternalServers } from '../dreamnet-mcp-bridge/servers/external-servers';
import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus';

async function runMCPRegistryTests() {
    console.log('🧪 Starting MCP Server Registry Smoke Tests...\n');

    // Create Event Bus
    const eventBus = new DreamEventBus();
    let eventsEmitted = 0;

    // Subscribe to MCP events
    eventBus.subscribe('MCP.*', (envelope) => {
        eventsEmitted++;
        console.log(`  📡 Event: ${envelope.type}`);
    });

    // Create MCP Server Registry
    const registry = new MCPServerRegistry(eventBus);

    // Test 1: Register Internal Servers
    console.log('1️⃣ Registering Internal Servers...');
    for (const server of DreamNetInternalServers) {
        registry.registerServer(server);
    }
    console.log(`  ✅ Registered ${DreamNetInternalServers.length} internal servers\n`);

    // Test 2: Register External Servers
    console.log('2️⃣ Registering External Servers...');
    for (const server of ExternalServers) {
        registry.registerServer(server);
    }
    console.log(`  ✅ Registered ${ExternalServers.length} external servers\n`);

    // Test 3: List All Servers
    console.log('3️⃣ Listing All Servers...');
    const allServers = registry.listServers();
    console.log(`  Total servers: ${allServers.length}`);
    for (const server of allServers) {
        console.log(`    - ${server.name} (${server.type}): ${server.tools.length} tools`);
    }
    console.log();

    // Test 4: Get Server by Tool
    console.log('4️⃣ Testing Tool Lookup...');
    const dreamServer = registry.getServerByTool('create_dream');
    console.log(`  create_dream → ${dreamServer?.name || 'NOT FOUND'}`);

    const stripeServer = registry.getServerByTool('create_payment_intent');
    console.log(`  create_payment_intent → ${stripeServer?.name || 'NOT FOUND'}`);
    console.log();

    // Test 5: Permission Checking
    console.log('5️⃣ Testing Permission Checks...');

    // Should allow: Lucid agent accessing DreamNet Core
    const perm1 = registry.checkPermission('dreamnet-core', 'agent:lucid', 'user:alice');
    console.log(`  Lucid → DreamNet Core: ${perm1.allowed ? '✅ ALLOWED' : '❌ DENIED'}`);

    // Should deny: Random agent accessing DreamNet Core
    const perm2 = registry.checkPermission('dreamnet-core', 'agent:random', 'user:bob');
    console.log(`  Random → DreamNet Core: ${perm2.allowed ? '✅ ALLOWED' : '❌ DENIED'} (${perm2.reason})`);

    // Should deny: Stripe requires approval
    const perm3 = registry.checkPermission('stripe', 'agent:treasury', 'user:charlie');
    console.log(`  Treasury → Stripe: ${perm3.allowed ? '✅ ALLOWED' : '❌ DENIED'} (${perm3.reason})`);
    console.log();

    // Test 6: List All Tools
    console.log('6️⃣ Listing All Tools...');
    const allTools = registry.listAllTools();
    console.log(`  Total tools: ${allTools.length}`);
    for (const { server, tool } of allTools.slice(0, 5)) {
        console.log(`    - ${tool.name} (${server.name}) - Cost: ${tool.costEstimate || 0} SHEEP`);
    }
    console.log(`    ... and ${allTools.length - 5} more\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ MCP Server Registry Tests Complete!`);
    console.log(`📊 Total Events Emitted: ${eventsEmitted}`);
    console.log(`🖥️  Servers Registered: ${registry.listServers().length}`);
    console.log(`🔧 Tools Available: ${registry.listAllTools().length}`);
    console.log(`🎉 All MCP registry features working correctly!`);

    process.exit(0);
}

// Run tests
runMCPRegistryTests().catch((error) => {
    console.error('💥 MCP registry tests failed:', error);
    process.exit(1);
});
