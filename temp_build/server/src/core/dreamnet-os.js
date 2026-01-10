"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dreamNetOS = exports.DreamNetOS = void 0;
var dreamkeeper_1 = require("./agents/dreamkeeper");
var deploykeeper_1 = require("./agents/deploykeeper");
var relaybot_1 = require("./agents/relaybot");
var envkeeper_1 = require("./agents/envkeeper");
var neural_mesh_1 = require("../../packages/neural-mesh");
var quantum_anticipation_1 = require("../../packages/quantum-anticipation");
var squad_alchemy_1 = require("../../packages/squad-alchemy");
var wolf_pack_1 = require("../../packages/wolf-pack");
var octopus_executor_1 = require("../../packages/octopus-executor");
var slug_time_memory_1 = require("../../packages/slug-time-memory");
var star_bridge_lungs_1 = require("../../packages/star-bridge-lungs");
var predator_scavenger_1 = require("../../packages/predator-scavenger");
var dream_cortex_1 = require("../../packages/dream-cortex");
var reputation_lattice_1 = require("../../packages/reputation-lattice");
var narrative_field_1 = require("../../packages/narrative-field");
var identity_grid_1 = require("../../packages/identity-grid");
var dream_vault_1 = require("../../packages/dream-vault");
var dream_shop_1 = require("../../packages/dream-shop");
var field_layer_1 = require("../../packages/field-layer");
var dreambet_core_1 = require("../../packages/dreambet-core");
var zen_garden_core_1 = require("../../packages/zen-garden-core");
var civic_panel_core_1 = require("../../packages/civic-panel-core");
var dream_tank_core_1 = require("../../packages/dream-tank-core");
var liquidity_engine_1 = require("../../packages/liquidity-engine");
var social_hub_core_1 = require("../../packages/social-hub-core");
var init_ritual_core_1 = require("../../packages/init-ritual-core");
var economic_engine_core_1 = require("../../packages/economic-engine-core");
var agent_registry_core_1 = require("../../packages/agent-registry-core");
var dreamnet_os_core_1 = require("../../packages/dreamnet-os-core");
var orchestrator_core_1 = require("../../packages/orchestrator-core");
var runtime_bridge_core_1 = require("../../packages/runtime-bridge-core");
var wolfpack_funding_core_1 = require("../../packages/wolfpack-funding-core");
var wolfpack_mailer_core_1 = require("../../packages/wolfpack-mailer-core");
var DreamNetOS = /** @class */ (function () {
    function DreamNetOS() {
        var _this = this;
        this.registry = new Map();
        this.neuralMesh = neural_mesh_1.default;
        this.quantumAnticipation = quantum_anticipation_1.default;
        this.squadAlchemy = squad_alchemy_1.default;
        this.wolfPack = wolf_pack_1.default;
        this.octopusExecutor = octopus_executor_1.default;
        this.slugTimeMemory = slug_time_memory_1.default;
        this.starBridgeLungs = star_bridge_lungs_1.default;
        this.predatorScavengerLoop = predator_scavenger_1.default;
        this.dreamCortex = dream_cortex_1.default;
        this.reputationLattice = reputation_lattice_1.default;
        this.narrativeField = narrative_field_1.default;
        this.identityGrid = identity_grid_1.default;
        this.dreamVault = dream_vault_1.default;
        this.dreamShop = dream_shop_1.default;
        this.fieldLayer = field_layer_1.default;
        this.dreamBetCore = dreambet_core_1.default;
        this.zenGardenCore = zen_garden_core_1.default;
        this.civicPanelCore = civic_panel_core_1.default;
        this.dreamTankCore = dream_tank_core_1.default;
        this.liquidityEngine = liquidity_engine_1.default;
        this.socialHubCore = social_hub_core_1.default;
        this.initRitualCore = init_ritual_core_1.default;
        this.economicEngineCore = economic_engine_core_1.default;
        this.agentRegistryCore = agent_registry_core_1.default;
        this.dreamNetOSCore = dreamnet_os_core_1.default;
        this.orchestratorCore = orchestrator_core_1.default;
        this.runtimeBridgeCore = runtime_bridge_core_1.default;
        this.wolfPackFundingCore = wolfpack_funding_core_1.default;
        this.wolfPackMailerCore = wolfpack_mailer_core_1.default;
        [dreamkeeper_1.DreamKeeperAgent, deploykeeper_1.DeployKeeperAgent, relaybot_1.RelayBotAgent, envkeeper_1.EnvKeeperAgent].forEach(function (a) {
            return _this.registry.set(a.name, a);
        });
        // Initialize Neural Mesh with subsystems
        this.initializeNeuralMesh();
    }
    DreamNetOS.prototype.initializeNeuralMesh = function () {
        var _this = this;
        try {
            // Link subsystems via Neural Mesh
            neural_mesh_1.default.link({
                swarm: {
                    onPulse: function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            // Swarm system pulse handler
                            console.log("[NeuralMesh] Swarm pulse:", event);
                            return [2 /*return*/];
                        });
                    }); },
                },
                governance: {
                    onPulse: function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            // Governance system pulse handler
                            console.log("[NeuralMesh] Governance pulse:", event);
                            return [2 /*return*/];
                        });
                    }); },
                },
                wormholes: {
                    onPulse: function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            // Wormholes system pulse handler
                            console.log("[NeuralMesh] Wormholes pulse:", event);
                            return [2 /*return*/];
                        });
                    }); },
                },
                routing: {
                    onPulse: function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            // Routing system pulse handler
                            console.log("[NeuralMesh] Routing pulse:", event);
                            return [2 /*return*/];
                        });
                    }); },
                },
                haloLoop: {
                    onPulse: function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            // Halo-Loop system pulse handler
                            console.log("[NeuralMesh] Halo-Loop pulse:", event);
                            return [2 /*return*/];
                        });
                    }); },
                },
            });
            console.log("[DreamNetOS] Neural Mesh initialized");
        }
        catch (error) {
            console.warn("[DreamNetOS] Neural Mesh initialization failed:", error);
        }
    };
    DreamNetOS.prototype.listAgents = function () {
        return Array.from(this.registry.values()).map(function (a) { return ({
            name: a.name,
            description: a.description,
        }); });
    };
    DreamNetOS.prototype.runAgent = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var agent, ctx;
            return __generator(this, function (_a) {
                agent = this.registry.get(input.agent.toLowerCase());
                if (!agent) {
                    return [2 /*return*/, { ok: false, agent: input.agent, error: "Unknown agent" }];
                }
                ctx = {
                    log: function (message, extra) {
                        // eslint-disable-next-line no-console
                        console.log("[DreamNetOS]", message, extra !== null && extra !== void 0 ? extra : "");
                    },
                    env: process.env,
                };
                return [2 /*return*/, agent.run(ctx, input.input)];
            });
        });
    };
    return DreamNetOS;
}());
exports.DreamNetOS = DreamNetOS;
exports.dreamNetOS = new DreamNetOS();
