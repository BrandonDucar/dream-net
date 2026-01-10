"use strict";
/**
 * Whale Pack Metrics Aggregator
 * Collects metrics from all mini-apps
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
exports.getMiniAppMetrics = getMiniAppMetrics;
exports.getAllMetrics = getAllMetrics;
var db_1 = require("../db");
/**
 * Get metrics for a specific mini-app
 */
function getMiniAppMetrics(appId) {
    return __awaiter(this, void 0, void 0, function () {
        var now, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    now = Date.now();
                    _a = appId;
                    switch (_a) {
                        case 'passport': return [3 /*break*/, 1];
                        case 'governance': return [3 /*break*/, 3];
                        case 'vault': return [3 /*break*/, 5];
                        case 'bounty': return [3 /*break*/, 7];
                        case 'timeCapsule': return [3 /*break*/, 9];
                        case 'prediction': return [3 /*break*/, 11];
                        case 'dreamscopeOps': return [3 /*break*/, 13];
                        case 'onboarding': return [3 /*break*/, 15];
                        case 'creatorStudio': return [3 /*break*/, 17];
                    }
                    return [3 /*break*/, 19];
                case 1: return [4 /*yield*/, getPassportMetrics(now)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [4 /*yield*/, getGovernanceMetrics(now)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: return [4 /*yield*/, getVaultMetrics(now)];
                case 6: return [2 /*return*/, _b.sent()];
                case 7: return [4 /*yield*/, getBountyMetrics(now)];
                case 8: return [2 /*return*/, _b.sent()];
                case 9: return [4 /*yield*/, getTimeCapsuleMetrics(now)];
                case 10: return [2 /*return*/, _b.sent()];
                case 11: return [4 /*yield*/, getPredictionMetrics(now)];
                case 12: return [2 /*return*/, _b.sent()];
                case 13: return [4 /*yield*/, getDreamscopeOpsMetrics(now)];
                case 14: return [2 /*return*/, _b.sent()];
                case 15: return [4 /*yield*/, getOnboardingMetrics(now)];
                case 16: return [2 /*return*/, _b.sent()];
                case 17: return [4 /*yield*/, getCreatorStudioMetrics(now)];
                case 18: return [2 /*return*/, _b.sent()];
                case 19: throw new Error("Unknown app ID: ".concat(appId));
            }
        });
    });
}
/**
 * Get all metrics
 */
function getAllMetrics() {
    return __awaiter(this, void 0, void 0, function () {
        var appIds, metrics;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appIds = [
                        'passport',
                        'governance',
                        'vault',
                        'bounty',
                        'timeCapsule',
                        'prediction',
                        'dreamscopeOps',
                        'onboarding',
                        'creatorStudio',
                    ];
                    return [4 /*yield*/, Promise.all(appIds.map(function (id) { return getMiniAppMetrics(id).catch(function (err) {
                            console.error("Failed to get metrics for ".concat(id, ":"), err);
                            return createErrorMetric(id, err.message);
                        }); }))];
                case 1:
                    metrics = _a.sent();
                    return [2 /*return*/, metrics];
            }
        });
    });
}
function createErrorMetric(id, error) {
    return {
        id: id,
        label: id,
        category: 'utility',
        stats: { error: 1 },
        health: 'unhealthy',
        updatedAt: Date.now(),
    };
}
function getPassportMetrics(now) {
    return __awaiter(this, void 0, void 0, function () {
        var db, totalMinted, recentMints;
        return __generator(this, function (_a) {
            db = (0, db_1.getDb)();
            totalMinted = 0;
            recentMints = 0;
            try {
                // Would query contract events or DB
                // For now, use placeholder
                totalMinted = 0; // Placeholder
                recentMints = 0; // Placeholder
            }
            catch (err) {
                console.error('Error getting passport metrics:', err);
            }
            return [2 /*return*/, {
                    id: 'passport',
                    label: 'Dream Passport Mint',
                    category: 'identity',
                    stats: {
                        totalMinted: totalMinted,
                        recentMints24h: recentMints,
                        activeHolders: totalMinted, // Placeholder
                    },
                    health: totalMinted > 0 ? 'healthy' : 'degraded',
                    updatedAt: now,
                }];
        });
    });
}
function getGovernanceMetrics(now) {
    return __awaiter(this, void 0, void 0, function () {
        var activeProposals, totalProposals, totalVotes;
        return __generator(this, function (_a) {
            activeProposals = 0;
            totalProposals = 0;
            totalVotes = 0;
            try {
                // Would query contract
                activeProposals = 0; // Placeholder
                totalProposals = 0; // Placeholder
                totalVotes = 0; // Placeholder
            }
            catch (err) {
                console.error('Error getting governance metrics:', err);
            }
            return [2 /*return*/, {
                    id: 'governance',
                    label: 'Dream State Governance',
                    category: 'governance',
                    stats: {
                        activeProposals: activeProposals,
                        totalProposals: totalProposals,
                        totalVotes: totalVotes,
                        participationRate: totalVotes > 0 ? (totalVotes / totalProposals) : 0,
                    },
                    health: activeProposals > 0 ? 'healthy' : 'degraded',
                    updatedAt: now,
                }];
        });
    });
}
function getVaultMetrics(now) {
    return __awaiter(this, void 0, void 0, function () {
        var totalVaults, activeVaults;
        return __generator(this, function (_a) {
            totalVaults = 0;
            activeVaults = 0;
            try {
                // Would query contract
                totalVaults = 0; // Placeholder
                activeVaults = 0; // Placeholder
            }
            catch (err) {
                console.error('Error getting vault metrics:', err);
            }
            return [2 /*return*/, {
                    id: 'vault',
                    label: 'Dream Vault',
                    category: 'utility',
                    stats: {
                        totalVaults: totalVaults,
                        activeVaults: activeVaults,
                        totalRevenue: 0, // Placeholder
                    },
                    health: totalVaults > 0 ? 'healthy' : 'degraded',
                    updatedAt: now,
                }];
        });
    });
}
function getBountyMetrics(now) {
    return __awaiter(this, void 0, void 0, function () {
        var activeBounties, totalBounties, totalValue;
        return __generator(this, function (_a) {
            activeBounties = 0;
            totalBounties = 0;
            totalValue = 0;
            try {
                // Would query contract
                activeBounties = 0; // Placeholder
                totalBounties = 0; // Placeholder
                totalValue = 0; // Placeholder
            }
            catch (err) {
                console.error('Error getting bounty metrics:', err);
            }
            return [2 /*return*/, {
                    id: 'bounty',
                    label: 'Bounty Board',
                    category: 'utility',
                    stats: {
                        activeBounties: activeBounties,
                        totalBounties: totalBounties,
                        totalValueETH: totalValue,
                        avgBountyValue: totalBounties > 0 ? totalValue / totalBounties : 0,
                    },
                    health: activeBounties > 0 ? 'healthy' : 'degraded',
                    updatedAt: now,
                }];
        });
    });
}
function getTimeCapsuleMetrics(now) {
    return __awaiter(this, void 0, void 0, function () {
        var totalCapsules, unlockedCapsules, lockedCapsules;
        return __generator(this, function (_a) {
            totalCapsules = 0;
            unlockedCapsules = 0;
            lockedCapsules = 0;
            try {
                // Would query contract
                totalCapsules = 0; // Placeholder
                unlockedCapsules = 0; // Placeholder
                lockedCapsules = 0; // Placeholder
            }
            catch (err) {
                console.error('Error getting time capsule metrics:', err);
            }
            return [2 /*return*/, {
                    id: 'timeCapsule',
                    label: 'Dream Time Capsule',
                    category: 'creative',
                    stats: {
                        totalCapsules: totalCapsules,
                        unlockedCapsules: unlockedCapsules,
                        lockedCapsules: lockedCapsules,
                        unlockRate: totalCapsules > 0 ? unlockedCapsules / totalCapsules : 0,
                    },
                    health: totalCapsules > 0 ? 'healthy' : 'degraded',
                    updatedAt: now,
                }];
        });
    });
}
function getPredictionMetrics(now) {
    return __awaiter(this, void 0, void 0, function () {
        var activeMarkets, totalMarkets, totalStaked;
        return __generator(this, function (_a) {
            activeMarkets = 0;
            totalMarkets = 0;
            totalStaked = 0;
            try {
                // Would query contract
                activeMarkets = 0; // Placeholder
                totalMarkets = 0; // Placeholder
                totalStaked = 0; // Placeholder
            }
            catch (err) {
                console.error('Error getting prediction metrics:', err);
            }
            return [2 /*return*/, {
                    id: 'prediction',
                    label: 'Dream Prediction Market',
                    category: 'utility',
                    stats: {
                        activeMarkets: activeMarkets,
                        totalMarkets: totalMarkets,
                        totalStakedETH: totalStaked,
                        avgMarketSize: activeMarkets > 0 ? totalStaked / activeMarkets : 0,
                    },
                    health: activeMarkets > 0 ? 'healthy' : 'degraded',
                    updatedAt: now,
                }];
        });
    });
}
function getDreamscopeOpsMetrics(now) {
    return __awaiter(this, void 0, void 0, function () {
        var apiErrorRate, avgLatency, txSuccessRate;
        return __generator(this, function (_a) {
            apiErrorRate = 0;
            avgLatency = 0;
            txSuccessRate = 1.0;
            try {
                // Would query system metrics
                // For now, use placeholders
                apiErrorRate = 0; // Placeholder
                avgLatency = 0; // Placeholder
                txSuccessRate = 1.0; // Placeholder
            }
            catch (err) {
                console.error('Error getting ops metrics:', err);
            }
            return [2 /*return*/, {
                    id: 'dreamscopeOps',
                    label: 'DreamScope Ops Console',
                    category: 'ops',
                    stats: {
                        apiErrorRate: apiErrorRate,
                        avgLatencyMs: avgLatency,
                        txSuccessRate: txSuccessRate,
                        systemHealth: 1.0, // Placeholder
                    },
                    health: apiErrorRate < 0.05 ? 'healthy' : apiErrorRate < 0.1 ? 'degraded' : 'unhealthy',
                    updatedAt: now,
                }];
        });
    });
}
function getOnboardingMetrics(now) {
    return __awaiter(this, void 0, void 0, function () {
        var db, totalStarted, totalCompleted, completionRate;
        return __generator(this, function (_a) {
            db = (0, db_1.getDb)();
            totalStarted = 0;
            totalCompleted = 0;
            completionRate = 0;
            try {
                // Would query onboarding DB
                // For now, use placeholders
                totalStarted = 0; // Placeholder
                totalCompleted = 0; // Placeholder
                completionRate = totalStarted > 0 ? totalCompleted / totalStarted : 0;
            }
            catch (err) {
                console.error('Error getting onboarding metrics:', err);
            }
            return [2 /*return*/, {
                    id: 'onboarding',
                    label: 'Onboarding Wizard',
                    category: 'onboarding',
                    stats: {
                        totalStarted: totalStarted,
                        totalCompleted: totalCompleted,
                        completionRate: completionRate,
                        activeUsers: totalStarted - totalCompleted,
                    },
                    health: completionRate > 0.5 ? 'healthy' : completionRate > 0.2 ? 'degraded' : 'unhealthy',
                    updatedAt: now,
                }];
        });
    });
}
function getCreatorStudioMetrics(now) {
    return __awaiter(this, void 0, void 0, function () {
        var db, totalDreams, recentDreams, activeCreators;
        return __generator(this, function (_a) {
            db = (0, db_1.getDb)();
            totalDreams = 0;
            recentDreams = 0;
            activeCreators = 0;
            try {
                // Would query dreams DB
                // For now, use placeholders
                totalDreams = 0; // Placeholder
                recentDreams = 0; // Placeholder
                activeCreators = 0; // Placeholder
            }
            catch (err) {
                console.error('Error getting creator studio metrics:', err);
            }
            return [2 /*return*/, {
                    id: 'creatorStudio',
                    label: 'Creator Studio',
                    category: 'creative',
                    stats: {
                        totalDreams: totalDreams,
                        recentDreams24h: recentDreams,
                        activeCreators: activeCreators,
                        avgDreamsPerCreator: activeCreators > 0 ? totalDreams / activeCreators : 0,
                    },
                    health: totalDreams > 0 ? 'healthy' : 'degraded',
                    updatedAt: now,
                }];
        });
    });
}
