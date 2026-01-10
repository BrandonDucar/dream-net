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
exports.googleAdsRoutes = void 0;
var express_1 = require("express");
var GoogleAdsCloneService_1 = require("../services/GoogleAdsCloneService");
var adsSchema_1 = require("@shared/adsSchema");
var router = (0, express_1.Router)();
exports.googleAdsRoutes = router;
// Campaign Routes
router.post('/campaigns', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedData, campaign, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validatedData = adsSchema_1.insertCampaignSchema.parse(req.body);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.createCampaign(validatedData)];
            case 1:
                campaign = _a.sent();
                res.json({ success: true, data: campaign });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error creating campaign:', error_1);
                res.status(400).json({ success: false, error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/campaigns', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaigns, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getCampaigns()];
            case 1:
                campaigns = _a.sent();
                res.json({ success: true, data: campaigns });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching campaigns:', error_2);
                res.status(500).json({ success: false, error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/campaigns/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaign, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getCampaign(req.params.id)];
            case 1:
                campaign = _a.sent();
                if (!campaign) {
                    return [2 /*return*/, res.status(404).json({ success: false, error: 'Campaign not found' })];
                }
                res.json({ success: true, data: campaign });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching campaign:', error_3);
                res.status(500).json({ success: false, error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/campaigns/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, campaign, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updates = adsSchema_1.insertCampaignSchema.partial().parse(req.body);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.updateCampaign(req.params.id, updates)];
            case 1:
                campaign = _a.sent();
                res.json({ success: true, data: campaign });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error updating campaign:', error_4);
                res.status(400).json({ success: false, error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/campaigns/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deleted, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.deleteCampaign(req.params.id)];
            case 1:
                deleted = _a.sent();
                res.json({ success: true, deleted: deleted });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error deleting campaign:', error_5);
                res.status(500).json({ success: false, error: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Ad Group Routes
router.post('/ad-groups', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedData, adGroup, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validatedData = adsSchema_1.insertAdGroupSchema.parse(req.body);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.createAdGroup(validatedData)];
            case 1:
                adGroup = _a.sent();
                res.json({ success: true, data: adGroup });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error creating ad group:', error_6);
                res.status(400).json({ success: false, error: error_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/ad-groups', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignId, adGroups, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                campaignId = req.query.campaignId;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getAdGroups(campaignId)];
            case 1:
                adGroups = _a.sent();
                res.json({ success: true, data: adGroups });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error fetching ad groups:', error_7);
                res.status(500).json({ success: false, error: error_7.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/ad-groups/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, adGroup, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updates = adsSchema_1.insertAdGroupSchema.partial().parse(req.body);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.updateAdGroup(req.params.id, updates)];
            case 1:
                adGroup = _a.sent();
                res.json({ success: true, data: adGroup });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('Error updating ad group:', error_8);
                res.status(400).json({ success: false, error: error_8.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Keyword Routes
router.post('/keywords', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedData, keyword, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validatedData = adsSchema_1.insertKeywordSchema.parse(req.body);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.createKeyword(validatedData)];
            case 1:
                keyword = _a.sent();
                res.json({ success: true, data: keyword });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error creating keyword:', error_9);
                res.status(400).json({ success: false, error: error_9.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/keywords', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adGroupId, keywords, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                adGroupId = req.query.adGroupId;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getKeywords(adGroupId)];
            case 1:
                keywords = _a.sent();
                res.json({ success: true, data: keywords });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error('Error fetching keywords:', error_10);
                res.status(500).json({ success: false, error: error_10.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/keywords/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, keyword, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updates = adsSchema_1.insertKeywordSchema.partial().parse(req.body);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.updateKeyword(req.params.id, updates)];
            case 1:
                keyword = _a.sent();
                res.json({ success: true, data: keyword });
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                console.error('Error updating keyword:', error_11);
                res.status(400).json({ success: false, error: error_11.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/keywords/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deleted, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.deleteKeyword(req.params.id)];
            case 1:
                deleted = _a.sent();
                res.json({ success: true, deleted: deleted });
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                console.error('Error deleting keyword:', error_12);
                res.status(500).json({ success: false, error: error_12.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Ad Routes
router.post('/ads', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedData, ad, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validatedData = adsSchema_1.insertAdSchema.parse(req.body);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.createAd(validatedData)];
            case 1:
                ad = _a.sent();
                res.json({ success: true, data: ad });
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                console.error('Error creating ad:', error_13);
                res.status(400).json({ success: false, error: error_13.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/ads', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adGroupId, ads, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                adGroupId = req.query.adGroupId;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getAds(adGroupId)];
            case 1:
                ads = _a.sent();
                res.json({ success: true, data: ads });
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                console.error('Error fetching ads:', error_14);
                res.status(500).json({ success: false, error: error_14.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/ads/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, ad, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updates = adsSchema_1.insertAdSchema.partial().parse(req.body);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.updateAd(req.params.id, updates)];
            case 1:
                ad = _a.sent();
                res.json({ success: true, data: ad });
                return [3 /*break*/, 3];
            case 2:
                error_15 = _a.sent();
                console.error('Error updating ad:', error_15);
                res.status(400).json({ success: false, error: error_15.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Analytics & Performance Routes
router.get('/campaigns/:id/performance', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignId, _a, startDate, endDate, start, end, performance_1, error_16;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                campaignId = req.params.id;
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                start = startDate ? new Date(startDate) : undefined;
                end = endDate ? new Date(endDate) : undefined;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getCampaignPerformance(campaignId, start, end)];
            case 1:
                performance_1 = _b.sent();
                res.json({ success: true, data: performance_1 });
                return [3 /*break*/, 3];
            case 2:
                error_16 = _b.sent();
                console.error('Error fetching campaign performance:', error_16);
                res.status(500).json({ success: false, error: error_16.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/ad-groups/:id/performance', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adGroupId, _a, startDate, endDate, start, end, performance_2, error_17;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                adGroupId = req.params.id;
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                start = startDate ? new Date(startDate) : undefined;
                end = endDate ? new Date(endDate) : undefined;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getAdGroupPerformance(adGroupId, start, end)];
            case 1:
                performance_2 = _b.sent();
                res.json({ success: true, data: performance_2 });
                return [3 /*break*/, 3];
            case 2:
                error_17 = _b.sent();
                console.error('Error fetching ad group performance:', error_17);
                res.status(500).json({ success: false, error: error_17.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/keywords/:id/performance', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var keywordId, _a, startDate, endDate, start, end, performance_3, error_18;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                keywordId = req.params.id;
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                start = startDate ? new Date(startDate) : undefined;
                end = endDate ? new Date(endDate) : undefined;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getKeywordPerformance(keywordId, start, end)];
            case 1:
                performance_3 = _b.sent();
                res.json({ success: true, data: performance_3 });
                return [3 /*break*/, 3];
            case 2:
                error_18 = _b.sent();
                console.error('Error fetching keyword performance:', error_18);
                res.status(500).json({ success: false, error: error_18.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Dashboard & Overview Routes
router.get('/dashboard/summary', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var summary, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getDashboardSummary()];
            case 1:
                summary = _a.sent();
                res.json({ success: true, data: summary });
                return [3 /*break*/, 3];
            case 2:
                error_19 = _a.sent();
                console.error('Error fetching dashboard summary:', error_19);
                res.status(500).json({ success: false, error: error_19.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Keyword Research Routes
router.get('/keywords/suggestions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, seed, matchType, suggestions, error_20;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, seed = _a.seed, matchType = _a.matchType;
                if (!seed) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: 'Seed keyword is required' })];
                }
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.generateKeywordSuggestions(seed, matchType)];
            case 1:
                suggestions = _b.sent();
                res.json({ success: true, data: suggestions });
                return [3 /*break*/, 3];
            case 2:
                error_20 = _b.sent();
                console.error('Error generating keyword suggestions:', error_20);
                res.status(500).json({ success: false, error: error_20.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Sample Data Generation (for demo purposes)
router.post('/campaigns/:id/generate-sample-metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignId, days, error_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                campaignId = req.params.id;
                days = req.body.days;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.generateSampleMetrics(campaignId, days || 30)];
            case 1:
                _a.sent();
                res.json({ success: true, message: 'Sample metrics generated successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_21 = _a.sent();
                console.error('Error generating sample metrics:', error_21);
                res.status(500).json({ success: false, error: error_21.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Bid Management Routes
router.put('/campaigns/:id/bid-strategy', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignId, _a, strategy, targetCPA, campaign, error_22;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                campaignId = req.params.id;
                _a = req.body, strategy = _a.strategy, targetCPA = _a.targetCPA;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.updateBidStrategy(campaignId, strategy, targetCPA)];
            case 1:
                campaign = _b.sent();
                res.json({ success: true, data: campaign });
                return [3 /*break*/, 3];
            case 2:
                error_22 = _b.sent();
                console.error('Error updating bid strategy:', error_22);
                res.status(400).json({ success: false, error: error_22.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Bulk Operations Routes
router.put('/keywords/bulk/bids', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, keywordIds, bidAmount, result, error_23;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, keywordIds = _a.keywordIds, bidAmount = _a.bidAmount;
                if (!keywordIds || !Array.isArray(keywordIds) || keywordIds.length === 0) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: 'Keyword IDs array is required' })];
                }
                if (!bidAmount || typeof bidAmount !== 'number') {
                    return [2 /*return*/, res.status(400).json({ success: false, error: 'Valid bid amount is required' })];
                }
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.bulkUpdateKeywordBids(keywordIds, bidAmount)];
            case 1:
                result = _b.sent();
                res.json({ success: result, message: result ? 'Keywords updated successfully' : 'Failed to update keywords' });
                return [3 /*break*/, 3];
            case 2:
                error_23 = _b.sent();
                console.error('Error bulk updating keyword bids:', error_23);
                res.status(500).json({ success: false, error: error_23.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/campaigns/bulk/pause', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignIds, result, error_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                campaignIds = req.body.campaignIds;
                if (!campaignIds || !Array.isArray(campaignIds) || campaignIds.length === 0) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: 'Campaign IDs array is required' })];
                }
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.pauseCampaigns(campaignIds)];
            case 1:
                result = _a.sent();
                res.json({ success: result, message: result ? 'Campaigns paused successfully' : 'Failed to pause campaigns' });
                return [3 /*break*/, 3];
            case 2:
                error_24 = _a.sent();
                console.error('Error bulk pausing campaigns:', error_24);
                res.status(500).json({ success: false, error: error_24.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Ad Quality & Optimization Routes
router.get('/ads/:id/suggestions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adId, suggestions, error_25;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                adId = req.params.id;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getAdStrengthSuggestions(adId)];
            case 1:
                suggestions = _a.sent();
                res.json({ success: true, data: suggestions });
                return [3 /*break*/, 3];
            case 2:
                error_25 = _a.sent();
                console.error('Error fetching ad suggestions:', error_25);
                res.status(500).json({ success: false, error: error_25.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GEOFENCING ROUTES
// Get geofence locations for a campaign
router.get('/campaigns/:campaignId/geofences', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignId, locations, error_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                campaignId = req.params.campaignId;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getGeofenceLocations(campaignId)];
            case 1:
                locations = _a.sent();
                res.json({ success: true, locations: locations });
                return [3 /*break*/, 3];
            case 2:
                error_26 = _a.sent();
                console.error('Error fetching geofence locations:', error_26);
                res.status(500).json({ success: false, error: 'Failed to fetch geofence locations' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create competitor geofence
router.post('/campaigns/:campaignId/geofences/competitor', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignId, _a, competitorName, address, _b, radius, _c, bidModifier, geofence, error_27;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                campaignId = req.params.campaignId;
                _a = req.body, competitorName = _a.competitorName, address = _a.address, _b = _a.radius, radius = _b === void 0 ? 0.5 : _b, _c = _a.bidModifier, bidModifier = _c === void 0 ? 1.2 : _c;
                if (!competitorName || !address) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: 'Competitor name and address are required' })];
                }
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.createCompetitorGeofence(campaignId, competitorName, address, radius, bidModifier)];
            case 1:
                geofence = _d.sent();
                res.json({
                    success: true,
                    geofence: geofence,
                    message: "Competitor geofence created for ".concat(competitorName)
                });
                return [3 /*break*/, 3];
            case 2:
                error_27 = _d.sent();
                console.error('Error creating competitor geofence:', error_27);
                res.status(500).json({ success: false, error: 'Failed to create competitor geofence' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create radius geofence
router.post('/campaigns/:campaignId/geofences/radius', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignId, _a, centerAddress, radius, _b, bidModifier, geofence, error_28;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                campaignId = req.params.campaignId;
                _a = req.body, centerAddress = _a.centerAddress, radius = _a.radius, _b = _a.bidModifier, bidModifier = _b === void 0 ? 1.0 : _b;
                if (!centerAddress || !radius) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: 'Center address and radius are required' })];
                }
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.createRadiusGeofence(campaignId, centerAddress, radius, bidModifier)];
            case 1:
                geofence = _c.sent();
                res.json({
                    success: true,
                    geofence: geofence,
                    message: "Radius geofence created: ".concat(radius, " miles from ").concat(centerAddress)
                });
                return [3 /*break*/, 3];
            case 2:
                error_28 = _c.sent();
                console.error('Error creating radius geofence:', error_28);
                res.status(500).json({ success: false, error: 'Failed to create radius geofence' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create event geofence
router.post('/campaigns/:campaignId/geofences/event', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignId, _a, eventName, eventVenue, eventDate, _b, radius, _c, bidModifier, geofence, error_29;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                campaignId = req.params.campaignId;
                _a = req.body, eventName = _a.eventName, eventVenue = _a.eventVenue, eventDate = _a.eventDate, _b = _a.radius, radius = _b === void 0 ? 1.0 : _b, _c = _a.bidModifier, bidModifier = _c === void 0 ? 1.5 : _c;
                if (!eventName || !eventVenue || !eventDate) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: 'Event name, venue, and date are required' })];
                }
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.createEventGeofence(campaignId, eventName, eventVenue, new Date(eventDate), radius, bidModifier)];
            case 1:
                geofence = _d.sent();
                res.json({
                    success: true,
                    geofence: geofence,
                    message: "Event geofence created for ".concat(eventName)
                });
                return [3 /*break*/, 3];
            case 2:
                error_29 = _d.sent();
                console.error('Error creating event geofence:', error_29);
                res.status(500).json({ success: false, error: 'Failed to create event geofence' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get location performance analytics
router.get('/campaigns/:campaignId/location-performance', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var campaignId, _a, days, performance_4, error_30;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                campaignId = req.params.campaignId;
                _a = req.query.days, days = _a === void 0 ? 30 : _a;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getLocationPerformance(campaignId, Number(days))];
            case 1:
                performance_4 = _b.sent();
                res.json({ success: true, performance: performance_4 });
                return [3 /*break*/, 3];
            case 2:
                error_30 = _b.sent();
                console.error('Error fetching location performance:', error_30);
                res.status(500).json({ success: false, error: 'Failed to fetch location performance' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Generate location-based keywords
router.post('/keywords/location-suggestions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, businessType, targetLocation, keywords, error_31;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, businessType = _a.businessType, targetLocation = _a.targetLocation;
                if (!businessType || !targetLocation) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: 'Business type and target location are required' })];
                }
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.generateLocationKeywords(businessType, targetLocation)];
            case 1:
                keywords = _b.sent();
                res.json({ success: true, keywords: keywords });
                return [3 /*break*/, 3];
            case 2:
                error_31 = _b.sent();
                console.error('Error generating location keywords:', error_31);
                res.status(500).json({ success: false, error: 'Failed to generate location keywords' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GOOGLE PARTNER PROGRAM ROUTES
// Get current Google Partner status
router.get('/partner-program/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_1, progress, error_32;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.getPartnerStatus()];
            case 1:
                status_1 = _a.sent();
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.calculatePartnerProgress()];
            case 2:
                progress = _a.sent();
                res.json({
                    success: true,
                    partnerStatus: status_1,
                    progress: progress
                });
                return [3 /*break*/, 4];
            case 3:
                error_32 = _a.sent();
                console.error('Error fetching partner status:', error_32);
                res.status(500).json({ success: false, error: 'Failed to fetch partner status' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update partner program information
router.put('/partner-program/update', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, updatedProgram, error_33;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updates = req.body;
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.updatePartnerProgram(updates)];
            case 1:
                updatedProgram = _a.sent();
                res.json({
                    success: true,
                    partnerProgram: updatedProgram,
                    message: 'Partner program information updated successfully'
                });
                return [3 /*break*/, 3];
            case 2:
                error_33 = _a.sent();
                console.error('Error updating partner program:', error_33);
                res.status(500).json({ success: false, error: 'Failed to update partner program' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Add certification
router.post('/partner-program/certifications', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, certificationName, achievedDate, error_34;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, certificationName = _a.certificationName, achievedDate = _a.achievedDate;
                if (!certificationName) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: 'Certification name is required' })];
                }
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.addCertification(certificationName, achievedDate ? new Date(achievedDate) : new Date())];
            case 1:
                _b.sent();
                res.json({
                    success: true,
                    message: "Certification added: ".concat(certificationName)
                });
                return [3 /*break*/, 3];
            case 2:
                error_34 = _b.sent();
                console.error('Error adding certification:', error_34);
                res.status(500).json({ success: false, error: 'Failed to add certification' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get partner progress and next steps
router.get('/partner-program/progress', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var progress, error_35;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, GoogleAdsCloneService_1.googleAdsCloneService.calculatePartnerProgress()];
            case 1:
                progress = _a.sent();
                res.json({ success: true, progress: progress });
                return [3 /*break*/, 3];
            case 2:
                error_35 = _a.sent();
                console.error('Error calculating partner progress:', error_35);
                res.status(500).json({ success: false, error: 'Failed to calculate partner progress' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
