import {
    DreamEventBus,
    ShieldCoreWrapper,
    BrowserAgentWrapper,
    DeploymentWrapper,
    DreamKeeperWrapper,
    MiniAppWrapper,
    FreeTierWrapper
} from '@dreamnet/spine';

// 1. Instantiate the Central Nervous System
const eventBus = new DreamEventBus();

// 2. Instantiate Wrappers (The "Nerves")
// Note: These are currently "floating" nerves. They emit events but don't yet control the body.
// In Phase 3, we will wire them into the actual logic.

const shield = new ShieldCoreWrapper(eventBus);

// For Browser Agent, we need to provide the actual implementations (Dependency Injection)
// Ideally, we import these from the server logic, but to avoid circular deps during init,
// we might pass them lazily or use a factory. For now, we'll use a basic setup.
const browser = new BrowserAgentWrapper(eventBus,
    { isAllowed: () => ({ allowed: true }), getDomains: () => [] }, // Placeholder Allowlist
    { validateUrl: async () => ({ allowed: true }) }, // Placeholder IPBlocking
    { auditWebsite: async () => ({ scores: {} } as any) } // Placeholder Auditor
);

const deployment = new DeploymentWrapper(eventBus);
const dreamKeeper = new DreamKeeperWrapper(eventBus);
const miniApp = new MiniAppWrapper(eventBus);
const freeTier = new FreeTierWrapper(eventBus);

// 3. Export the Neural Link
export const spine = {
    bus: eventBus,
    shield,
    browser,
    deployment,
    dreamKeeper,
    miniApp,
    freeTier
};

console.log('[Spine] Neural Link Established. Event Bus Active.');
