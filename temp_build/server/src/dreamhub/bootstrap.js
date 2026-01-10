"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapDreamHubMiniApps = bootstrapDreamHubMiniApps;
var registry_1 = require("../agents/core/registry");
var miniApps_1 = require("./miniApps");
var VertexCoreAgent_1 = require("../agents/vertex/VertexCoreAgent");
var DomeScannerAgent_1 = require("../agents/vertex/DomeScannerAgent");
var DreamKeeperAgent_1 = require("../agents/dreamkeeper/DreamKeeperAgent");
var NightmareSurgeonAgent_1 = require("../agents/nightmare/NightmareSurgeonAgent");
var DevCookboxAgent_1 = require("../agents/devtools/DevCookboxAgent");
var WebOpsBrowserWorkerAgent_1 = require("../agents/webops/WebOpsBrowserWorkerAgent");
var RelayBotAgent_1 = require("../agents/ops/RelayBotAgent");
var DreamBetGameAgent_1 = require("../agents/dreambet/DreamBetGameAgent");
function bootstrapDreamHubMiniApps() {
    console.log('🚀 Bootstrapping DreamHub mini apps...');
    // Register agents
    registry_1.agentRegistry.registerAgent(new VertexCoreAgent_1.VertexCoreAgent());
    registry_1.agentRegistry.registerAgent(new DomeScannerAgent_1.DomeScannerAgent());
    registry_1.agentRegistry.registerAgent(new DreamKeeperAgent_1.DreamKeeperAgent());
    registry_1.agentRegistry.registerAgent(new NightmareSurgeonAgent_1.NightmareSurgeonAgent());
    registry_1.agentRegistry.registerAgent(new DevCookboxAgent_1.DevCookboxAgent());
    registry_1.agentRegistry.registerAgent(new WebOpsBrowserWorkerAgent_1.WebOpsBrowserWorkerAgent());
    registry_1.agentRegistry.registerAgent(new RelayBotAgent_1.RelayBotAgent());
    registry_1.agentRegistry.registerAgent(new DreamBetGameAgent_1.DreamBetGameAgent());
    // Register mini apps
    miniApps_1.miniAppRegistry.registerMiniApp({
        id: 'dreamnet-vertex-scan',
        name: 'Vertex Scan',
        description: 'Analyze DreamNet state with Vertex Core',
        category: 'analysis',
        agentId: 'dreamnet-vertex-core'
    });
    miniApps_1.miniAppRegistry.registerMiniApp({
        id: 'drone-dome-scan',
        name: 'Drone Dome Scan',
        description: 'Generate dome control actions',
        category: 'analysis',
        agentId: 'drone-dome-sky-scanner'
    });
    miniApps_1.miniAppRegistry.registerMiniApp({
        id: 'dreamkeeper-scan',
        name: 'DreamKeeper Scan',
        description: 'Global health diagnostic for DreamNet',
        category: 'monitoring',
        agentId: 'dreamnet-dreamkeeper'
    });
    miniApps_1.miniAppRegistry.registerMiniApp({
        id: 'nightmare-remedy-planner',
        name: 'Nightmare Remedy Planner',
        description: 'Generate remediation plans for anomalies',
        category: 'management',
        agentId: 'nightmare-surgeon'
    });
    miniApps_1.miniAppRegistry.registerMiniApp({
        id: 'dreamdev-cookbox',
        name: 'DreamDev Cookbox',
        description: 'Generate DreamNet-style code scaffolds',
        category: 'utility',
        agentId: 'dreamdev-cookbox'
    });
    miniApps_1.miniAppRegistry.registerMiniApp({
        id: 'webops-mission',
        name: 'WebOps Mission Control',
        description: 'Controlled browser sandbox operations',
        category: 'utility',
        agentId: 'webops-browser-worker'
    });
    miniApps_1.miniAppRegistry.registerMiniApp({
        id: 'relaybot',
        name: 'RelayBot Dispatcher',
        description: 'Message formatting and dispatch',
        category: 'management',
        agentId: 'relaybot-dispatcher'
    });
    miniApps_1.miniAppRegistry.registerMiniApp({
        id: 'dreambet-game-lab',
        name: 'DreamBet Game Lab',
        description: 'Fairness audit and game design',
        category: 'analysis',
        agentId: 'dreambet-game-agent'
    });
    console.log("\u2705 Registered ".concat(registry_1.agentRegistry.listAgents().length, " agents"));
    console.log("\u2705 Registered ".concat(miniApps_1.miniAppRegistry.listMiniApps().length, " mini apps"));
}
