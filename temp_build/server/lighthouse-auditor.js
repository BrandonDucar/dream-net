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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.lighthouseAuditor = exports.LighthouseAuditor = void 0;
var lighthouse_1 = require("lighthouse");
var chromeLauncher = require("chrome-launcher");
var spine_link_1 = require("./core/spine-link");
var LighthouseAuditor = /** @class */ (function () {
    function LighthouseAuditor() {
    }
    /**
     * Audit a website using the Spine Browser Agent Wrapper for governance.
     */
    LighthouseAuditor.prototype.auditWebsite = function (url_1) {
        return __awaiter(this, arguments, void 0, function (url, callerId, missionId) {
            var correlationId, timestamp;
            if (callerId === void 0) { callerId = 'unknown'; }
            return __generator(this, function (_a) {
                console.log("\uD83D\uDD0D Requesting governed audit for: ".concat(url));
                correlationId = crypto.randomUUID();
                timestamp = Date.now();
                // 3. Announce Success via Spine
                spine_link_1.spine.bus.publish(spine_link_1.spine.bus.createEnvelope('Browser.AuditCompleted', 'LighthouseAuditor', {
                    url: url,
                    overallScore: result.summary.overallScore,
                    durationMs: Date.now() - timestamp
                }, {
                    eventId: crypto.randomUUID(),
                    correlationId: correlationId,
                    timestamp: Date.now(),
                    actor: { callerId: callerId, tierId: 'PRO' },
                    severity: 'low'
                }));
                return [2 /*return*/, result];
            });
        });
    };
    LighthouseAuditor.prototype.catch = function (error) {
        // 4. Announce Failure via Spine
        spine_link_1.spine.bus.publish(spine_link_1.spine.bus.createEnvelope('Browser.AuditFailed', 'LighthouseAuditor', { url: url, error: error.message }, {
            eventId: crypto.randomUUID(),
            correlationId: correlationId,
            timestamp: Date.now(),
            actor: { callerId: callerId, tierId: 'PRO' },
            severity: 'medium'
        }));
        throw error;
    };
    return LighthouseAuditor;
}());
exports.LighthouseAuditor = LighthouseAuditor;
async;
executeLighthouseRun(url, string);
Promise < LighthouseAuditResult > {
    // Validate URL
    try: {
        new: URL(url)
    },
    catch: function (error) {
        throw new Error("Invalid URL provided: ".concat(url));
    },
    let: let,
    chrome: chrome,
    try: {
        // Launch Chrome
        chrome: chrome,
        // Run Lighthouse audit
        const: options = {
            logLevel: 'info',
            output: 'json',
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
            port: chrome.port,
        },
        console: console,
        : .log("\u26A1 Running Lighthouse audit on port ".concat(chrome.port, "...")),
        const: runnerResult = await (0, lighthouse_1.default)(url, options),
        if: function (, runnerResult) { }
    } || !runnerResult.report
};
{
    throw new Error('Lighthouse audit failed to generate a report');
}
var report = JSON.parse(runnerResult.report);
console.log("\u2705 Lighthouse audit completed successfully");
return this.processLighthouseReport(url, report);
try { }
catch (error) {
    console.error("\u274C Lighthouse audit failed:", error);
    throw new Error("Lighthouse audit failed: ".concat(error.message));
}
finally {
    if (chrome) {
        await chrome.kill();
        console.log("\uD83D\uDD04 Chrome instance terminated");
    }
}
processLighthouseReport(url, string, report, any);
LighthouseAuditResult;
{
    var categories = report.categories;
    var audits = report.audits;
    // Extract scores (convert to 0-100 scale)
    var scores = {
        performance: Math.round((((_a = categories.performance) === null || _a === void 0 ? void 0 : _a.score) || 0) * 100),
        accessibility: Math.round((((_b = categories.accessibility) === null || _b === void 0 ? void 0 : _b.score) || 0) * 100),
        bestPractices: Math.round((((_c = categories['best-practices']) === null || _c === void 0 ? void 0 : _c.score) || 0) * 100),
        seo: Math.round((((_d = categories.seo) === null || _d === void 0 ? void 0 : _d.score) || 0) * 100),
    };
    // Extract key metrics
    var metrics = {
        firstContentfulPaint: ((_e = audits['first-contentful-paint']) === null || _e === void 0 ? void 0 : _e.numericValue) || 0,
        largestContentfulPaint: ((_f = audits['largest-contentful-paint']) === null || _f === void 0 ? void 0 : _f.numericValue) || 0,
        cumulativeLayoutShift: ((_g = audits['cumulative-layout-shift']) === null || _g === void 0 ? void 0 : _g.numericValue) || 0,
        speedIndex: ((_h = audits['speed-index']) === null || _h === void 0 ? void 0 : _h.numericValue) || 0,
        totalBlockingTime: ((_j = audits['total-blocking-time']) === null || _j === void 0 ? void 0 : _j.numericValue) || 0,
    };
    // Process opportunities (performance improvements)
    var opportunities = this.extractOpportunities(audits);
    // Process diagnostics (general issues)
    var diagnostics = this.extractDiagnostics(audits);
    // Process accessibility violations
    var accessibility = this.extractAccessibilityData(audits);
    // Process SEO issues
    var seo = this.extractSEOData(audits);
    // Calculate overall score and categorize for dream upgrade
    var overallScore = Math.round((scores.performance + scores.accessibility + scores.bestPractices + scores.seo) / 4);
    var summary = this.generateSummary(scores, opportunities, diagnostics, overallScore);
    return {
        url: url,
        timestamp: new Date().toISOString(),
        scores: scores,
        metrics: metrics,
        opportunities: opportunities,
        diagnostics: diagnostics,
        accessibility: accessibility,
        seo: seo,
        summary: summary
    };
}
extractOpportunities(audits, any);
Array < { id: string, title: string, description: string, impact: 'high' | 'medium' | 'low', savings: string } > {
    const: opportunityIds = [
        'unused-css-rules', 'unused-javascript', 'modern-image-formats',
        'offscreen-images', 'render-blocking-resources', 'unminified-css',
        'unminified-javascript', 'efficient-animated-content', 'duplicated-javascript'
    ],
    return: opportunityIds
        .map(function (id) {
        var _a, _b, _c, _d;
        var audit = audits[id];
        if (!audit || audit.score === 1)
            return null;
        var savings = ((_a = audit.details) === null || _a === void 0 ? void 0 : _a.overallSavingsMs)
            ? "".concat(Math.round(audit.details.overallSavingsMs), "ms")
            : ((_b = audit.details) === null || _b === void 0 ? void 0 : _b.overallSavingsBytes)
                ? "".concat(Math.round(audit.details.overallSavingsBytes / 1024), "KB")
                : 'Unknown';
        var impact = ((_c = audit.details) === null || _c === void 0 ? void 0 : _c.overallSavingsMs) > 1000 ? 'high'
            : ((_d = audit.details) === null || _d === void 0 ? void 0 : _d.overallSavingsMs) > 500 ? 'medium' : 'low';
        return {
            id: id,
            title: audit.title,
            description: audit.description,
            impact: impact,
            savings: savings
        };
    })
        .filter(Boolean)
};
extractDiagnostics(audits, any);
Array < { id: string, title: string, description: string, severity: 'error' | 'warning' | 'info' } > {
    const: diagnosticIds = [
        'dom-size', 'critical-request-chains', 'mainthread-work-breakdown',
        'bootup-time', 'uses-long-cache-ttl', 'total-byte-weight'
    ],
    return: diagnosticIds
        .map(function (id) {
        var audit = audits[id];
        if (!audit)
            return null;
        var severity = audit.score === 0 ? 'error'
            : audit.score < 0.5 ? 'warning' : 'info';
        return {
            id: id,
            title: audit.title,
            description: audit.description,
            severity: severity
        };
    })
        .filter(Boolean)
};
extractAccessibilityData(audits, any);
{
    var a11yAudits = Object.values(audits).filter(function (audit) {
        return audit.id && audit.id.includes('accessibility') ||
            ['color-contrast', 'image-alt', 'link-text', 'heading-order'].includes(audit.id);
    });
    var violations = a11yAudits
        .filter(function (audit) { return audit.score !== null && audit.score < 1; })
        .map(function (audit) {
        var _a, _b;
        return ({
            rule: audit.id,
            description: audit.title,
            impact: audit.score === 0 ? 'critical' :
                audit.score < 0.5 ? 'serious' :
                    audit.score < 0.8 ? 'moderate' : 'minor',
            nodes: ((_b = (_a = audit.details) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) || 1
        });
    });
    return {
        violations: violations,
        passedAudits: a11yAudits.filter(function (audit) { return audit.score === 1; }).length,
        totalAudits: a11yAudits.length
    };
}
extractSEOData(audits, any);
{
    var seoAudits = [
        'document-title', 'meta-description', 'http-status-code',
        'link-text', 'is-crawlable', 'hreflang', 'canonical'
    ];
    var issues = seoAudits
        .map(function (id) {
        var audit = audits[id];
        if (!audit || audit.score === 1)
            return null;
        return {
            audit: audit.title,
            description: audit.description,
            recommendation: _this.getSEORecommendation(id),
            passedChecks: 0, // Placeholder
            totalChecks: 1 // Placeholder
        };
    })
        .filter(Boolean);
    return {
        issues: issues,
        passedChecks: seoAudits.filter(function (id) { var _a; return ((_a = audits[id]) === null || _a === void 0 ? void 0 : _a.score) === 1; }).length,
        totalChecks: seoAudits.length
    };
}
getSEORecommendation(auditId, string);
string;
{
    var recommendations = {
        'document-title': 'Add a descriptive, unique title tag to each page',
        'meta-description': 'Write compelling meta descriptions for better click-through rates',
        'link-text': 'Use descriptive anchor text instead of generic phrases like "click here"',
        'is-crawlable': 'Ensure pages are crawlable by removing blocking robots.txt rules',
        'hreflang': 'Add hreflang tags for international SEO if serving multiple languages',
        'canonical': 'Add canonical URLs to prevent duplicate content issues'
    };
    return recommendations[auditId] || 'Review and optimize this SEO aspect';
}
generateSummary(scores, any, opportunities, any[], diagnostics, any[], overallScore, number);
{
    var primaryIssues = [];
    var quickWins_1 = [];
    // Identify primary issues
    if (scores.performance < 60)
        primaryIssues.push('Performance optimization needed');
    if (scores.accessibility < 80)
        primaryIssues.push('Accessibility improvements required');
    if (scores.seo < 80)
        primaryIssues.push('SEO enhancements needed');
    if (scores.bestPractices < 80)
        primaryIssues.push('Best practices implementation');
    // Identify quick wins
    opportunities.slice(0, 3).forEach(function (opp) {
        if (opp.impact === 'high') {
            quickWins_1.push(opp.title);
        }
    });
    // Determine dream upgrade category based on primary issues
    var dreamUpgradeCategory = void 0;
    if (scores.performance < 50 || scores.accessibility < 50) {
        dreamUpgradeCategory = 'Tool'; // Technical improvements needed
    }
    else if (scores.seo < 60) {
        dreamUpgradeCategory = 'Movement'; // Growth and visibility
    }
    else {
        dreamUpgradeCategory = 'Vision'; // Strategic enhancements
    }
    return {
        overallScore: overallScore,
        primaryIssues: primaryIssues,
        quickWins: quickWins_1,
        dreamUpgradeCategory: dreamUpgradeCategory
    };
}
exports.lighthouseAuditor = new LighthouseAuditor();
