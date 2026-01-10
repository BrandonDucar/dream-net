"use strict";
/**
 * LUCID Agent v1 - Dream Analysis and Validation
 * Performs initial dream structure analysis, clarity assessment, and lucidity detection
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
exports.connectorBotV1 = exports.lucidV1Instance = exports.LucidV1 = void 0;
exports.lucidV1 = lucidV1;
var LucidV1 = /** @class */ (function () {
    function LucidV1() {
        this.version = '1.0.0';
        this.analysisWeights = {
            clarity: 0.25,
            coherence: 0.20,
            symbolism: 0.15,
            emotional_intensity: 0.20,
            narrative_structure: 0.10,
            lucid_elements: 0.10
        };
    }
    LucidV1.prototype.analyzeDream = function (dreamInput) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, content, clarity, coherence, symbolism, emotional_intensity, narrative_structure, lucid_elements, dream_categories, validation_score, processing_time, analysis;
            return __generator(this, function (_a) {
                startTime = Date.now();
                console.log("\uD83C\uDF1F [LUCID-v".concat(this.version, "] Starting dream analysis..."));
                content = dreamInput.content;
                clarity = this.assessClarity(content);
                coherence = this.assessCoherence(content);
                symbolism = this.detectSymbolism(content);
                emotional_intensity = this.assessEmotionalIntensity(content);
                narrative_structure = this.analyzeNarrativeStructure(content);
                lucid_elements = this.detectLucidElements(content);
                dream_categories = this.categorizeDream(content);
                validation_score = this.calculateValidationScore({
                    clarity: clarity,
                    coherence: coherence,
                    symbolism: symbolism,
                    emotional_intensity: emotional_intensity,
                    narrative_structure: narrative_structure,
                    lucid_elements: lucid_elements
                });
                processing_time = (Date.now() - startTime) / 1000;
                analysis = {
                    clarity: clarity,
                    coherence: coherence,
                    symbolism: symbolism,
                    emotional_intensity: emotional_intensity,
                    narrative_structure: narrative_structure,
                    lucid_elements: lucid_elements,
                    processing_time: processing_time,
                    dream_categories: dream_categories,
                    validation_score: validation_score
                };
                console.log("\u2705 [LUCID-v".concat(this.version, "] Analysis complete - Validation: ").concat(validation_score, "%"));
                return [2 /*return*/, analysis];
            });
        });
    };
    LucidV1.prototype.assessClarity = function (content) {
        var score = 60; // Base score
        // Length indicates detail level
        if (content.length > 200)
            score += 15;
        if (content.length > 500)
            score += 10;
        // Descriptive words indicate clarity
        var descriptiveWords = ['vivid', 'clear', 'bright', 'detailed', 'sharp', 'focused'];
        var descriptiveCount = descriptiveWords.reduce(function (count, word) {
            return count + (content.toLowerCase().includes(word) ? 1 : 0);
        }, 0);
        score += descriptiveCount * 3;
        // Sensory details
        var sensoryWords = ['see', 'hear', 'feel', 'smell', 'taste', 'touch'];
        var sensoryCount = sensoryWords.reduce(function (count, word) {
            return count + (content.toLowerCase().includes(word) ? 1 : 0);
        }, 0);
        score += sensoryCount * 2;
        return Math.min(100, score);
    };
    LucidV1.prototype.assessCoherence = function (content) {
        var score = 70; // Base score
        // Sentence structure indicates coherence
        var sentences = content.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; });
        if (sentences.length > 3)
            score += 10;
        // Transition words indicate logical flow
        var transitionWords = ['then', 'next', 'after', 'before', 'while', 'during', 'suddenly'];
        var transitionCount = transitionWords.reduce(function (count, word) {
            return count + (content.toLowerCase().includes(word) ? 1 : 0);
        }, 0);
        score += transitionCount * 3;
        // Inconsistency markers reduce coherence
        var inconsistencyWords = ['confused', 'strange', 'weird', 'impossible', 'nonsense'];
        var inconsistencyCount = inconsistencyWords.reduce(function (count, word) {
            return count + (content.toLowerCase().includes(word) ? 1 : 0);
        }, 0);
        score -= inconsistencyCount * 5;
        return Math.max(30, Math.min(100, score));
    };
    LucidV1.prototype.detectSymbolism = function (content) {
        var score = 50; // Base score
        // Common dream symbols
        var symbols = [
            'water', 'fire', 'flying', 'falling', 'door', 'stairs', 'mirror', 'animal',
            'house', 'car', 'bridge', 'tunnel', 'light', 'dark', 'chase', 'death',
            'birth', 'wedding', 'school', 'test', 'lost', 'found'
        ];
        var symbolCount = symbols.reduce(function (count, symbol) {
            return count + (content.toLowerCase().includes(symbol) ? 1 : 0);
        }, 0);
        score += symbolCount * 4;
        // Metaphorical language
        var metaphorWords = ['like', 'as if', 'seemed', 'appeared', 'transformed', 'became'];
        var metaphorCount = metaphorWords.reduce(function (count, word) {
            return count + (content.toLowerCase().includes(word) ? 1 : 0);
        }, 0);
        score += metaphorCount * 3;
        return Math.min(100, score);
    };
    LucidV1.prototype.assessEmotionalIntensity = function (content) {
        var score = 40; // Base score
        // Emotional words
        var emotions = [
            'afraid', 'scared', 'happy', 'sad', 'angry', 'excited', 'anxious',
            'peaceful', 'confused', 'amazed', 'shocked', 'delighted', 'terrified',
            'joyful', 'overwhelmed', 'calm', 'frustrated', 'content'
        ];
        var emotionCount = emotions.reduce(function (count, emotion) {
            return count + (content.toLowerCase().includes(emotion) ? 1 : 0);
        }, 0);
        score += emotionCount * 5;
        // Intensity indicators
        var intensityWords = ['extremely', 'very', 'incredibly', 'absolutely', 'completely'];
        var intensityCount = intensityWords.reduce(function (count, word) {
            return count + (content.toLowerCase().includes(word) ? 1 : 0);
        }, 0);
        score += intensityCount * 3;
        return Math.min(100, score);
    };
    LucidV1.prototype.analyzeNarrativeStructure = function (content) {
        var sentences = content.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; });
        var avgSentenceLength = content.length / sentences.length;
        if (sentences.length < 3 || avgSentenceLength < 20) {
            return 'simple';
        }
        else if (sentences.length > 8 && avgSentenceLength > 50) {
            return 'complex';
        }
        else if (content.includes('...') || content.includes('--')) {
            return 'fragmented';
        }
        return content.length > 200 ? 'complex' : 'simple';
    };
    LucidV1.prototype.detectLucidElements = function (content) {
        var lucidIndicators = [
            'lucid', 'aware', 'realized', 'knew it was a dream', 'dream sign',
            'reality check', 'conscious', 'control', 'chose to', 'decided to'
        ];
        return lucidIndicators.some(function (indicator) {
            return content.toLowerCase().includes(indicator);
        });
    };
    LucidV1.prototype.categorizeDream = function (content) {
        var categories = [];
        var lowerContent = content.toLowerCase();
        // Adventure themes
        if (lowerContent.includes('journey') || lowerContent.includes('adventure') ||
            lowerContent.includes('explore') || lowerContent.includes('quest')) {
            categories.push('adventure');
        }
        // Transformation themes
        if (lowerContent.includes('change') || lowerContent.includes('transform') ||
            lowerContent.includes('become') || lowerContent.includes('evolve')) {
            categories.push('transformation');
        }
        // Relationship themes
        if (lowerContent.includes('friend') || lowerContent.includes('family') ||
            lowerContent.includes('love') || lowerContent.includes('relationship')) {
            categories.push('relationships');
        }
        // Fear/anxiety themes
        if (lowerContent.includes('chase') || lowerContent.includes('escape') ||
            lowerContent.includes('afraid') || lowerContent.includes('nightmare')) {
            categories.push('fear_anxiety');
        }
        // Spiritual/mystical themes
        if (lowerContent.includes('light') || lowerContent.includes('spirit') ||
            lowerContent.includes('divine') || lowerContent.includes('mystical')) {
            categories.push('spiritual');
        }
        return categories.length > 0 ? categories : ['general'];
    };
    LucidV1.prototype.calculateValidationScore = function (analysis) {
        var clarity = analysis.clarity, coherence = analysis.coherence, symbolism = analysis.symbolism, emotional_intensity = analysis.emotional_intensity, narrative_structure = analysis.narrative_structure, lucid_elements = analysis.lucid_elements;
        var score = 0;
        score += clarity * this.analysisWeights.clarity;
        score += coherence * this.analysisWeights.coherence;
        score += symbolism * this.analysisWeights.symbolism;
        score += emotional_intensity * this.analysisWeights.emotional_intensity;
        // Narrative structure bonus
        var structureBonus = narrative_structure === 'complex' ? 10 :
            narrative_structure === 'simple' ? 5 : 0;
        score += structureBonus * this.analysisWeights.narrative_structure;
        // Lucid elements bonus
        var lucidBonus = lucid_elements ? 15 : 0;
        score += lucidBonus * this.analysisWeights.lucid_elements;
        return Math.round(score);
    };
    LucidV1.prototype.getVersion = function () {
        return this.version;
    };
    LucidV1.prototype.getCapabilities = function () {
        return [
            'dream_clarity_assessment',
            'narrative_coherence_analysis',
            'symbolic_content_detection',
            'emotional_intensity_measurement',
            'lucidity_indicator_recognition',
            'thematic_categorization',
            'validation_scoring'
        ];
    };
    return LucidV1;
}());
exports.LucidV1 = LucidV1;
// Export singleton instance
exports.lucidV1Instance = new LucidV1();
exports.connectorBotV1 = exports.lucidV1Instance;
function lucidV1(input) {
    var currentState = input.currentState, goal = input.goal, lastFailure = input.lastFailure, availableAgents = input.availableAgents;
    // Specific fallback: Database failure
    if (lastFailure === null || lastFailure === void 0 ? void 0 : lastFailure.toLowerCase().includes("db")) {
        return {
            nextAgent: "ROOT",
            instructions: "Rebuild the backend schema and validate DB connection.",
            fallbackOptions: ["LUCID", "CANVAS"]
        };
    }
    // Frontend priority
    if (goal.toLowerCase().includes("frontend") && availableAgents.includes("CANVAS")) {
        return {
            nextAgent: "CANVAS",
            instructions: "Render visual frontend and deploy interface layer.",
            fallbackOptions: ["SEED", "LUCID"]
        };
    }
    // Admin task priority
    if (goal.toLowerCase().includes("admin") && availableAgents.includes("ROOT")) {
        return {
            nextAgent: "ROOT",
            instructions: "Configure admin route, wallet gating, and ENV secrets.",
            fallbackOptions: ["CANVAS", "LUCID"]
        };
    }
    // Wallet/authentication tasks
    if (goal.toLowerCase().includes("wallet") && availableAgents.includes("ECHO")) {
        return {
            nextAgent: "ECHO",
            instructions: "Analyze wallet address and determine trust score for access gating.",
            fallbackOptions: ["ROOT", "LUCID"]
        };
    }
    // Backend/infrastructure tasks
    if (goal.toLowerCase().includes("backend") && availableAgents.includes("ROOT")) {
        return {
            nextAgent: "ROOT",
            instructions: "Set up backend infrastructure, database schema, and API endpoints.",
            fallbackOptions: ["CANVAS", "LUCID"]
        };
    }
    // Visual/UI tasks
    if ((goal.toLowerCase().includes("visual") || goal.toLowerCase().includes("ui")) && availableAgents.includes("CANVAS")) {
        return {
            nextAgent: "CANVAS",
            instructions: "Process visual elements and create UI components.",
            fallbackOptions: ["ROOT", "LUCID"]
        };
    }
    // Catch-all fallback
    return {
        nextAgent: "LUCID",
        instructions: "Analyze current state and determine optimal routing strategy.",
        fallbackOptions: availableAgents.filter(function (agent) { return agent !== "LUCID"; }).slice(0, 2)
    };
}
