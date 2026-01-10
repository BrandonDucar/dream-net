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
var BudgetControlService_1 = require("../services/BudgetControlService");
var IntegrationFlagsService_1 = require("../services/IntegrationFlagsService");
var router = (0, express_1.Router)();
// OpenAI relay endpoint with budget control
router.post('/openai/chat', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var estimatedCost, _a, messages, _b, model, response, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                // Check if OpenAI integration is enabled
                return [4 /*yield*/, IntegrationFlagsService_1.IntegrationFlagsService.requireEnabled('openai')];
            case 1:
                // Check if OpenAI integration is enabled
                _c.sent();
                estimatedCost = 0.01;
                // Check budget before making request
                BudgetControlService_1.BudgetControlService.requireBudget('openai', estimatedCost);
                _a = req.body, messages = _a.messages, _b = _a.model, model = _b === void 0 ? 'gpt-3.5-turbo' : _b;
                if (!messages || !Array.isArray(messages)) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid request: messages array is required'
                        })];
                }
                // Record usage after successful request
                BudgetControlService_1.BudgetControlService.recordUsage('openai', estimatedCost);
                response = {
                    id: "chatcmpl-".concat(Date.now()),
                    object: 'chat.completion',
                    created: Math.floor(Date.now() / 1000),
                    model: model,
                    choices: [{
                            index: 0,
                            message: {
                                role: 'assistant',
                                content: 'This is a simulated OpenAI response for budget control testing. The integration is working and budget limits are being enforced.'
                            },
                            finish_reason: 'stop'
                        }],
                    usage: {
                        prompt_tokens: 50,
                        completion_tokens: 25,
                        total_tokens: 75
                    },
                    cost: estimatedCost
                };
                console.log("\uD83E\uDD16 [OpenAI] Chat completion successful - Cost: $".concat(estimatedCost));
                res.json(response);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error('[OpenAI] Request failed:', error_1.message);
                if (error_1.message.includes('over budget')) {
                    res.status(429).json({
                        error: 'Over budget',
                        message: error_1.message,
                        provider: 'openai',
                        budget_status: BudgetControlService_1.BudgetControlService.getBudgetStatus('openai')
                    });
                }
                else if (error_1.message.includes('disabled')) {
                    res.status(503).json({
                        error: 'Service disabled',
                        message: error_1.message,
                        provider: 'openai'
                    });
                }
                else {
                    res.status(500).json({
                        error: 'Request failed',
                        message: error_1.message
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Koala relay endpoint with kill switch testing
router.post('/koala/generate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var estimatedCost, _a, prompt_1, _b, max_tokens, response, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                // Check if Koala integration is enabled (this will test kill switch)
                return [4 /*yield*/, IntegrationFlagsService_1.IntegrationFlagsService.requireEnabled('koala')];
            case 1:
                // Check if Koala integration is enabled (this will test kill switch)
                _c.sent();
                estimatedCost = 0.005;
                BudgetControlService_1.BudgetControlService.requireBudget('koala', estimatedCost);
                _a = req.body, prompt_1 = _a.prompt, _b = _a.max_tokens, max_tokens = _b === void 0 ? 100 : _b;
                if (!prompt_1) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid request: prompt is required'
                        })];
                }
                // Record usage
                BudgetControlService_1.BudgetControlService.recordUsage('koala', estimatedCost);
                response = {
                    id: "koala-".concat(Date.now()),
                    object: 'text_completion',
                    created: Math.floor(Date.now() / 1000),
                    model: 'koala-13b',
                    choices: [{
                            text: 'This is a simulated Koala response for kill switch testing. Integration is enabled and working.',
                            index: 0,
                            logprobs: null,
                            finish_reason: 'stop'
                        }],
                    usage: {
                        prompt_tokens: prompt_1.split(' ').length,
                        completion_tokens: max_tokens,
                        total_tokens: prompt_1.split(' ').length + max_tokens
                    },
                    cost: estimatedCost
                };
                console.log("\uD83D\uDC28 [Koala] Generation successful - Cost: $".concat(estimatedCost));
                res.json(response);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                console.error('[Koala] Request failed:', error_2.message);
                if (error_2.message.includes('over budget')) {
                    res.status(429).json({
                        error: 'Over budget',
                        message: error_2.message,
                        provider: 'koala',
                        budget_status: BudgetControlService_1.BudgetControlService.getBudgetStatus('koala')
                    });
                }
                else if (error_2.message.includes('disabled')) {
                    // This is the kill switch test - integration disabled
                    res.status(503).json({
                        error: 'Integration disabled',
                        message: 'Koala integration has been disabled via kill switch',
                        provider: 'koala',
                        kill_switch_active: true
                    });
                }
                else {
                    res.status(500).json({
                        error: 'Request failed',
                        message: error_2.message
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Anthropic relay endpoint with budget control
router.post('/anthropic/messages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var estimatedCost, _a, messages, _b, model, response, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, IntegrationFlagsService_1.IntegrationFlagsService.requireEnabled('anthropic')];
            case 1:
                _c.sent();
                estimatedCost = 0.015;
                BudgetControlService_1.BudgetControlService.requireBudget('anthropic', estimatedCost);
                _a = req.body, messages = _a.messages, _b = _a.model, model = _b === void 0 ? 'claude-3-sonnet-20240229' : _b;
                if (!messages || !Array.isArray(messages)) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid request: messages array is required'
                        })];
                }
                BudgetControlService_1.BudgetControlService.recordUsage('anthropic', estimatedCost);
                response = {
                    id: "msg_".concat(Date.now()),
                    type: 'message',
                    role: 'assistant',
                    content: [{
                            type: 'text',
                            text: 'This is a simulated Anthropic response for budget control testing.'
                        }],
                    model: model,
                    stop_reason: 'end_turn',
                    stop_sequence: null,
                    usage: {
                        input_tokens: 50,
                        output_tokens: 20
                    },
                    cost: estimatedCost
                };
                console.log("\uD83E\uDD16 [Anthropic] Message completion successful - Cost: $".concat(estimatedCost));
                res.json(response);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _c.sent();
                console.error('[Anthropic] Request failed:', error_3.message);
                if (error_3.message.includes('over budget')) {
                    res.status(429).json({
                        error: 'Over budget',
                        message: error_3.message,
                        provider: 'anthropic',
                        budget_status: BudgetControlService_1.BudgetControlService.getBudgetStatus('anthropic')
                    });
                }
                else if (error_3.message.includes('disabled')) {
                    res.status(503).json({
                        error: 'Service disabled',
                        message: error_3.message,
                        provider: 'anthropic'
                    });
                }
                else {
                    res.status(500).json({
                        error: 'Request failed',
                        message: error_3.message
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
