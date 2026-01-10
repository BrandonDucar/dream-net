"use strict";
/**
 * Task Connector System - Routes development tasks to specialized bots
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskConnector = void 0;
exports.routeDreamNetworkTask = routeDreamNetworkTask;
var TaskConnector = /** @class */ (function () {
    function TaskConnector() {
    }
    TaskConnector.route = function (input) {
        // First try the enhanced connector logic
        var enhancedResult = this.connectorBotV1(input);
        if (enhancedResult.nextBot !== 'ConnectorBot') {
            return enhancedResult;
        }
        // Fall back to original algorithm if enhanced logic returns ConnectorBot
        var currentState = input.currentState, goal = input.goal, lastFailure = input.lastFailure, availableBots = input.availableBots;
        // Analyze goal to determine primary bot
        var primaryBot = this.selectPrimaryBot(goal, availableBots);
        // Generate specific instructions
        var instructions = this.generateInstructions(currentState, goal, primaryBot);
        // Create fallback chain
        var fallbackOptions = this.createFallbackChain(primaryBot, availableBots, lastFailure);
        return {
            nextBot: primaryBot,
            instructions: instructions,
            fallbackOptions: fallbackOptions
        };
    };
    // Enhanced connector logic with specific fallback handling
    TaskConnector.connectorBotV1 = function (input) {
        var currentState = input.currentState, goal = input.goal, lastFailure = input.lastFailure, availableBots = input.availableBots;
        if (lastFailure === null || lastFailure === void 0 ? void 0 : lastFailure.includes("DB")) {
            return {
                nextBot: "BackendPrepBot",
                instructions: "Repair the database schema and reconfigure connection settings.",
                fallbackOptions: ["ConnectorBot", "AdminDashboardAgent"]
            };
        }
        if (goal.includes("frontend") && availableBots.includes("WebsitePrepBot")) {
            return {
                nextBot: "WebsitePrepBot",
                instructions: "Scaffold and deploy frontend for current Dream Core.",
                fallbackOptions: ["DreamIntakeBot", "ConnectorBot"]
            };
        }
        if (goal.includes("admin") && availableBots.includes("AdminDashboardAgent")) {
            return {
                nextBot: "AdminDashboardAgent",
                instructions: "Set up wallet-based admin interface and secret key handling.",
                fallbackOptions: ["BackendPrepBot", "ConnectorBot"]
            };
        }
        return {
            nextBot: "ConnectorBot",
            instructions: "Unable to determine next step. Ask user for more detail or reattempt with different fallback.",
            fallbackOptions: ["WebsitePrepBot", "BackendPrepBot"]
        };
    };
    TaskConnector.selectPrimaryBot = function (goal, availableBots) {
        var _this = this;
        var goalLower = goal.toLowerCase();
        // Score each bot based on goal keywords
        var scores = availableBots.map(function (bot) {
            if (!_this.botCapabilities[bot]) {
                return { bot: bot, score: 0 };
            }
            var capabilities = _this.botCapabilities[bot];
            var score = capabilities.reduce(function (acc, capability) {
                return acc + (goalLower.includes(capability) ? 1 : 0);
            }, 0);
            return { bot: bot, score: score };
        });
        // Return bot with highest score
        var bestBot = scores.reduce(function (best, current) {
            return current.score > best.score ? current : best;
        });
        return bestBot.bot;
    };
    TaskConnector.generateInstructions = function (currentState, goal, selectedBot) {
        var context = "Current state: ".concat(currentState);
        var objective = "Goal: ".concat(goal);
        switch (selectedBot) {
            case 'WebsitePrepBot':
                return "".concat(context, "\n").concat(objective, "\n\nImplement frontend components and user interface elements. Focus on React components, styling, and user interactions. Ensure responsive design and proper state management.");
            case 'BackendPrepBot':
                return "".concat(context, "\n").concat(objective, "\n\nImplement backend API endpoints, database operations, and server logic. Set up proper authentication, data validation, and error handling. Ensure data persistence and API reliability.");
            case 'SocialOpsBot':
                return "".concat(context, "\n").concat(objective, "\n\nImplement social features, notifications, and external integrations. Set up webhooks, user engagement systems, and community features. Focus on real-time updates and user communication.");
            case 'AdminDashboardAgent':
                return "".concat(context, "\n").concat(objective, "\n\nImplement admin dashboard with wallet-based authentication and secure key management. Focus on admin controls, user management, and security features.");
            case 'DreamIntakeBot':
                return "".concat(context, "\n").concat(objective, "\n\nImplement dream submission and intake workflow. Focus on content validation, user onboarding, and dream processing pipelines.");
            case 'ConnectorBot':
                return "".concat(context, "\n").concat(objective, "\n\nCoordinate task routing and workflow management. Analyze current state and determine next steps for project progression.");
            default:
                return "".concat(context, "\n").concat(objective, "\n\nImplement the requested functionality using appropriate development practices.");
        }
    };
    TaskConnector.createFallbackChain = function (primaryBot, availableBots, lastFailure) {
        var fallbacks = availableBots.filter(function (bot) { return bot !== primaryBot; });
        // If there was a last failure, deprioritize that bot
        if (lastFailure) {
            return fallbacks.filter(function (bot) { return bot !== lastFailure; }).concat(fallbacks.filter(function (bot) { return bot === lastFailure; }));
        }
        return fallbacks;
    };
    TaskConnector.botCapabilities = {
        WebsitePrepBot: [
            'frontend development',
            'ui components',
            'react implementation',
            'user interface',
            'styling',
            'routing',
            'forms'
        ],
        BackendPrepBot: [
            'api development',
            'database setup',
            'authentication',
            'data persistence',
            'server logic',
            'endpoints',
            'middleware'
        ],
        SocialOpsBot: [
            'social media integration',
            'notifications',
            'webhooks',
            'external apis',
            'user engagement',
            'community features'
        ],
        AdminDashboardAgent: [
            'admin interface',
            'wallet authentication',
            'secret key handling',
            'admin dashboard',
            'user management',
            'security'
        ],
        DreamIntakeBot: [
            'dream submission',
            'dream processing',
            'content validation',
            'intake workflows',
            'user onboarding'
        ],
        ConnectorBot: [
            'task routing',
            'workflow coordination',
            'fallback handling',
            'system orchestration'
        ]
    };
    // Common routing scenarios for Dream Network project
    TaskConnector.dreamNetworkRoutes = {
        'garden_feed_loaded': {
            'save_dreams': function () { return ({
                nextBot: 'BackendPrepBot',
                instructions: 'Implement dream save functionality with database persistence. Create POST endpoint for dream submission and update storage layer.',
                fallbackOptions: ['WebsitePrepBot', 'SocialOpsBot']
            }); },
            'improve_ui': function () { return ({
                nextBot: 'WebsitePrepBot',
                instructions: 'Enhance dream gallery UI with better styling, animations, and user interactions. Implement dream filtering and search.',
                fallbackOptions: ['BackendPrepBot', 'SocialOpsBot']
            }); },
            'add_notifications': function () { return ({
                nextBot: 'SocialOpsBot',
                instructions: 'Implement real-time notifications for dream approvals, cocoon updates, and contributor activities.',
                fallbackOptions: ['BackendPrepBot', 'WebsitePrepBot']
            }); }
        }
    };
    return TaskConnector;
}());
exports.TaskConnector = TaskConnector;
// Example usage for Dream Network project
function routeDreamNetworkTask(currentState, goal) {
    var input = {
        currentState: currentState,
        goal: goal,
        availableBots: ['WebsitePrepBot', 'BackendPrepBot', 'SocialOpsBot']
    };
    return TaskConnector.route(input);
}
