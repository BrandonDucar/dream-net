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
exports.DevCookboxAgent = void 0;
var DevCookboxAgent = /** @class */ (function () {
    function DevCookboxAgent() {
        this.id = 'dreamdev-cookbox';
        this.name = 'DreamDev Cookbox';
        this.description = 'Dev recipe agent that generates DreamNet-style code scaffolds and file patches';
        this.category = 'utility';
        this.version = '1.0.0';
    }
    DevCookboxAgent.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apiKey, GoogleGenerativeAI, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiKey = process.env.GOOGLE_AI_API_KEY;
                        if (!apiKey) {
                            console.warn('⚠️ GOOGLE_AI_API_KEY not set, Dev Cookbox will be disabled');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('@google/generative-ai'); })];
                    case 2:
                        GoogleGenerativeAI = (_a.sent()).GoogleGenerativeAI;
                        this.genAI = new GoogleGenerativeAI(apiKey);
                        this.model = this.genAI.getGenerativeModel({
                            model: 'gemini-pro',
                            systemInstruction: "You are DreamDev Cookbox: the code generation agent for DreamNet.\nYou generate TypeScript code, API routes, and configuration following DreamNet v13 patterns.\nOutput ONLY valid JSON in the dev_cookbox_output format.",
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 8192,
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Failed to initialize Dev Cookbox:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DevCookboxAgent.prototype.run = function (input, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, result, response, jsonMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.model) {
                            // Return stub data if not initialized
                            return [2 /*return*/, {
                                    summary: 'AI not initialized - cannot generate code',
                                    files: [],
                                    steps: []
                                }];
                        }
                        prompt = "Generate DreamNet v13 code for this dev intent:\n\nIntent: ".concat(input.intent, "\nContext: ").concat(input.contextSummary || 'N/A', "\nTarget Layer: ").concat(input.targetLayer || 'unknown', "\n\nFollow DreamNet v13 patterns:\n- Agent Core: types.ts, registry.ts, executor.ts\n- Agents: implement Agent<TInput, TOutput> interface\n- DreamHub: mini apps that call runAgent()\n- Routes: /api/dreamhub/miniapps, /api/dreamhub/run\n\nOutput ONLY a JSON object with this structure:\n{\n  \"summary\": \"string\",\n  \"files\": [\n    {\n      \"path\": \"server/agents/newAgent.ts\",\n      \"description\": \"string\",\n      \"contents\": \"// TypeScript code here\"\n    }\n  ],\n  \"steps\": [\n    \"1. Create the agent file\",\n    \"2. Register in bootstrap.ts\",\n    \"3. Add mini app entry\"\n  ]\n}");
                        return [4 /*yield*/, this.model.generateContent(prompt)];
                    case 1:
                        result = _a.sent();
                        response = result.response.text();
                        jsonMatch = response.match(/\{[\s\S]*\}/);
                        if (!jsonMatch) {
                            throw new Error('Failed to extract JSON from AI response');
                        }
                        return [2 /*return*/, JSON.parse(jsonMatch[0])];
                }
            });
        });
    };
    return DevCookboxAgent;
}());
exports.DevCookboxAgent = DevCookboxAgent;
