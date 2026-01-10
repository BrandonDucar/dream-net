"use strict";
/**
 * Whale Pack Control Loop
 * Monitors metrics and triggers actions automatically
 */
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
exports.runControlLoop = runControlLoop;
exports.startControlLoop = startControlLoop;
exports.stopControlLoop = stopControlLoop;
var metrics_1 = require("./metrics");
var actions_1 = require("./actions");
var controlLoopRunning = false;
var controlLoopInterval = null;
/**
 * Run one iteration of the control loop
 */
function runControlLoop() {
    return __awaiter(this, void 0, void 0, function () {
        var metrics, _i, metrics_2, metric, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (controlLoopRunning) {
                        console.log('[WhalePack] Control loop already running, skipping...');
                        return [2 /*return*/];
                    }
                    controlLoopRunning = true;
                    console.log('[WhalePack] Starting control loop iteration...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, (0, metrics_1.getAllMetrics)()];
                case 2:
                    metrics = _a.sent();
                    _i = 0, metrics_2 = metrics;
                    _a.label = 3;
                case 3:
                    if (!(_i < metrics_2.length)) return [3 /*break*/, 6];
                    metric = metrics_2[_i];
                    return [4 /*yield*/, checkAndTriggerActions(metric)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log('[WhalePack] Control loop iteration complete');
                    return [3 /*break*/, 9];
                case 7:
                    err_1 = _a.sent();
                    console.error('[WhalePack] Control loop error:', err_1);
                    return [3 /*break*/, 9];
                case 8:
                    controlLoopRunning = false;
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check metrics for an app and trigger actions if needed
 */
function checkAndTriggerActions(metric) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = metric.id;
                    switch (_a) {
                        case 'governance': return [3 /*break*/, 1];
                        case 'onboarding': return [3 /*break*/, 3];
                        case 'prediction': return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, checkGovernanceActions(metric)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, checkOnboardingActions(metric)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, checkPredictionActions(metric)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7: 
                // No auto-actions for other apps yet
                return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check governance metrics and trigger actions
 */
function checkGovernanceActions(metric) {
    return __awaiter(this, void 0, void 0, function () {
        var activeProposals, totalProposals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    activeProposals = metric.stats.activeProposals || 0;
                    totalProposals = metric.stats.totalProposals || 0;
                    if (!(activeProposals === 0 && totalProposals === 0)) return [3 /*break*/, 2];
                    // Check if we have passport holders (would need to query passport metrics)
                    // For now, trigger if no proposals exist
                    console.log('[WhalePack] Governance: No active proposals, highlighting create proposal');
                    return [4 /*yield*/, (0, actions_1.processWhaleAction)('governance', 'highlightCreateProposal', {
                            duration: 3600000, // 1 hour
                            reason: 'no_active_proposals',
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check onboarding metrics and trigger actions
 */
function checkOnboardingActions(metric) {
    return __awaiter(this, void 0, void 0, function () {
        var completionRate, totalStarted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    completionRate = metric.stats.completionRate || 0;
                    totalStarted = metric.stats.totalStarted || 0;
                    if (!(completionRate < 0.2 && totalStarted > 0)) return [3 /*break*/, 2];
                    console.log('[WhalePack] Onboarding: Low completion rate, increasing priority');
                    return [4 /*yield*/, (0, actions_1.processWhaleAction)('onboarding', 'increasePriority', {
                            priority: 2,
                            duration: 7200000, // 2 hours
                            reason: 'low_completion_rate',
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check prediction market metrics and trigger actions
 */
function checkPredictionActions(metric) {
    return __awaiter(this, void 0, void 0, function () {
        var activeMarkets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    activeMarkets = metric.stats.activeMarkets || 0;
                    if (!(activeMarkets === 0)) return [3 /*break*/, 2];
                    console.log('[WhalePack] Prediction: No active markets, highlighting create market');
                    return [4 /*yield*/, (0, actions_1.processWhaleAction)('prediction', 'highlightCreateMarket', {
                            duration: 3600000, // 1 hour
                            reason: 'no_active_markets',
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
/**
 * Start the control loop (runs every 5 minutes)
 */
function startControlLoop(intervalMs) {
    if (intervalMs === void 0) { intervalMs = 5 * 60 * 1000; }
    if (controlLoopInterval) {
        console.log('[WhalePack] Control loop already started');
        return;
    }
    console.log("[WhalePack] Starting control loop (interval: ".concat(intervalMs, "ms)"));
    // Run immediately
    runControlLoop();
    // Then run on interval
    controlLoopInterval = setInterval(function () {
        runControlLoop();
    }, intervalMs);
}
/**
 * Stop the control loop
 */
function stopControlLoop() {
    if (controlLoopInterval) {
        clearInterval(controlLoopInterval);
        controlLoopInterval = null;
        console.log('[WhalePack] Control loop stopped');
    }
}
