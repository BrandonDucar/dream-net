import { dreamEventBus } from '../dreamnet-event-bus/index.js';

/**
 * PlaygroundRunner
 * Dedicated entrypoint for the Playground container.
 * "Where agents build the future."
 */
async function ignitePlayground() {
    console.log('🎭 [Playground] Manifestation Substrate Warming Up...');

    // Listen for StartSession signals from the SwarmOrchestrator
    dreamEventBus.subscribe('Playground.StartSession', (envelope: any) => {
        const { agentId } = envelope.payload;
        console.log(`✨ [Playground] Agent ${agentId} is now manifesting on the Grid.`);

        // This is where we would dynamically load agent-contributed 
        // logic blocks or UI configurations in a future Phase.
    });

    console.log('✅ [Playground] Grid Operational. Awaiting Autonomous Manifestations.');

    // Keep process alive
    process.on('SIGINT', () => {
        console.log('🎭 [Playground] De-manifesting...');
        process.exit(0);
    });
}

ignitePlayground().catch(err => {
    console.error('❌ [Playground] CRITICAL FAILURE:', err);
    process.exit(1);
});
