// Spine Phase I Smoke Test
// Verifies all components work together

import {
    DreamEventBus,
    RouteTable,
    RouteAnnouncements,
    RoutingStrategies,
    AgentInteropRegistry,
    OpenAIProvider,
    GeminiProvider,
    CapabilitiesMap,
    MCPBridge,
    ShieldCoreWrapper,
    BrowserAgentWrapper,
    FreeTierWrapper,
    DeploymentWrapper,
    DreamKeeperWrapper,
    MiniAppWrapper,
} from '../index';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string) {
    if (condition) {
        console.log(`✓ ${message}`);
        testsPassed++;
    } else {
        console.error(`✗ ${message}`);
        testsFailed++;
    }
}

console.log('🧪 Running Spine Phase I Smoke Test...\n');

// Test 1: Event Bus
(async () => {
    try {
        const bus = new DreamEventBus();
        assert(bus !== null, 'Event Bus created');

        let eventReceived = false;
        const unsubscribe = bus.subscribe('Agent.Route.Announced', () => {
            eventReceived = true;
        });
        bus.publish(bus.createEnvelope('Agent.Route.Announced', 'test', {}));
        assert(eventReceived, 'Event subscription works');
        unsubscribe();
    } catch (e) {
        console.error('Test 1 Failed:', e);
        testsFailed++;
    }

    // Test 2: BGP
    const routeTable = new RouteTable();
    routeTable.addRoute({ prefix: '/api', nextHop: 'service-a' });
    const route = routeTable.getRoute('/api');
    assert(route?.nextHop === 'service-a', 'Route Table operations work');

    let routeAnnounced = false;
    bus.subscribe('Agent.Route.Announced', () => {
        routeAnnounced = true;
    });
    const announcer = new RouteAnnouncements(bus, 'test-agent');
    announcer.announceRoute({ prefix: '/test', nextHop: 'test-service' });
    assert(routeAnnounced, 'Route announcement emits event');

    // Test 3: Registry
    const registry = new AgentInteropRegistry(bus);
    registry.registerProvider(OpenAIProvider);
    const provider = registry.getProvider('openai');
    assert(provider?.name === 'openai', 'Registry operations work');

    let providerRegistered = false;
    bus.subscribe('Interop.Provider.Registered', () => {
        providerRegistered = true;
    });
    registry.registerProvider(GeminiProvider);
    assert(providerRegistered, 'Provider registration emits event');

    // Test 4: OS Linker
    const capMap = new CapabilitiesMap();
    capMap.addProvider(OpenAIProvider);
    const chatProviders = capMap.getProviders('llm.chat');
    assert(chatProviders.length > 0, 'OS Linker works');

    // Test 5: MCP Bridge
    const mcpBridge = new MCPBridge();
    mcpBridge.registerProvider({ name: 'test-mcp', tools: ['tool1', 'tool2'] });
    const session = mcpBridge.createSession('test-mcp');
    assert(session.sessionId !== undefined, 'MCP Bridge works');

    // Test 6: Wrappers
    let wrapperEventCount = 0;
    const countEvents = () => wrapperEventCount++;

    bus.subscribe('Security.ThreatEvaluationRequested', countEvents); // Updated event name
    bus.subscribe('Browser.NavigationBlocked', countEvents);
    bus.subscribe('FreeTier.UsageRecorded', countEvents);
    bus.subscribe('Deployment.Announced', countEvents);
    bus.subscribe('DreamKeeper.HealthReported', countEvents);
    bus.subscribe('MiniApp.Event', countEvents);

    const shield = new ShieldCoreWrapper(bus);
    await shield.evaluateThreat({ input: 'test' });

    const browser = new BrowserAgentWrapper(bus,
        { isAllowed: () => ({ allowed: true }), getDomains: () => [] }, // Mock Allowlist
        { validateUrl: async () => ({ allowed: true }) }, // Mock IPBlocking
        { auditWebsite: async () => ({ scores: { performance: 100 } } as any) } // Mock Auditor
    );
    browser.reportBlockedNavigation('https://evil.com');

    const freeTier = new FreeTierWrapper(bus);
    freeTier.recordUsage('api-calls', 1);

    const deployment = new DeploymentWrapper(bus);
    deployment.announceDeploy('vercel');

    const dreamkeeper = new DreamKeeperWrapper(bus);
    dreamkeeper.reportHealth('entity-1', 'healthy');

    const miniapp = new MiniAppWrapper(bus);
    miniapp.reportMiniAppEvent('app-1', 'launched');

    // Give a small buffer for sync events to propagate if needed, though they should be immediate
    await new Promise(resolve => setTimeout(resolve, 10));

    assert(wrapperEventCount === 6, `All wrappers emit events (Expected 6, got ${wrapperEventCount})`);

    // Summary
    console.log(`\n📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);


    if (testsFailed === 0) {
        console.log('✅ Smoke test passed!');
        process.exit(0);
    } else {
        console.error('❌ Smoke test failed!');
        process.exit(1);
    }
})();
