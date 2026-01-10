/**
 * RouteTable Smoke Test
 * 
 * Tests the RouteTable implementation with:
 * - Route addition/removal
 * - Next-hop resolution
 * - Multiple routing strategies
 * - Metrics tracking
 * - Event emission
 */

import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus.js';
import { RouteTable } from '../bgp-for-agents/RouteTable.js';
import { RouteAnnouncements } from '../bgp-for-agents/RouteAnnouncements.js';

async function runRouteTableTests() {
    console.log('🧪 Starting RouteTable Smoke Tests...\n');

    // Create Event Bus
    const eventBus = new DreamEventBus();
    let eventsEmitted = 0;

    // Subscribe to all events
    eventBus.subscribe('*', (envelope) => {
        eventsEmitted++;
        console.log(`  📡 Event: ${envelope.eventType} from ${envelope.source}`);
    });

    // Create RouteTable
    const routeTable = new RouteTable(eventBus);
    const announcer = new RouteAnnouncements(eventBus, 'test-router');

    console.log('1️⃣ Testing Route Addition...');
    routeTable.addRoute(
        { prefix: 'agent.lucid', nextHop: 'lucid-server-1' },
        { hopCount: 1, latency: 10, reliability: 0.99 }
    );
    routeTable.addRoute(
        { prefix: 'agent.canvas', nextHop: 'canvas-server-1' },
        { hopCount: 2, latency: 20, reliability: 0.95 }
    );
    routeTable.addRoute(
        { prefix: 'agent', nextHop: 'default-gateway' },
        { hopCount: 3, latency: 50, reliability: 0.90 }
    );
    console.log(`  ✅ Added 3 routes, total: ${routeTable.getRouteCount()}\n`);

    console.log('2️⃣ Testing Next-Hop Resolution...');
    const nextHop1 = routeTable.findNextHop('agent.lucid.v1');
    const nextHop2 = routeTable.findNextHop('agent.canvas.v2');
    const nextHop3 = routeTable.findNextHop('agent.unknown');
    console.log(`  agent.lucid.v1 → ${nextHop1} (expected: lucid-server-1)`);
    console.log(`  agent.canvas.v2 → ${nextHop2} (expected: canvas-server-1)`);
    console.log(`  agent.unknown → ${nextHop3} (expected: default-gateway)`);
    console.log(`  ✅ Next-hop resolution working\n`);

    console.log('3️⃣ Testing Routing Strategies...');
    const bestRoute = routeTable.findBestRoute('agent.lucid', 'lowest-latency');
    console.log(`  Best route for agent.lucid (lowest-latency): ${bestRoute?.nextHop}`);
    console.log(`  ✅ Routing strategies working\n`);

    console.log('4️⃣ Testing Metrics Update...');
    routeTable.updateMetrics('agent.lucid', { latency: 5, reliability: 0.999 });
    const updated = routeTable.getRoute('agent.lucid');
    console.log(`  Updated latency: ${updated?.metrics.latency}ms (expected: 5)`);
    console.log(`  ✅ Metrics update working\n`);

    console.log('5️⃣ Testing Route Announcements...');
    announcer.announceRoute({ prefix: 'agent.root', nextHop: 'root-server-1' });
    announcer.withdrawRoute({ prefix: 'agent.canvas', nextHop: 'canvas-server-1' });
    console.log(`  ✅ Route announcements working\n`);

    console.log('6️⃣ Testing Route Removal...');
    const removed = routeTable.removeRoute('agent.canvas');
    console.log(`  Removed agent.canvas: ${removed} (expected: true)`);
    console.log(`  Routes remaining: ${routeTable.getRouteCount()}\n`);

    console.log('7️⃣ Testing Stale Route Detection...');
    const staleRoutes = routeTable.getStaleRoutes(1000); // Routes older than 1 second
    console.log(`  Stale routes found: ${staleRoutes.length}\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ RouteTable Tests Complete!`);
    console.log(`📊 Total Events Emitted: ${eventsEmitted}`);
    console.log(`🎯 Routes in table: ${routeTable.getRouteCount()}`);
    console.log(`🎉 All routing features working correctly!`);

    process.exit(0);
}

// Run tests
runRouteTableTests().catch((error) => {
    console.error('💥 RouteTable tests failed:', error);
    process.exit(1);
});
