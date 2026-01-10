"use strict";
/**
 * Website AI Designer API Routes
 * Integrates ChatGPT GPT "Website AI Designer" for automated website generation
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
var express_1 = require("express");
var router = (0, express_1.Router)();
// Optional import - website designer may not be available
var getWebsiteDesigner;
var WebsiteDesignRequest;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var module_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('../../packages/website-ai-designer'); })];
            case 1:
                module_1 = _a.sent();
                getWebsiteDesigner = module_1.getWebsiteDesigner;
                WebsiteDesignRequest = module_1.WebsiteDesignRequest;
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.warn('[Website Designer] Package not available, routes will return 503');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
/**
 * POST /api/website-designer/generate
 * Generate a website using Website AI Designer GPT
 */
router.post('/generate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request, designer, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!getWebsiteDesigner) {
                    return [2 /*return*/, res.status(503).json({ error: 'Website Designer service not available' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                request = req.body;
                if (!request.description) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Description is required',
                        })];
                }
                console.log('[WebsiteDesigner] Generating website:', request.description);
                designer = getWebsiteDesigner();
                return [4 /*yield*/, designer.generateWebsite(request)];
            case 2:
                result = _a.sent();
                if (!result.success) {
                    return [2 /*return*/, res.status(500).json(result)];
                }
                res.json({
                    success: true,
                    result: result,
                    timestamp: new Date().toISOString(),
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('[WebsiteDesigner] Error:', error_2);
                res.status(500).json({
                    success: false,
                    error: error_2.message || 'Failed to generate website',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/website-designer/generate-code
 * Generate website code (HTML/CSS/JS) ready for deployment
 */
router.post('/generate-code', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request, designer, code, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!getWebsiteDesigner) {
                    return [2 /*return*/, res.status(503).json({ error: 'Website Designer service not available' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                request = req.body;
                if (!request.description) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Description is required',
                        })];
                }
                console.log('[WebsiteDesigner] Generating website code:', request.description);
                designer = getWebsiteDesigner();
                return [4 /*yield*/, designer.generateWebsiteCode(request)];
            case 2:
                code = _a.sent();
                res.json({
                    success: true,
                    code: code,
                    timestamp: new Date().toISOString(),
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('[WebsiteDesigner] Code generation error:', error_3);
                res.status(500).json({
                    success: false,
                    error: error_3.message || 'Failed to generate website code',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/website-designer/health
 * Check if Website AI Designer is available
 */
router.get('/health', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var designer, hasOpenAI;
    return __generator(this, function (_a) {
        if (!getWebsiteDesigner) {
            return [2 /*return*/, res.json({ success: false, available: false, message: 'Website Designer package not installed' })];
        }
        try {
            designer = getWebsiteDesigner();
            hasOpenAI = !!process.env.OPENAI_API_KEY;
            res.json({
                success: true,
                available: hasOpenAI,
                gptId: 'g-rLwPjHrHR',
                message: hasOpenAI
                    ? 'Website AI Designer is ready'
                    : 'OpenAI API key not configured',
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
