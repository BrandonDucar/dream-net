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
var express_1 = require("express");
var NodeRegistry_1 = require("../../dreamnodes/registry/NodeRegistry");
var router = (0, express_1.Router)();
// GET /api/ecosystem - Complete ecosystem data
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, operatorWallets, isOperator, FLUTTERBY_NODE, DEFI_LAB_NODE, allNodes, visibleNodes, dreams, agents, evolutionChains, bounties, infected, lockedAgents, godTriggers, ecosystemData, error_1;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                walletAddress = req.headers['x-wallet-address'];
                operatorWallets = (process.env.OPERATOR_WALLETS || '').split(',').map(function (w) { return w.trim().toLowerCase(); }).filter(Boolean);
                isOperator = Boolean(walletAddress && operatorWallets.includes(walletAddress.toLowerCase()));
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../../dreamnodes/flutterbye/node.config.js'); })];
            case 1:
                FLUTTERBY_NODE = (_e.sent()).FLUTTERBY_NODE;
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../../dreamnodes/defi-lab/node.config.js'); })];
            case 2:
                DEFI_LAB_NODE = (_e.sent()).DEFI_LAB_NODE;
                // Register nodes if not already registered
                if (!NodeRegistry_1.nodeRegistry.getNode('flutterbye')) {
                    NodeRegistry_1.nodeRegistry.registerNode(FLUTTERBY_NODE);
                }
                if (!NodeRegistry_1.nodeRegistry.getNode('defi-lab')) {
                    NodeRegistry_1.nodeRegistry.registerNode(DEFI_LAB_NODE);
                }
                allNodes = Array.from(NodeRegistry_1.nodeRegistry.nodes.values());
                visibleNodes = isOperator ? allNodes : NodeRegistry_1.nodeRegistry.listPublicNodes();
                dreams = [
                    {
                        id: 'dream-0',
                        title: 'Neural Network Vision',
                        name: 'Neural Network Vision',
                        creator: '0xFAKE0',
                        tags: ['ai', 'vision'],
                        score: 85,
                        evolved: true,
                        status: 'Active',
                        trustLevel: 'High',
                        nightmare: false,
                        claimedBy: null,
                        remix: {
                            initiated: false,
                            result: null,
                            score: null
                        },
                        bounty: null
                    },
                    {
                        id: 'dream-1',
                        title: 'DeFi Protocol v2',
                        name: 'DeFi Protocol v2',
                        creator: ((_b = (_a = process.env.OPERATOR_WALLETS) === null || _a === void 0 ? void 0 : _a.split(',')[0]) === null || _b === void 0 ? void 0 : _b.trim()) || 'system',
                        tags: ['defi', 'protocol'],
                        score: 92,
                        evolved: false,
                        status: 'Development',
                        trustLevel: 'Maximum',
                        nightmare: false,
                        claimedBy: ((_d = (_c = process.env.OPERATOR_WALLETS) === null || _c === void 0 ? void 0 : _c.split(',')[0]) === null || _d === void 0 ? void 0 : _d.trim()) || 'system',
                        remix: {
                            initiated: false,
                            result: null,
                            score: null
                        },
                        bounty: {
                            token: 'CORE',
                            amount: 1000,
                            expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
                        }
                    },
                    {
                        id: '7b3d',
                        title: 'Unstable Portal Dream',
                        name: 'Unstable Portal Dream',
                        creator: '0xINFECTED',
                        tags: ['defi', 'ai'],
                        score: 15,
                        evolved: false,
                        status: 'infected',
                        trustLevel: 'Danger',
                        nightmare: true,
                        claimedBy: '0xABC',
                        remix: {
                            initiated: true,
                            result: null,
                            score: null
                        },
                        bounty: {
                            token: 'SHEEP',
                            amount: 500,
                            expires: 1699999999
                        }
                    },
                    {
                        id: 'nightmare-1',
                        title: 'Corrupted Data Stream',
                        name: 'Corrupted Data Stream',
                        creator: '0xINFECTED',
                        tags: ['infected', 'corruption'],
                        score: 10,
                        evolved: false,
                        status: 'Quarantined',
                        trustLevel: 'Danger',
                        nightmare: true,
                        claimedBy: null,
                        remix: {
                            initiated: false,
                            result: null,
                            score: null
                        },
                        bounty: null
                    }
                ];
                agents = [
                    {
                        id: 'LUCID',
                        name: 'Logic Unification & Command Interface Daemon',
                        status: 'Active',
                        trustScore: 95,
                        accessLevel: 'Core',
                        locked: false,
                        currentTask: 'Dream routing and validation'
                    },
                    {
                        id: 'CANVAS',
                        name: 'Visual Layer Weaver',
                        status: 'Active',
                        trustScore: 88,
                        accessLevel: 'Standard',
                        locked: false,
                        currentTask: 'UI component generation'
                    },
                    {
                        id: 'ROOT',
                        name: 'Subconscious Architect',
                        status: 'Active',
                        trustScore: 92,
                        accessLevel: 'Deep',
                        locked: false,
                        currentTask: 'System architecture analysis'
                    },
                    {
                        id: 'ECHO',
                        name: 'Wallet Mirror',
                        status: 'Active',
                        trustScore: 87,
                        accessLevel: 'Standard',
                        locked: false,
                        currentTask: 'Wallet trust evaluation'
                    },
                    {
                        id: 'CRADLE',
                        name: 'Evolution Engine',
                        status: 'Active',
                        trustScore: 90,
                        accessLevel: 'Evolution',
                        locked: false,
                        currentTask: 'Dream lifecycle management'
                    },
                    {
                        id: 'WING',
                        name: 'Messenger & Mint Agent',
                        status: 'Active',
                        trustScore: 85,
                        accessLevel: 'Token',
                        locked: false,
                        currentTask: 'Token distribution'
                    },
                    {
                        id: 'GLITCH',
                        name: 'Hidden System Agent',
                        status: 'Dormant',
                        trustScore: 60,
                        accessLevel: 'Restricted',
                        locked: true,
                        currentTask: 'System monitoring (locked)'
                    }
                ];
                evolutionChains = [
                    {
                        id: 'chain-neural',
                        rootDream: 'dream-0',
                        generations: 3,
                        totalForks: 12,
                        avgScore: 82,
                        status: 'Evolving'
                    },
                    {
                        id: 'chain-defi',
                        rootDream: 'dream-1',
                        generations: 1,
                        totalForks: 5,
                        avgScore: 89,
                        status: 'Stable'
                    }
                ];
                bounties = [
                    {
                        id: 'bounty-1',
                        title: 'Cross-chain Bridge Implementation',
                        reward: '5000 CORE',
                        deadline: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
                        difficulty: 'Expert',
                        applicants: 3,
                        status: 'Open'
                    },
                    {
                        id: 'bounty-2',
                        title: 'AI Agent Optimization',
                        reward: '2500 FLBY',
                        deadline: Date.now() + (14 * 24 * 60 * 60 * 1000), // 14 days
                        difficulty: 'Advanced',
                        applicants: 7,
                        status: 'In Progress'
                    }
                ];
                infected = [
                    {
                        id: 'infected-wallet-1',
                        type: 'wallet',
                        address: '0xINFECTED',
                        severity: 'High',
                        detectedAt: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
                        status: 'Quarantined'
                    },
                    {
                        id: '7b3d',
                        type: 'dream',
                        address: 'Unstable Portal Dream',
                        severity: 'Critical',
                        detectedAt: Date.now() - (6 * 60 * 60 * 1000), // 6 hours ago
                        status: 'Remix Initiated',
                        bountyActive: true,
                        claimedBy: '0xABC'
                    }
                ];
                lockedAgents = [
                    {
                        id: 'GLITCH',
                        name: 'Hidden System Agent',
                        unlockCondition: 'Trust score 95+ and operator status',
                        currentProgress: isOperator ? 'Operator verified' : 'Access denied',
                        canUnlock: isOperator
                    }
                ];
                godTriggers = isOperator ? [
                    {
                        id: 'system-reset',
                        name: 'Emergency System Reset',
                        description: 'Reset all agent states and clear quarantine',
                        danger: 'Critical',
                        requiresConfirmation: true
                    },
                    {
                        id: 'unlock-all',
                        name: 'Unlock All Agents',
                        description: 'Override all agent locks and restrictions',
                        danger: 'High',
                        requiresConfirmation: true
                    },
                    {
                        id: 'purge-infected',
                        name: 'Purge Infected Entities',
                        description: 'Remove all quarantined and infected data',
                        danger: 'Medium',
                        requiresConfirmation: true
                    }
                ] : [];
                ecosystemData = {
                    operator: isOperator,
                    dreams: dreams,
                    nodes: visibleNodes,
                    agents: agents,
                    evolutionChains: evolutionChains,
                    bounties: bounties,
                    infected: infected,
                    lockedAgents: lockedAgents,
                    godTriggers: godTriggers
                };
                res.json({
                    success: true,
                    timestamp: new Date().toISOString(),
                    ecosystem: ecosystemData,
                    metadata: {
                        totalEntities: dreams.length + visibleNodes.length + agents.length + bounties.length,
                        operatorAccess: isOperator,
                        systemHealth: infected.length === 0 ? 'Healthy' : 'Compromised',
                        activeAgents: agents.filter(function (a) { return a.status === 'Active'; }).length
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _e.sent();
                res.status(500).json({
                    error: 'Failed to fetch ecosystem data',
                    details: error_1 instanceof Error ? error_1.message : 'Unknown error'
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// POST /api/ecosystem/god-trigger - Execute god mode actions
router.post('/god-trigger', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, operatorWallets, isOperator, _a, triggerId, confirmed, result;
    return __generator(this, function (_b) {
        try {
            walletAddress = req.headers['x-wallet-address'];
            operatorWallets = (process.env.OPERATOR_WALLETS || '').split(',').map(function (w) { return w.trim().toLowerCase(); }).filter(Boolean);
            isOperator = Boolean(walletAddress && operatorWallets.includes(walletAddress.toLowerCase()));
            if (!isOperator) {
                return [2 /*return*/, res.status(403).json({
                        error: 'Access denied',
                        message: 'God triggers require operator privileges'
                    })];
            }
            _a = req.body, triggerId = _a.triggerId, confirmed = _a.confirmed;
            if (!confirmed) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Confirmation required',
                        message: 'God triggers must be explicitly confirmed'
                    })];
            }
            result = void 0;
            switch (triggerId) {
                case 'system-reset':
                    result = { message: 'System reset initiated', affected: ['agents', 'quarantine'] };
                    break;
                case 'unlock-all':
                    result = { message: 'All agents unlocked', affected: ['GLITCH', 'restricted-nodes'] };
                    break;
                case 'purge-infected':
                    result = { message: 'Infected entities purged', affected: ['infected-entities'] };
                    break;
                default:
                    return [2 /*return*/, res.status(400).json({ error: 'Unknown trigger ID' })];
            }
            res.json({
                success: true,
                trigger: triggerId,
                result: result,
                executedBy: walletAddress,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to execute god trigger',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
