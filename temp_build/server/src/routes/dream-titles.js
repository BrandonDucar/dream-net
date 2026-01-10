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
var router = express_1.default.Router();
var openai = null;
// Initialize OpenAI if API key is available
if (process.env.OPENAI_API_KEY) {
    try {
        var OpenAI = require('openai');
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
    catch (error) {
        console.warn('OpenAI module not available, using fallback titles');
    }
}
// Your exact pattern implementation
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tags, description, remix, fusion, base, prefix, prompt_1, response, titles, error_1, _b, isRemix, isFusion, fallbackTitles;
    var _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 2, , 3]);
                if (!openai) {
                    return [2 /*return*/, res.status(503).json({
                            success: false,
                            error: 'OpenAI API key not configured',
                            titleSuggestions: ['Creative Dream Title', 'Innovative Vision', 'Inspired Creation']
                        })];
                }
                _a = req.body, tags = _a.tags, description = _a.description, remix = _a.remix, fusion = _a.fusion;
                if (!tags || !description) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Tags and description are required'
                        })];
                }
                base = "This is a dream related to ".concat(tags.join(', '), ". Description: ").concat(description, ".");
                prefix = remix
                    ? "Remix of a previous dream"
                    : fusion
                        ? "Fusion between two dreams"
                        : "Original creation";
                prompt_1 = "Suggest 3 creative titles for a ".concat(prefix, ". ").concat(base);
                return [4 /*yield*/, openai.chat.completions.create({
                        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
                        messages: [{ role: 'user', content: prompt_1 }],
                        temperature: 0.9
                    })];
            case 1:
                response = _g.sent();
                titles = (_f = (_e = (_d = (_c = response.choices) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.split('\n').filter(Boolean);
                console.log("Generated ".concat((titles === null || titles === void 0 ? void 0 : titles.length) || 0, " title suggestions for ").concat(prefix));
                res.json({ titleSuggestions: titles });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _g.sent();
                console.error('Title generation error:', error_1);
                _b = req.body, isRemix = _b.remix, isFusion = _b.fusion;
                fallbackTitles = isRemix
                    ? ['Neural Bloom', 'The Lucid Key', 'Fractal Thread']
                    : isFusion
                        ? ['Synthesized Reality', 'Merged Consciousness', 'Hybrid Vision']
                        : ['Neural Bloom', 'The Lucid Key', 'Fractal Thread'];
                res.json({
                    success: false,
                    error: 'Failed to generate titles with AI',
                    titleSuggestions: fallbackTitles
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Alternative endpoint with different prompt strategies
router.post('/advanced', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tags, description, remix, fusion, style, base, stylePrompt, prefix, prompt_2, response, titles, error_2;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 2, , 3]);
                if (!openai) {
                    return [2 /*return*/, res.status(503).json({
                            success: false,
                            error: 'OpenAI API key not configured'
                        })];
                }
                _a = req.body, tags = _a.tags, description = _a.description, remix = _a.remix, fusion = _a.fusion, style = _a.style;
                base = "This is a dream related to ".concat(tags.join(', '), ". Description: ").concat(description, ".");
                stylePrompt = style ? " The titles should be ".concat(style, ".") : '';
                prefix = remix
                    ? "Remix of a previous dream"
                    : fusion
                        ? "Fusion between two dreams"
                        : "Original creation";
                prompt_2 = "Generate 5 compelling, creative titles for a ".concat(prefix, ". ").concat(base).concat(stylePrompt, " \n    \n    Please provide titles that are:\n    - Evocative and memorable\n    - Related to the themes: ").concat(tags.join(', '), "\n    - Suitable for a digital dream platform\n    \n    Format: Return only the titles, one per line.");
                return [4 /*yield*/, openai.chat.completions.create({
                        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
                        messages: [{ role: 'user', content: prompt_2 }],
                        temperature: 0.9,
                        max_tokens: 200
                    })];
            case 1:
                response = _f.sent();
                titles = (_e = (_d = (_c = (_b = response.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.split('\n').filter(Boolean).map(function (title) { return title.replace(/^\d+\.\s*/, '').trim(); }).filter(function (title) { return title.length > 0; });
                res.json({
                    success: true,
                    titleSuggestions: titles,
                    generatedWith: 'gpt-4o'
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _f.sent();
                console.error('Advanced title generation error:', error_2);
                res.status(500).json({
                    success: false,
                    error: 'Failed to generate advanced titles'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
