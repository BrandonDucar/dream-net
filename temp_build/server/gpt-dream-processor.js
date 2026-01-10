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
exports.gptDreamProcessor = exports.GPTDreamProcessor = void 0;
var GPTDreamProcessor = /** @class */ (function () {
    function GPTDreamProcessor() {
    }
    /**
     * Prepares Lighthouse audit data for GPT processing into dream-style upgrade reports
     */
    GPTDreamProcessor.prototype.prepareLighthouseDataForGPT = function (auditResult) {
        return {
            website: {
                url: auditResult.url,
                timestamp: auditResult.timestamp,
                currentPerformance: {
                    scores: auditResult.scores,
                    keyMetrics: {
                        pageLoadTime: "".concat(Math.round(auditResult.metrics.largestContentfulPaint / 1000 * 10) / 10, "s"),
                        firstContentfulPaint: "".concat(Math.round(auditResult.metrics.firstContentfulPaint / 1000 * 10) / 10, "s"),
                        cumulativeLayoutShift: auditResult.metrics.cumulativeLayoutShift.toFixed(3),
                        speedIndex: "".concat(Math.round(auditResult.metrics.speedIndex / 1000 * 10) / 10, "s"),
                        totalBlockingTime: "".concat(Math.round(auditResult.metrics.totalBlockingTime), "ms")
                    },
                    overallScore: auditResult.summary.overallScore
                }
            },
            improvementOpportunities: {
                performance: auditResult.opportunities.map(function (opp) { return ({
                    action: opp.title,
                    description: opp.description,
                    impact: opp.impact,
                    potentialSavings: opp.savings,
                    category: 'Performance'
                }); }),
                accessibility: auditResult.accessibility.violations.map(function (violation) { return ({
                    issue: violation.description,
                    severity: violation.impact,
                    affectedElements: violation.nodes,
                    category: 'Accessibility'
                }); }),
                seo: auditResult.seo.issues.map(function (issue) { return ({
                    problem: issue.audit,
                    recommendation: issue.recommendation,
                    description: issue.description,
                    category: 'SEO'
                }); }),
                technical: auditResult.diagnostics.map(function (diag) { return ({
                    issue: diag.title,
                    description: diag.description,
                    severity: diag.severity,
                    category: 'Best Practices'
                }); })
            },
            dreamContext: {
                suggestedDreamType: auditResult.summary.dreamUpgradeCategory,
                primaryFocusAreas: auditResult.summary.primaryIssues,
                quickWinOpportunities: auditResult.summary.quickWins,
                readyForTransformation: true
            },
            gptPromptSuggestion: this.generateGPTPrompt(auditResult)
        };
    };
    /**
     * Generates a GPT prompt for converting Lighthouse data into dream-style upgrade reports
     */
    GPTDreamProcessor.prototype.generateGPTPrompt = function (auditResult) {
        return "Transform this Lighthouse audit data into a dream-style website upgrade report. \n\nWebsite: ".concat(auditResult.url, "\nOverall Score: ").concat(auditResult.summary.overallScore, "/100\nDream Category: ").concat(auditResult.summary.dreamUpgradeCategory, "\n\nCreate an inspiring, action-oriented upgrade report that:\n1. Presents the website as a \"dream\" with current state and potential\n2. Frames performance issues as \"evolution opportunities\"\n3. Groups improvements into Vision (strategic), Tool (technical), and Movement (growth) categories\n4. Uses encouraging, aspirational language\n5. Provides clear, actionable steps with expected impact\n\nFocus on the top 3-5 most impactful improvements from this data:\n- Performance issues: ").concat(auditResult.opportunities.slice(0, 3).map(function (o) { return o.title; }).join(', '), "\n- Accessibility concerns: ").concat(auditResult.accessibility.violations.length, " violations found\n- SEO opportunities: ").concat(auditResult.seo.issues.length, " improvements available\n- Technical optimizations: ").concat(auditResult.diagnostics.filter(function (d) { return d.severity === 'error'; }).length, " critical issues\n\nTransform technical metrics into aspirational outcomes that motivate website owners to take action.");
    };
    /**
     * Mock GPT processing function - in real implementation, this would call OpenAI API
     */
    GPTDreamProcessor.prototype.processWithGPT = function (lighthouseData, customPrompt) {
        return __awaiter(this, void 0, void 0, function () {
            var auditResult, dreamId;
            return __generator(this, function (_a) {
                auditResult = lighthouseData;
                dreamId = "dream-upgrade-".concat(Date.now());
                // Generate a structured dream upgrade report based on the data
                return [2 /*return*/, {
                        dreamId: dreamId,
                        websiteUrl: auditResult.website.url,
                        timestamp: new Date().toISOString(),
                        dreamType: auditResult.dreamContext.suggestedDreamType,
                        title: "Website Evolution Dream: ".concat(new URL(auditResult.website.url).hostname),
                        description: "Transform your website into a high-performing, accessible, and SEO-optimized digital experience that delights users and achieves your goals.",
                        currentState: {
                            overallHealth: auditResult.website.currentPerformance.overallScore,
                            keyMetrics: auditResult.website.currentPerformance.keyMetrics,
                            criticalIssues: auditResult.dreamContext.primaryFocusAreas
                        },
                        dreamUpgrades: this.generateUpgradeActions(auditResult),
                        evolutionPath: {
                            quickWins: auditResult.dreamContext.quickWinOpportunities,
                            mediumTermGoals: ['Optimize Core Web Vitals', 'Enhance user experience', 'Improve search rankings'],
                            longTermVision: ['Achieve industry-leading performance', 'Create seamless accessibility', 'Dominate search results']
                        },
                        dreamScore: {
                            current: auditResult.website.currentPerformance.overallScore,
                            potential: Math.min(95, auditResult.website.currentPerformance.overallScore + 25),
                            upgradeValue: 25
                        }
                    }];
            });
        });
    };
    GPTDreamProcessor.prototype.generateUpgradeActions = function (lighthouseData) {
        var _a;
        var upgrades = [];
        // Performance upgrades
        lighthouseData.improvementOpportunities.performance.slice(0, 2).forEach(function (perf) {
            upgrades.push({
                category: 'Performance',
                priority: perf.impact,
                dreamAction: "Optimize ".concat(perf.action.toLowerCase()),
                technicalDetails: perf.description,
                expectedImpact: "Improve load time by ".concat(perf.potentialSavings),
                timeToImplement: perf.impact === 'high' ? '2-4 hours' : '1-2 hours'
            });
        });
        // Accessibility upgrades
        if (lighthouseData.improvementOpportunities.accessibility.length > 0) {
            upgrades.push({
                category: 'Accessibility',
                priority: 'high',
                dreamAction: 'Enhance digital inclusivity',
                technicalDetails: "Address ".concat(lighthouseData.improvementOpportunities.accessibility.length, " accessibility issues"),
                expectedImpact: 'Make website usable for all users, improve SEO',
                timeToImplement: '3-6 hours'
            });
        }
        // SEO upgrades
        if (lighthouseData.improvementOpportunities.seo.length > 0) {
            upgrades.push({
                category: 'SEO',
                priority: 'medium',
                dreamAction: 'Boost search visibility',
                technicalDetails: ((_a = lighthouseData.improvementOpportunities.seo[0]) === null || _a === void 0 ? void 0 : _a.recommendation) || 'Optimize meta tags and content structure',
                expectedImpact: 'Increase organic traffic and search rankings',
                timeToImplement: '2-4 hours'
            });
        }
        return upgrades;
    };
    return GPTDreamProcessor;
}());
exports.GPTDreamProcessor = GPTDreamProcessor;
exports.gptDreamProcessor = new GPTDreamProcessor();
