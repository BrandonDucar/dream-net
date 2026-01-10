"use strict";
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
exports.registerPremiumMetalsRoutes = registerPremiumMetalsRoutes;
var PREMIUM_TIERS = {
    basic: {
        name: 'Basic Intelligence',
        price: 4.99,
        features: ['Real-time prices', 'Basic trends', 'Daily signals'],
        dataAccess: ['bronze', 'public'],
        limits: {
            trendsPerDay: 10,
            signalsPerDay: 5,
            reportsPerMonth: 2
        }
    },
    silver: {
        name: 'Silver Intelligence',
        price: 9.99,
        features: ['Advanced trends', 'Competitor analysis', 'Weekly reports'],
        dataAccess: ['bronze', 'silver', 'public'],
        limits: {
            trendsPerDay: 25,
            signalsPerDay: 15,
            reportsPerMonth: 8
        }
    },
    gold: {
        name: 'Gold Intelligence',
        price: 24.99,
        features: ['Premium signals', 'Business insights', 'Custom analysis'],
        dataAccess: ['bronze', 'silver', 'gold', 'public'],
        limits: {
            trendsPerDay: 50,
            signalsPerDay: 30,
            reportsPerMonth: 20
        }
    },
    platinum: {
        name: 'Platinum Intelligence',
        price: 49.99,
        features: ['Real-time alerts', 'API access', 'Priority support', 'Custom reports'],
        dataAccess: ['bronze', 'silver', 'gold', 'platinum', 'public'],
        limits: {
            trendsPerDay: -1, // unlimited
            signalsPerDay: -1,
            reportsPerMonth: -1
        }
    },
    enterprise: {
        name: 'Enterprise Intelligence',
        price: 197.00,
        features: ['White-label access', 'Custom integrations', 'Dedicated support'],
        dataAccess: ['bronze', 'silver', 'gold', 'platinum', 'premium', 'public'],
        limits: {
            trendsPerDay: -1,
            signalsPerDay: -1,
            reportsPerMonth: -1
        }
    }
};
function registerPremiumMetalsRoutes(app) {
    var _this = this;
    // Get available premium tiers
    app.get('/api/premium-metals/tiers', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                res.json({
                    success: true,
                    tiers: Object.entries(PREMIUM_TIERS).map(function (_a) {
                        var key = _a[0], tier = _a[1];
                        return (__assign({ id: key }, tier));
                    })
                });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // Check user's access level
    app.get('/api/premium-metals/access', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, userTier, accessLevel;
        var _a;
        return __generator(this, function (_b) {
            try {
                userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.ip || 'anonymous';
                userTier = 'basic';
                accessLevel = PREMIUM_TIERS[userTier];
                res.json({
                    success: true,
                    access: __assign(__assign({ tier: userTier }, accessLevel), { usage: {
                            trendsToday: 3,
                            signalsToday: 1,
                            reportsThisMonth: 0
                        } })
                });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // Get premium market data based on user's tier
    app.get('/api/premium-metals/data', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var userId, userTier, tierAccess_1, dreamVault, items, accessibleItems, limitedItems, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.ip || 'anonymous';
                    userTier = 'basic';
                    tierAccess_1 = PREMIUM_TIERS[userTier];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/dreamVault'); })];
                case 1:
                    dreamVault = (_b.sent()).dreamVault;
                    return [4 /*yield*/, dreamVault.getItemsByOwner('metals_mint_system')];
                case 2:
                    items = _b.sent();
                    accessibleItems = items.filter(function (item) {
                        var _a;
                        return ((_a = item.metadata) === null || _a === void 0 ? void 0 : _a.premiumTier) &&
                            tierAccess_1.dataAccess.includes(item.metadata.premiumTier);
                    });
                    limitedItems = tierAccess_1.limits.trendsPerDay === -1 ?
                        accessibleItems :
                        accessibleItems.slice(0, tierAccess_1.limits.trendsPerDay);
                    res.json({
                        success: true,
                        data: limitedItems.map(function (item) {
                            var _a, _b, _c, _d;
                            return ({
                                id: item.id,
                                title: item.title,
                                category: item.category,
                                premium_tier: (_a = item.metadata) === null || _a === void 0 ? void 0 : _a.premiumTier,
                                monetization_value: (_b = item.metadata) === null || _b === void 0 ? void 0 : _b.monetizationValue,
                                business_value: (_c = item.metadata) === null || _c === void 0 ? void 0 : _c.businessValue,
                                preview: item.content.substring(0, 200) + '...',
                                unlock_price: ((_d = item.metadata) === null || _d === void 0 ? void 0 : _d.monetizationValue) || 4.99,
                                tags: item.tags
                            });
                        }),
                        access: {
                            tier: userTier,
                            remaining: {
                                trends: tierAccess_1.limits.trendsPerDay === -1 ? 'unlimited' :
                                    Math.max(0, tierAccess_1.limits.trendsPerDay - 3),
                                signals: tierAccess_1.limits.signalsPerDay === -1 ? 'unlimited' :
                                    Math.max(0, tierAccess_1.limits.signalsPerDay - 1)
                            }
                        }
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    res.status(500).json({ success: false, error: error_1.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Unlock specific premium content
    app.post('/api/premium-metals/unlock/:itemId', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var itemId, userId, dreamVault, item, unlockPrice, unlockSuccess, error_2;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 6, , 7]);
                    itemId = req.params.itemId;
                    userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.ip || 'anonymous';
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/dreamVault'); })];
                case 1:
                    dreamVault = (_e.sent()).dreamVault;
                    return [4 /*yield*/, dreamVault.getItem(itemId, 'metals_mint_system')];
                case 2:
                    item = _e.sent();
                    if (!item) {
                        return [2 /*return*/, res.status(404).json({ success: false, error: 'Item not found' })];
                    }
                    unlockPrice = ((_b = item.metadata) === null || _b === void 0 ? void 0 : _b.monetizationValue) || 4.99;
                    unlockSuccess = true;
                    if (!unlockSuccess) return [3 /*break*/, 4];
                    // Log revenue tracking
                    return [4 /*yield*/, dreamVault.storeItem({
                            title: "Revenue: Premium Unlock - ".concat(item.title),
                            content: JSON.stringify({
                                itemId: itemId,
                                userId: userId,
                                amount: unlockPrice,
                                timestamp: new Date().toISOString(),
                                tier: (_c = item.metadata) === null || _c === void 0 ? void 0 : _c.premiumTier,
                                businessValue: (_d = item.metadata) === null || _d === void 0 ? void 0 : _d.businessValue
                            }),
                            type: 'document',
                            category: 'revenue_tracking',
                            tags: ['revenue', 'premium_unlock', 'precious_metals'],
                            accessLevel: 'restricted',
                            metadata: {
                                revenueAmount: unlockPrice,
                                revenueType: 'premium_unlock',
                                sourceItem: itemId
                            }
                        }, 'revenue_system')];
                case 3:
                    // Log revenue tracking
                    _e.sent();
                    res.json({
                        success: true,
                        unlocked: true,
                        content: item.content,
                        metadata: item.metadata,
                        revenue_generated: unlockPrice
                    });
                    return [3 /*break*/, 5];
                case 4:
                    res.status(402).json({
                        success: false,
                        error: 'Payment required',
                        unlock_price: unlockPrice
                    });
                    _e.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _e.sent();
                    res.status(500).json({ success: false, error: error_2.message });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    // Get revenue analytics
    app.get('/api/premium-metals/revenue', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var dreamVault, items, revenueData, totalRevenue, dailyRevenue, tierBreakdown, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/dreamVault'); })];
                case 1:
                    dreamVault = (_a.sent()).dreamVault;
                    return [4 /*yield*/, dreamVault.getItemsByCategory('revenue_tracking')];
                case 2:
                    items = _a.sent();
                    revenueData = items
                        .filter(function (item) { var _a; return ((_a = item.metadata) === null || _a === void 0 ? void 0 : _a.revenueType) === 'premium_unlock'; })
                        .map(function (item) { return JSON.parse(item.content); });
                    totalRevenue = revenueData.reduce(function (sum, data) { return sum + data.amount; }, 0);
                    dailyRevenue = revenueData
                        .filter(function (data) { return new Date(data.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000); })
                        .reduce(function (sum, data) { return sum + data.amount; }, 0);
                    tierBreakdown = revenueData.reduce(function (acc, data) {
                        acc[data.tier] = (acc[data.tier] || 0) + data.amount;
                        return acc;
                    }, {});
                    res.json({
                        success: true,
                        revenue: {
                            total: totalRevenue,
                            daily: dailyRevenue,
                            monthly: revenueData
                                .filter(function (data) { return new Date(data.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); })
                                .reduce(function (sum, data) { return sum + data.amount; }, 0),
                            by_tier: tierBreakdown,
                            transaction_count: revenueData.length,
                            average_transaction: totalRevenue / (revenueData.length || 1),
                            projected_monthly: dailyRevenue * 30
                        }
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    res.status(500).json({ success: false, error: error_3.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Get premium content statistics
    app.get('/api/premium-metals/stats', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var dreamVault, items, tierCounts, businessValueCounts, totalMonetizationValue, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/dreamVault'); })];
                case 1:
                    dreamVault = (_a.sent()).dreamVault;
                    return [4 /*yield*/, dreamVault.getItemsByCategory('precious_metals_intelligence')];
                case 2:
                    items = _a.sent();
                    tierCounts = items.reduce(function (acc, item) {
                        var _a;
                        var tier = ((_a = item.metadata) === null || _a === void 0 ? void 0 : _a.premiumTier) || 'unknown';
                        acc[tier] = (acc[tier] || 0) + 1;
                        return acc;
                    }, {});
                    businessValueCounts = items.reduce(function (acc, item) {
                        var _a;
                        var value = ((_a = item.metadata) === null || _a === void 0 ? void 0 : _a.businessValue) || 'unknown';
                        acc[value] = (acc[value] || 0) + 1;
                        return acc;
                    }, {});
                    totalMonetizationValue = items.reduce(function (sum, item) { var _a; return sum + (((_a = item.metadata) === null || _a === void 0 ? void 0 : _a.monetizationValue) || 0); }, 0);
                    res.json({
                        success: true,
                        stats: {
                            total_items: items.length,
                            tier_distribution: tierCounts,
                            business_value_distribution: businessValueCounts,
                            total_monetization_value: totalMonetizationValue,
                            average_item_value: totalMonetizationValue / (items.length || 1),
                            content_created_today: items.filter(function (item) {
                                return new Date(item.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                            }).length
                        }
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    res.status(500).json({ success: false, error: error_4.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
