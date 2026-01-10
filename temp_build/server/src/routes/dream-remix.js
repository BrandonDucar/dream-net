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
var express_1 = require("express");
var router = (0, express_1.Router)();
// In-memory storage for remix submissions
var remixSubmissions = new Map();
var processedRemixes = new Map();
// POST /api/dreams/:dreamId/remix - Submit remix for infected dream
router.post('/:dreamId/remix', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dreamId, _a, wallet, remixText, tags, components, submitTime, submission, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                dreamId = req.params.dreamId;
                _a = req.body, wallet = _a.wallet, remixText = _a.remixText, tags = _a.tags, components = _a.components, submitTime = _a.submitTime;
                // Validate submission
                if (!wallet || !remixText || !tags || !components) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields',
                            required: ['wallet', 'remixText', 'tags', 'components']
                        })];
                }
                submission = {
                    dreamId: dreamId,
                    wallet: wallet,
                    remixText: remixText,
                    tags: tags,
                    components: components,
                    submitTime: submitTime || Date.now()
                };
                // Store submission
                if (!remixSubmissions.has(dreamId)) {
                    remixSubmissions.set(dreamId, []);
                }
                remixSubmissions.get(dreamId).push(submission);
                return [4 /*yield*/, processRemix(submission)];
            case 1:
                result = _b.sent();
                res.json({
                    success: true,
                    submission: submission,
                    result: result,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(500).json({
                    error: 'Failed to submit remix',
                    details: error_1 instanceof Error ? error_1.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/dreams/:dreamId/remixes - Get all remix submissions for a dream
router.get('/:dreamId/remixes', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dreamId_1, submissions;
    return __generator(this, function (_a) {
        try {
            dreamId_1 = req.params.dreamId;
            submissions = remixSubmissions.get(dreamId_1) || [];
            res.json({
                success: true,
                dreamId: dreamId_1,
                submissions: submissions.map(function (sub) { return (__assign(__assign({}, sub), { result: processedRemixes.get("".concat(dreamId_1, "-").concat(sub.wallet, "-").concat(sub.submitTime)) })); }),
                totalSubmissions: submissions.length
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to fetch remixes',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return [2 /*return*/];
    });
}); });
// POST /api/dreams/remix/process - Process specific remix submission
router.post('/remix/process', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                submission = req.body;
                return [4 /*yield*/, processRemix(submission)];
            case 1:
                result = _a.sent();
                res.json({
                    success: true,
                    result: result,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({
                    error: 'Failed to process remix',
                    details: error_2 instanceof Error ? error_2.message : 'Unknown error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Process remix submission and calculate results
function processRemix(submission) {
    return __awaiter(this, void 0, void 0, function () {
        var dreamId, wallet, remixText, tags, components, baseScore, textWords, qualityWords, qualityMatches, relevantTags, tagMatches, validComponents, componentMatches, finalScore, bountyAmount, bonusAmount, totalBounty, purificationLevel, result, resultKey;
        return __generator(this, function (_a) {
            dreamId = submission.dreamId, wallet = submission.wallet, remixText = submission.remixText, tags = submission.tags, components = submission.components;
            baseScore = 50;
            textWords = remixText.split(' ').length;
            qualityWords = ['stabilized', 'improved', 'enhanced', 'optimized', 'fixed'];
            qualityMatches = qualityWords.filter(function (word) {
                return remixText.toLowerCase().includes(word);
            }).length;
            baseScore += Math.min(textWords * 2, 20); // Up to 20 points for length
            baseScore += qualityMatches * 5; // 5 points per quality word
            relevantTags = ['defi', 'ai', 'stability', 'security', 'optimization'];
            tagMatches = tags.filter(function (tag) { return relevantTags.includes(tag); }).length;
            baseScore += tagMatches * 3;
            validComponents = ['canvas', 'lucid', 'root', 'echo', 'cradle', 'wing'];
            componentMatches = components.filter(function (comp) { return validComponents.includes(comp); }).length;
            baseScore += componentMatches * 5;
            // Dream-specific bonuses
            if (dreamId === '7b3d') {
                if (remixText.toLowerCase().includes('portal'))
                    baseScore += 10;
                if (remixText.toLowerCase().includes('fallback'))
                    baseScore += 8;
                if (tags.includes('stability'))
                    baseScore += 12;
            }
            finalScore = Math.min(Math.max(baseScore, 30), 95);
            bountyAmount = 100;
            bonusAmount = 0;
            if (finalScore >= 80) {
                bonusAmount = 200;
            }
            else if (finalScore >= 70) {
                bonusAmount = 150;
            }
            else if (finalScore >= 60) {
                bonusAmount = 100;
            }
            // Special bonus for dream 7b3d
            if (dreamId === '7b3d') {
                bonusAmount += 250; // Original bounty amount
            }
            totalBounty = bountyAmount + bonusAmount;
            purificationLevel = 0;
            if (finalScore >= 85)
                purificationLevel = 100;
            else if (finalScore >= 75)
                purificationLevel = 80;
            else if (finalScore >= 65)
                purificationLevel = 60;
            else if (finalScore >= 55)
                purificationLevel = 40;
            else
                purificationLevel = 20;
            result = {
                success: true,
                remixId: "remix-".concat(dreamId, "-").concat(Date.now().toString(36)),
                score: finalScore,
                bountyAwarded: {
                    token: 'SHEEP',
                    amount: totalBounty,
                    bonus: bonusAmount
                },
                status: purificationLevel >= 80 ? 'purified' : purificationLevel >= 60 ? 'stabilized' : 'improved',
                purificationLevel: purificationLevel
            };
            resultKey = "".concat(dreamId, "-").concat(wallet, "-").concat(submission.submitTime);
            processedRemixes.set(resultKey, result);
            return [2 /*return*/, result];
        });
    });
}
exports.default = router;
