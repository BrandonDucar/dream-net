"use strict";
/**
 * ConnectorBot Agent v1 - Intelligent Task Routing and Bot Orchestration
 * Routes tasks and dreams through the multi-bot architecture based on goals and context
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorBotV1 = exports.ConnectorBotV1 = void 0;
var ConnectorBotV1 = /** @class */ (function () {
    function ConnectorBotV1() {
        this.version = '1.0.0';
        this.botCapabilities = {
            'WebsitePrepBot': {
                specialties: ['frontend', 'ui', 'design', 'user_experience'],
                trustRequired: 60,
                complexity: ['simple', 'moderate', 'complex']
            },
            'BackendPrepBot': {
                specialties: ['api', 'database', 'server', 'infrastructure'],
                trustRequired: 70,
                complexity: ['moderate', 'complex']
            },
            'AdminDashboardAgent': {
                specialties: ['admin', 'management', 'analytics', 'oversight'],
                trustRequired: 80,
                complexity: ['complex']
            },
            'DreamIntakeBot': {
                specialties: ['dreams', 'processing', 'analysis', 'intake'],
                trustRequired: 60,
                complexity: ['simple', 'moderate']
            },
            'SocialOpsBot': {
                specialties: ['social', 'community', 'engagement', 'marketing'],
                trustRequired: 75,
                complexity: ['moderate', 'complex']
            },
            'ConnectorBot': {
                specialties: ['routing', 'orchestration', 'coordination', 'meta'],
                trustRequired: 50,
                complexity: ['simple', 'moderate', 'complex']
            }
        };
        this.routingPatterns = [
            {
                triggers: ['dream', 'submit', 'analyze', 'process'],
                preferredBot: 'DreamIntakeBot',
                fallback: ['WebsitePrepBot', 'ConnectorBot']
            },
            {
                triggers: ['website', 'frontend', 'ui', 'design', 'user'],
                preferredBot: 'WebsitePrepBot',
                fallback: ['BackendPrepBot', 'ConnectorBot']
            },
            {
                triggers: ['backend', 'api', 'database', 'server', 'data'],
                preferredBot: 'BackendPrepBot',
                fallback: ['WebsitePrepBot', 'ConnectorBot']
            },
            {
                triggers: ['admin', 'manage', 'dashboard', 'analytics', 'oversight'],
                preferredBot: 'AdminDashboardAgent',
                fallback: ['BackendPrepBot', 'ConnectorBot']
            },
            {
                triggers: ['social', 'community', 'marketing', 'engagement'],
                preferredBot: 'SocialOpsBot',
                fallback: ['WebsitePrepBot', 'ConnectorBot']
            }
        ];
    }
    ConnectorBotV1.prototype.routeTask = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, currentState, goal, _a, availableBots, walletData, complexity, urgency, contentAnalysis, eligibleBots, routingChoice, fallbackChain, estimatedDuration, nextSteps, processing_time, decision;
            return __generator(this, function (_b) {
                startTime = Date.now();
                console.log("\uD83E\uDD16 [CONNECTOR-v".concat(this.version, "] Analyzing routing context..."));
                currentState = context.currentState, goal = context.goal, _a = context.availableBots, availableBots = _a === void 0 ? [] : _a, walletData = context.walletData;
                complexity = this.assessComplexity(context);
                urgency = this.assessUrgency(context);
                contentAnalysis = this.analyzeContent(currentState + ' ' + goal);
                eligibleBots = this.filterBotsByTrust(availableBots, walletData);
                routingChoice = this.selectOptimalBot(contentAnalysis, eligibleBots, complexity, urgency);
                fallbackChain = this.generateFallbackChain(routingChoice.primary, eligibleBots, contentAnalysis);
                estimatedDuration = this.estimateTaskDuration(complexity, routingChoice.primary);
                nextSteps = this.generateNextSteps(routingChoice.primary, context);
                processing_time = (Date.now() - startTime) / 1000;
                decision = {
                    routedTo: routingChoice.primary,
                    reasoning: routingChoice.reasoning,
                    confidence: routingChoice.confidence,
                    nextSteps: nextSteps,
                    fallbackChain: fallbackChain,
                    estimatedDuration: estimatedDuration,
                    processing_time: processing_time
                };
                console.log("\u2705 [CONNECTOR-v".concat(this.version, "] Routed to ").concat(decision.routedTo, " (").concat(decision.confidence, "% confidence)"));
                return [2 /*return*/, decision];
            });
        });
    };
    ConnectorBotV1.prototype.assessComplexity = function (context) {
        var currentState = context.currentState, goal = context.goal;
        var combinedText = (currentState + ' ' + goal).toLowerCase();
        var complexityScore = 0;
        // Simple indicators
        if (combinedText.includes('simple') || combinedText.includes('basic') ||
            combinedText.includes('quick')) {
            complexityScore -= 2;
        }
        // Complex indicators
        var complexWords = ['integrate', 'orchestrate', 'coordinate', 'manage', 'analyze'];
        complexWords.forEach(function (word) {
            if (combinedText.includes(word))
                complexityScore += 1;
        });
        // Multi-step indicators
        if (combinedText.includes('and') || combinedText.includes('then') ||
            combinedText.includes('after')) {
            complexityScore += 1;
        }
        // Technical depth indicators
        var technicalWords = ['database', 'api', 'architecture', 'system', 'infrastructure'];
        technicalWords.forEach(function (word) {
            if (combinedText.includes(word))
                complexityScore += 1;
        });
        if (complexityScore >= 3)
            return 'complex';
        if (complexityScore >= 1)
            return 'moderate';
        return 'simple';
    };
    ConnectorBotV1.prototype.assessUrgency = function (context) {
        var currentState = context.currentState, goal = context.goal;
        var combinedText = (currentState + ' ' + goal).toLowerCase();
        // High urgency indicators
        if (combinedText.includes('urgent') || combinedText.includes('immediate') ||
            combinedText.includes('asap') || combinedText.includes('critical')) {
            return 'high';
        }
        // Medium urgency indicators
        if (combinedText.includes('soon') || combinedText.includes('priority') ||
            combinedText.includes('important')) {
            return 'medium';
        }
        return 'low';
    };
    ConnectorBotV1.prototype.analyzeContent = function (content) {
        var lowerContent = content.toLowerCase();
        var matchedPatterns = [];
        this.routingPatterns.forEach(function (pattern) {
            var matches = pattern.triggers.filter(function (trigger) {
                return lowerContent.includes(trigger);
            }).length;
            if (matches > 0) {
                matchedPatterns.push({
                    pattern: pattern,
                    score: matches,
                    confidence: (matches / pattern.triggers.length) * 100
                });
            }
        });
        // Sort by score and confidence
        matchedPatterns.sort(function (a, b) { return b.score - a.score || b.confidence - a.confidence; });
        return {
            primaryMatch: matchedPatterns[0] || null,
            allMatches: matchedPatterns,
            contentLength: content.length,
            wordCount: content.split(' ').length
        };
    };
    ConnectorBotV1.prototype.filterBotsByTrust = function (availableBots, walletData) {
        var _this = this;
        if (!walletData || !walletData.trustScore) {
            return availableBots;
        }
        var trustScore = walletData.trustScore;
        return availableBots.filter(function (bot) {
            var botInfo = _this.botCapabilities[bot];
            return botInfo && trustScore >= botInfo.trustRequired;
        });
    };
    ConnectorBotV1.prototype.selectOptimalBot = function (contentAnalysis, eligibleBots, complexity, urgency) {
        var _this = this;
        // If we have a clear content match
        if (contentAnalysis.primaryMatch) {
            var preferredBot = contentAnalysis.primaryMatch.pattern.preferredBot;
            if (eligibleBots.includes(preferredBot)) {
                var botInfo = this.botCapabilities[preferredBot];
                if (botInfo && botInfo.complexity.includes(complexity)) {
                    return {
                        primary: preferredBot,
                        reasoning: "Content analysis matched ".concat(contentAnalysis.primaryMatch.pattern.triggers.join(', '), " patterns"),
                        confidence: Math.min(95, contentAnalysis.primaryMatch.confidence + 20)
                    };
                }
            }
        }
        // Fallback to complexity-based selection
        var complexityCompatibleBots = eligibleBots.filter(function (bot) {
            var botInfo = _this.botCapabilities[bot];
            return botInfo && botInfo.complexity.includes(complexity);
        });
        if (complexityCompatibleBots.length > 0) {
            // For high urgency, prefer specialized bots
            if (urgency === 'high' && complexityCompatibleBots.includes('AdminDashboardAgent')) {
                return {
                    primary: 'AdminDashboardAgent',
                    reasoning: 'High urgency task routed to admin specialist',
                    confidence: 80
                };
            }
            // Default to first available complexity-compatible bot
            var selectedBot = complexityCompatibleBots[0];
            return {
                primary: selectedBot,
                reasoning: "Selected based on complexity compatibility (".concat(complexity, ")"),
                confidence: 70
            };
        }
        // Ultimate fallback to ConnectorBot
        return {
            primary: 'ConnectorBot',
            reasoning: 'No specialized bot available, routing to ConnectorBot for coordination',
            confidence: 50
        };
    };
    ConnectorBotV1.prototype.generateFallbackChain = function (primaryBot, eligibleBots, contentAnalysis) {
        var fallbackChain = [];
        // Add pattern-based fallbacks
        if (contentAnalysis.primaryMatch) {
            contentAnalysis.primaryMatch.pattern.fallback.forEach(function (bot) {
                if (eligibleBots.includes(bot) && bot !== primaryBot) {
                    fallbackChain.push(bot);
                }
            });
        }
        // Add general fallbacks
        var generalFallbacks = ['WebsitePrepBot', 'BackendPrepBot', 'ConnectorBot'];
        generalFallbacks.forEach(function (bot) {
            if (eligibleBots.includes(bot) &&
                bot !== primaryBot &&
                !fallbackChain.includes(bot)) {
                fallbackChain.push(bot);
            }
        });
        return fallbackChain.slice(0, 3); // Limit to 3 fallbacks
    };
    ConnectorBotV1.prototype.estimateTaskDuration = function (complexity, botType) {
        var baseDurations = {
            'simple': { min: 5, max: 15 },
            'moderate': { min: 15, max: 45 },
            'complex': { min: 30, max: 120 }
        };
        var botModifiers = {
            'AdminDashboardAgent': 1.2, // Slower but more thorough
            'BackendPrepBot': 1.1, // Technical complexity
            'WebsitePrepBot': 0.9, // Frontend generally faster
            'DreamIntakeBot': 0.8, // Streamlined process
            'SocialOpsBot': 1.0, // Standard
            'ConnectorBot': 0.7 // Coordination is quick
        };
        var duration = baseDurations[complexity];
        var modifier = botModifiers[botType] || 1.0;
        var estimatedMin = Math.round(duration.min * modifier);
        var estimatedMax = Math.round(duration.max * modifier);
        return "".concat(estimatedMin, "-").concat(estimatedMax, " minutes");
    };
    ConnectorBotV1.prototype.generateNextSteps = function (botType, context) {
        var baseSteps = [
            "Initialize ".concat(botType, " for task execution"),
            'Analyze task requirements and constraints',
            'Execute primary task objectives'
        ];
        var botSpecificSteps = {
            'WebsitePrepBot': [
                'Review UI/UX requirements',
                'Prepare frontend components',
                'Test user interface elements'
            ],
            'BackendPrepBot': [
                'Analyze data requirements',
                'Set up API endpoints',
                'Configure database connections'
            ],
            'AdminDashboardAgent': [
                'Review admin privileges',
                'Set up monitoring systems',
                'Configure management interfaces'
            ],
            'DreamIntakeBot': [
                'Validate dream content',
                'Process through analysis pipeline',
                'Route to appropriate core spawning'
            ],
            'SocialOpsBot': [
                'Analyze community engagement',
                'Prepare social content',
                'Schedule community interactions'
            ],
            'ConnectorBot': [
                'Coordinate with other bots',
                'Monitor task progress',
                'Handle fallback routing if needed'
            ]
        };
        var specificSteps = botSpecificSteps[botType] || [];
        return __spreadArray(__spreadArray([], baseSteps, true), specificSteps, true);
    };
    ConnectorBotV1.prototype.getVersion = function () {
        return this.version;
    };
    ConnectorBotV1.prototype.getCapabilities = function () {
        return [
            'intelligent_task_routing',
            'bot_orchestration',
            'trust_level_filtering',
            'complexity_assessment',
            'urgency_evaluation',
            'fallback_chain_generation',
            'duration_estimation',
            'next_steps_planning'
        ];
    };
    ConnectorBotV1.prototype.getBotCapabilities = function () {
        return this.botCapabilities;
    };
    ConnectorBotV1.prototype.getRoutingPatterns = function () {
        return this.routingPatterns;
    };
    return ConnectorBotV1;
}());
exports.ConnectorBotV1 = ConnectorBotV1;
// Export singleton instance
exports.connectorBotV1 = new ConnectorBotV1();
