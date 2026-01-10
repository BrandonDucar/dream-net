import { agentRegistry } from '../agents/core/registry';
import { miniAppRegistry } from './miniApps';
import { VertexCoreAgent } from '../agents/vertex/VertexCoreAgent';
import { DomeScannerAgent } from '../agents/vertex/DomeScannerAgent';
import { DreamKeeperAgent } from '../agents/dreamkeeper/DreamKeeperAgent';
import { NightmareSurgeonAgent } from '../agents/nightmare/NightmareSurgeonAgent';
import { DevCookboxAgent } from '../agents/devtools/DevCookboxAgent';
import { WebOpsBrowserWorkerAgent } from '../agents/webops/WebOpsBrowserWorkerAgent';
import { RelayBotAgent } from '../agents/ops/RelayBotAgent';
import { DreamBetGameAgent } from '../agents/dreambet/DreamBetGameAgent';

export function bootstrapDreamHubMiniApps(): void {
    console.log('🚀 Bootstrapping DreamHub mini apps...');

    // Register agents
    agentRegistry.registerAgent(new VertexCoreAgent());
    agentRegistry.registerAgent(new DomeScannerAgent());
    agentRegistry.registerAgent(new DreamKeeperAgent());
    agentRegistry.registerAgent(new NightmareSurgeonAgent());
    agentRegistry.registerAgent(new DevCookboxAgent());
    agentRegistry.registerAgent(new WebOpsBrowserWorkerAgent());
    agentRegistry.registerAgent(new RelayBotAgent());
    agentRegistry.registerAgent(new DreamBetGameAgent());

    // Register mini apps
    miniAppRegistry.registerMiniApp({
        id: 'dreamnet-vertex-scan',
        name: 'Vertex Scan',
        description: 'Analyze DreamNet state with Vertex Core',
        category: 'analysis',
        agentId: 'dreamnet-vertex-core'
    });

    miniAppRegistry.registerMiniApp({
        id: 'drone-dome-scan',
        name: 'Drone Dome Scan',
        description: 'Generate dome control actions',
        category: 'analysis',
        agentId: 'drone-dome-sky-scanner'
    });

    miniAppRegistry.registerMiniApp({
        id: 'dreamkeeper-scan',
        name: 'DreamKeeper Scan',
        description: 'Global health diagnostic for DreamNet',
        category: 'monitoring',
        agentId: 'dreamnet-dreamkeeper'
    });

    miniAppRegistry.registerMiniApp({
        id: 'nightmare-remedy-planner',
        name: 'Nightmare Remedy Planner',
        description: 'Generate remediation plans for anomalies',
        category: 'management',
        agentId: 'nightmare-surgeon'
    });

    miniAppRegistry.registerMiniApp({
        id: 'dreamdev-cookbox',
        name: 'DreamDev Cookbox',
        description: 'Generate DreamNet-style code scaffolds',
        category: 'utility',
        agentId: 'dreamdev-cookbox'
    });

    miniAppRegistry.registerMiniApp({
        id: 'webops-mission',
        name: 'WebOps Mission Control',
        description: 'Controlled browser sandbox operations',
        category: 'utility',
        agentId: 'webops-browser-worker'
    });

    miniAppRegistry.registerMiniApp({
        id: 'relaybot',
        name: 'RelayBot Dispatcher',
        description: 'Message formatting and dispatch',
        category: 'management',
        agentId: 'relaybot-dispatcher'
    });

    miniAppRegistry.registerMiniApp({
        id: 'dreambet-game-lab',
        name: 'DreamBet Game Lab',
        description: 'Fairness audit and game design',
        category: 'analysis',
        agentId: 'dreambet-game-agent'
    });

    console.log(`✅ Registered ${agentRegistry.listAgents().length} agents`);
    console.log(`✅ Registered ${miniAppRegistry.listMiniApps().length} mini apps`);
}

