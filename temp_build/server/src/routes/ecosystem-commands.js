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
var router = (0, express_1.Router)();
// Command registry for ecosystem operations
var commands = {
    remix: function (params, walletAddress) { return __awaiter(void 0, void 0, void 0, function () {
        var target, _a, type, id, remixScore, bountyBonus;
        return __generator(this, function (_b) {
            target = params[0];
            if (!target) {
                return [2 /*return*/, {
                        success: false,
                        command: 'remix',
                        error: 'Target required for remix operation',
                        timestamp: new Date().toISOString()
                    }];
            }
            _a = target.split(':'), type = _a[0], id = _a[1];
            if (type === 'infected' && id) {
                remixScore = Math.floor(Math.random() * 40) + 60;
                bountyBonus = id === '7b3d' ? 250 : Math.floor(Math.random() * 200) + 100;
                return [2 /*return*/, {
                        success: true,
                        command: 'remix',
                        result: {
                            action: 'Dream successfully remixed and purified',
                            dreamId: id,
                            originalStatus: 'infected',
                            newStatus: 'purified',
                            remixScore: remixScore,
                            trustRestored: remixScore,
                            quarantineLifted: true,
                            bountyAwarded: {
                                token: 'SHEEP',
                                amount: bountyBonus,
                                recipient: walletAddress
                            },
                            newDreamId: "remix-".concat(id, "-").concat(Date.now().toString(36)),
                            claimedBy: walletAddress,
                            timestamp: new Date().toISOString()
                        },
                        timestamp: new Date().toISOString()
                    }];
            }
            return [2 /*return*/, {
                    success: false,
                    command: 'remix',
                    error: "Unknown remix target: ".concat(target, ". Use format: infected:DREAM_ID"),
                    timestamp: new Date().toISOString()
                }];
        });
    }); },
    unlock: function (params, walletAddress) { return __awaiter(void 0, void 0, void 0, function () {
        var agentParam, walletParam, agent, targetWallet, operatorWallets, isOperator;
        return __generator(this, function (_a) {
            agentParam = params.find(function (p) { return p.startsWith('agent:'); });
            walletParam = params.find(function (p) { return p.startsWith('wallet:'); });
            if (!agentParam || !walletParam) {
                return [2 /*return*/, {
                        success: false,
                        command: 'unlock',
                        error: 'Both agent and wallet parameters required',
                        timestamp: new Date().toISOString()
                    }];
            }
            agent = agentParam.split(':')[1];
            targetWallet = walletParam.split(':')[1];
            operatorWallets = (process.env.OPERATOR_WALLETS || '').split(',').map(function (w) { return w.trim().toLowerCase(); }).filter(Boolean);
            isOperator = walletAddress && operatorWallets.includes(walletAddress.toLowerCase());
            if (!isOperator) {
                return [2 /*return*/, {
                        success: false,
                        command: 'unlock',
                        error: 'Insufficient privileges for agent unlock',
                        timestamp: new Date().toISOString()
                    }];
            }
            // Simulate agent unlock
            return [2 /*return*/, {
                    success: true,
                    command: 'unlock',
                    result: {
                        action: 'Agent unlocked successfully',
                        agent: agent.toUpperCase(),
                        unlockedFor: targetWallet,
                        accessLevel: 'Full',
                        capabilities: ['messaging', 'token-operations', 'system-access']
                    },
                    timestamp: new Date().toISOString()
                }];
        });
    }); },
    inject: function (params, walletAddress) { return __awaiter(void 0, void 0, void 0, function () {
        var sheepParam, walletParam, amount, targetWallet;
        return __generator(this, function (_a) {
            sheepParam = params.find(function (p) { return p.startsWith('sheep:'); });
            walletParam = params.find(function (p) { return p.startsWith('wallet:'); });
            if (!sheepParam || !walletParam) {
                return [2 /*return*/, {
                        success: false,
                        command: 'inject',
                        error: 'Both sheep amount and wallet parameters required',
                        timestamp: new Date().toISOString()
                    }];
            }
            amount = parseInt(sheepParam.split(':')[1]);
            targetWallet = walletParam.split(':')[1];
            if (isNaN(amount) || amount <= 0) {
                return [2 /*return*/, {
                        success: false,
                        command: 'inject',
                        error: 'Invalid sheep amount',
                        timestamp: new Date().toISOString()
                    }];
            }
            // Simulate token injection
            return [2 /*return*/, {
                    success: true,
                    command: 'inject',
                    result: {
                        action: 'Sheep tokens injected',
                        amount: amount,
                        recipient: targetWallet,
                        tokenType: 'SHEEP',
                        transactionId: "sheep-".concat(Date.now()),
                        newBalance: amount + Math.floor(Math.random() * 10000)
                    },
                    timestamp: new Date().toISOString()
                }];
        });
    }); }
};
// POST /api/ecosystem/command - Execute ecosystem commands
router.post('/command', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, commandLine, parts, command, params, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                walletAddress = req.headers['x-wallet-address'];
                commandLine = req.body.commandLine;
                if (!commandLine || typeof commandLine !== 'string') {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Command line required',
                            format: 'Expected: "command param1 param2..."'
                        })];
                }
                parts = commandLine.trim().split(/\s+/);
                command = parts[0], params = parts.slice(1);
                if (!command || !commands[command]) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Unknown command',
                            available: Object.keys(commands),
                            received: command
                        })];
                }
                return [4 /*yield*/, commands[command](params, walletAddress)];
            case 1:
                result = _a.sent();
                res.json({
                    success: true,
                    execution: result,
                    commandLine: commandLine,
                    executedBy: walletAddress
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({
                    error: 'Command execution failed',
                    details: error_1 instanceof Error ? error_1.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/ecosystem/commands - List available commands
router.get('/commands', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, operatorWallets, isOperator, availableCommands;
    return __generator(this, function (_a) {
        walletAddress = req.headers['x-wallet-address'];
        operatorWallets = (process.env.OPERATOR_WALLETS || '').split(',').map(function (w) { return w.trim().toLowerCase(); }).filter(Boolean);
        isOperator = Boolean(walletAddress && operatorWallets.includes(walletAddress.toLowerCase()));
        availableCommands = {
            remix: {
                description: 'Remix and purify infected entities',
                format: 'remix infected:ID',
                example: 'remix infected:7b3d',
                requiresAuth: false
            },
            unlock: {
                description: 'Unlock agents for specific wallets',
                format: 'unlock agent:AGENT_ID wallet:WALLET_ADDRESS',
                example: 'unlock agent:wing wallet:0xABC',
                requiresAuth: true
            },
            inject: {
                description: 'Inject tokens into wallet',
                format: 'inject sheep:AMOUNT wallet:WALLET_ADDRESS',
                example: 'inject sheep:5000 wallet:0xDEF',
                requiresAuth: isOperator
            }
        };
        res.json({
            success: true,
            commands: availableCommands,
            operatorAccess: isOperator,
            wallet: walletAddress
        });
        return [2 /*return*/];
    });
}); });
exports.default = router;
