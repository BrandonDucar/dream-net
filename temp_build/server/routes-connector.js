"use strict";
/**
 * API Routes for Task Connector System
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var task_connector_1 = require("./task-connector");
var ConnectorBot_1 = require("./routes/ConnectorBot");
var router = express_1.default.Router();
// Route task to appropriate bot using ConnectorBot v1
router.post('/route', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var input, routingDecision, output, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                input = req.body;
                // Validate input
                if (!input.currentState || !input.goal) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields: currentState, goal'
                        })];
                }
                return [4 /*yield*/, ConnectorBot_1.connectorBotV1.routeTask({
                        currentState: input.currentState,
                        goal: input.goal,
                        availableBots: input.availableBots || ['WebsitePrepBot', 'BackendPrepBot', 'AdminDashboardAgent', 'DreamIntakeBot', 'SocialOpsBot'],
                        walletData: input.walletData,
                        urgency: input.priority || 'medium',
                        complexity: input.complexity || 'moderate'
                    })];
            case 1:
                routingDecision = _a.sent();
                output = {
                    nextBot: routingDecision.routedTo,
                    instructions: "".concat(routingDecision.reasoning, ". Next steps: ").concat(routingDecision.nextSteps.join(', '))
                };
                console.log("[ConnectorBot v1] Routing: ".concat(input.currentState, " \u2192 ").concat(output.nextBot));
                console.log("[ConnectorBot v1] Confidence: ".concat(routingDecision.confidence, "%"));
                console.log("[ConnectorBot v1] Reasoning: ".concat(routingDecision.reasoning));
                res.json(__assign(__assign({}, output), { agent_version: ConnectorBot_1.connectorBotV1.getVersion(), fallback_chain: routingDecision.fallbackChain, next_steps: routingDecision.nextSteps, confidence: routingDecision.confidence, estimatedTime: routingDecision.estimatedDuration }));
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('[ConnectorBot v1] Route error:', error_1);
                res.status(500).json({ error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get available bots and their capabilities
router.get('/bots', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var capabilities;
    return __generator(this, function (_a) {
        try {
            capabilities = {
                WebsitePrepBot: {
                    description: 'Frontend development and UI implementation',
                    capabilities: ['React components', 'Styling', 'User interfaces', 'Forms', 'Routing']
                },
                BackendPrepBot: {
                    description: 'Backend API and database development',
                    capabilities: ['API endpoints', 'Database operations', 'Authentication', 'Data persistence']
                },
                SocialOpsBot: {
                    description: 'Social features and external integrations',
                    capabilities: ['Notifications', 'Webhooks', 'Social media', 'User engagement']
                },
                AdminDashboardAgent: {
                    description: 'Admin interface and security management',
                    capabilities: ['Admin dashboard', 'Wallet authentication', 'Secret key handling', 'User management']
                },
                DreamIntakeBot: {
                    description: 'Dream submission and processing workflows',
                    capabilities: ['Dream intake', 'Content validation', 'User onboarding', 'Processing pipelines']
                },
                ConnectorBot: {
                    description: 'Task coordination and workflow orchestration',
                    capabilities: ['Task routing', 'Workflow management', 'Fallback handling', 'System coordination']
                }
            };
            res.json(capabilities);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
// Dream Network specific routing
router.post('/dream-network', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, currentState, goal, output;
    return __generator(this, function (_b) {
        try {
            _a = req.body, currentState = _a.currentState, goal = _a.goal;
            if (!currentState || !goal) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Missing required fields: currentState, goal'
                    })];
            }
            output = (0, task_connector_1.routeDreamNetworkTask)(currentState, goal);
            console.log("[Dream Network Connector] ".concat(currentState, " \u2192 ").concat(goal, " \u2192 ").concat(output.nextBot));
            res.json(__assign(__assign({}, output), { projectContext: 'Dream Network Management Platform', timestamp: new Date().toISOString() }));
        }
        catch (error) {
            console.error('[Dream Network Connector] Error:', error);
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
// Test connector with sample scenarios
router.get('/test', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var scenarios, results;
    return __generator(this, function (_a) {
        try {
            scenarios = [
                {
                    name: 'Garden Feed to Dream Save',
                    input: {
                        currentState: 'Garden feed API working with static dreams',
                        goal: 'Implement dream save functionality with database persistence',
                        availableBots: ['WebsitePrepBot', 'BackendPrepBot', 'SocialOpsBot', 'AdminDashboardAgent']
                    }
                },
                {
                    name: 'Static Data to UI Enhancement',
                    input: {
                        currentState: 'Dream data loading from static endpoint',
                        goal: 'Improve dream gallery frontend with animations and filtering',
                        availableBots: ['WebsitePrepBot', 'BackendPrepBot', 'SocialOpsBot', 'DreamIntakeBot']
                    }
                },
                {
                    name: 'Working Backend to Notifications',
                    input: {
                        currentState: 'Dream saving and loading working',
                        goal: 'Add real-time notifications for dream approvals',
                        availableBots: ['WebsitePrepBot', 'BackendPrepBot', 'SocialOpsBot']
                    }
                },
                {
                    name: 'Database Failure Recovery',
                    input: {
                        currentState: 'Database connection failed',
                        goal: 'Restore database functionality',
                        lastFailure: 'DB connection timeout error',
                        availableBots: ['BackendPrepBot', 'AdminDashboardAgent', 'ConnectorBot']
                    }
                },
                {
                    name: 'Admin Interface Setup',
                    input: {
                        currentState: 'Backend API working',
                        goal: 'Set up admin dashboard with wallet authentication',
                        availableBots: ['AdminDashboardAgent', 'WebsitePrepBot', 'BackendPrepBot']
                    }
                }
            ];
            results = scenarios.map(function (scenario) { return ({
                scenario: scenario.name,
                input: scenario.input,
                output: task_connector_1.TaskConnector.route(scenario.input)
            }); });
            res.json(results);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
