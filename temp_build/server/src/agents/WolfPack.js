"use strict";
/**
 * Wolf Pack Funding Hunter
 *
 * Coordinated funding hunt agent that:
 * - Discovers grant opportunities (Base, OP, etc.)
 * - Tracks application status
 * - Automates outreach and follow-ups
 * - Manages funding pipeline
 * - Can be used as paid feature for users
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
exports.wolfPack = void 0;
var node_crypto_1 = require("node:crypto");
var WolfPackFundingHunter = /** @class */ (function () {
    function WolfPackFundingHunter() {
        this.hunts = new Map();
        this.opportunities = new Map();
        this.templates = [];
        this.initializeTemplates();
        this.startDiscoveryLoop();
    }
    /**
     * Initialize outreach templates for different funding sources
     */
    WolfPackFundingHunter.prototype.initializeTemplates = function () {
        this.templates = [
            {
                id: "base-builder-grant",
                name: "Base Builder Grant Application",
                source: "base",
                subject: "Base Builder Grant Application - DreamNet",
                body: "Hello Base Team,\n\nI'm reaching out regarding the Base Builder Grant program. DreamNet is building a living mesh of autonomous agents and mini-apps on Base, and we believe we're a strong fit for your grant program.\n\n**Project Overview:**\nDreamNet is a decentralized platform where dreams evolve into autonomous products. We're deploying mini-apps on Base including:\n- DREAM Rewards Hub (live)\n- Creator Subscriptions (live)\n- Dream Social Feed (live)\n- Dream Contributions (live)\n\n**Why Base:**\n- We're committed to Base as our settlement layer\n- Our DeployKeeper agent automates Base deployments\n- Revenue routing flows through Base contracts\n- We're building composable mini-apps that enhance Base ecosystem\n\n**Grant Request:**\nWe're seeking {{amount}} to accelerate development of:\n- Additional mini-apps\n- Agent system improvements\n- Base-native integrations\n- Community growth initiatives\n\n**Metrics:**\n- {{metrics}}\n\nLooking forward to discussing how DreamNet can contribute to the Base ecosystem.\n\nBest,\nDreamNet Team",
                variables: ["amount", "metrics"],
            },
            {
                id: "op-retro-funding",
                name: "Optimism Retroactive Funding",
                source: "optimism",
                subject: "Retroactive Public Goods Funding - DreamNet",
                body: "Hello Optimism Team,\n\nDreamNet is applying for Retroactive Public Goods Funding. We've built open-source infrastructure that benefits the entire ecosystem.\n\n**What We've Built:**\n- Open-source agent orchestration system\n- Base mini-app framework\n- Decentralized dream evolution platform\n- Public goods tooling\n\n**Impact:**\n{{impact}}\n\n**Request:**\n{{amount}} in retroactive funding for our public goods contributions.\n\nThank you for considering DreamNet.\n\nBest,\nDreamNet Team",
                variables: ["impact", "amount"],
            },
        ];
    };
    /**
     * Start automated discovery loop
     */
    WolfPackFundingHunter.prototype.startDiscoveryLoop = function () {
        var _this = this;
        // Run discovery every 6 hours (more aggressive for active hunting)
        setInterval(function () {
            _this.discoverOpportunities().catch(function (err) {
                console.error("[Wolf Pack] Discovery error:", err);
            });
        }, 6 * 60 * 60 * 1000); // 6 hours
        // Initial discovery - START HUNTING NOW
        console.log("🐺 [Wolf Pack] Starting hunt...");
        this.discoverOpportunities().catch(function (err) {
            console.error("[Wolf Pack] Initial discovery error:", err);
        });
    };
    /**
     * Discover funding opportunities
     */
    WolfPackFundingHunter.prototype.discoverOpportunities = function () {
        return __awaiter(this, void 0, void 0, function () {
            var discovered, _i, discovered_1, opp;
            return __generator(this, function (_a) {
                discovered = [];
                // Base Builder Grants
                discovered.push({
                    id: (0, node_crypto_1.randomUUID)(),
                    source: "base",
                    name: "Base Builder Grant",
                    description: "Retroactive grants for builders on Base (1-5 ETH)",
                    url: "https://base.org/ecosystem/grants",
                    amount: { min: 1, max: 5, currency: "ETH" },
                    requirements: [
                        "Building on Base",
                        "Active project with users",
                        "Clear roadmap",
                    ],
                    status: "discovered",
                    discoveredAt: new Date().toISOString(),
                    tags: ["base", "builder", "retroactive"],
                    priority: "high",
                });
                // Optimism Retroactive Funding
                discovered.push({
                    id: (0, node_crypto_1.randomUUID)(),
                    source: "optimism",
                    name: "Optimism Retroactive Public Goods Funding",
                    description: "Retroactive funding for public goods contributions",
                    url: "https://optimism.io/retropgf",
                    amount: { min: 1, max: 10, currency: "OP" },
                    requirements: [
                        "Public goods contribution",
                        "Open source",
                        "Ecosystem benefit",
                    ],
                    status: "discovered",
                    discoveredAt: new Date().toISOString(),
                    tags: ["optimism", "retroactive", "public-goods"],
                    priority: "medium",
                });
                // Store discovered opportunities
                for (_i = 0, discovered_1 = discovered; _i < discovered_1.length; _i++) {
                    opp = discovered_1[_i];
                    this.opportunities.set(opp.id, opp);
                }
                console.log("[Wolf Pack] Discovered ".concat(discovered.length, " funding opportunities"));
                return [2 /*return*/, discovered];
            });
        });
    };
    /**
     * Create a new funding hunt
     */
    WolfPackFundingHunter.prototype.createHunt = function (targetAmount, targetSources, userId) {
        var hunt = {
            id: (0, node_crypto_1.randomUUID)(),
            userId: userId,
            targetAmount: targetAmount,
            targetSources: targetSources,
            status: "active",
            opportunities: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.hunts.set(hunt.id, hunt);
        return hunt;
    };
    /**
     * Add opportunity to hunt
     */
    WolfPackFundingHunter.prototype.addOpportunityToHunt = function (huntId, opportunityId) {
        var hunt = this.hunts.get(huntId);
        var opp = this.opportunities.get(opportunityId);
        if (!hunt || !opp)
            return;
        if (!hunt.opportunities.find(function (o) { return o.id === opportunityId; })) {
            hunt.opportunities.push(opp);
            hunt.updatedAt = new Date().toISOString();
        }
    };
    /**
     * Update opportunity status
     */
    WolfPackFundingHunter.prototype.updateOpportunityStatus = function (opportunityId, status, notes) {
        var opp = this.opportunities.get(opportunityId);
        if (!opp)
            return;
        opp.status = status;
        if (status === "applied") {
            opp.appliedAt = new Date().toISOString();
        }
        if (notes) {
            opp.notes = notes;
        }
    };
    /**
     * Generate outreach message
     */
    WolfPackFundingHunter.prototype.generateOutreach = function (opportunityId, templateId, variables) {
        var opp = this.opportunities.get(opportunityId);
        var template = this.templates.find(function (t) { return t.id === templateId; });
        if (!opp || !template)
            return null;
        var subject = template.subject;
        var body = template.body;
        // Replace variables
        for (var _i = 0, _a = Object.entries(variables); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            subject = subject.replace("{{".concat(key, "}}"), value);
            body = body.replace("{{".concat(key, "}}"), value);
        }
        return { subject: subject, body: body };
    };
    /**
     * Get hunt by ID
     */
    WolfPackFundingHunter.prototype.getHunt = function (huntId) {
        return this.hunts.get(huntId);
    };
    /**
     * Get all hunts (filtered by userId if provided for paid feature)
     */
    WolfPackFundingHunter.prototype.getHunts = function (userId) {
        var allHunts = Array.from(this.hunts.values());
        if (userId) {
            return allHunts.filter(function (h) { return h.userId === userId; });
        }
        return allHunts;
    };
    /**
     * Get all opportunities
     */
    WolfPackFundingHunter.prototype.getOpportunities = function () {
        return Array.from(this.opportunities.values());
    };
    /**
     * Get opportunities by source
     */
    WolfPackFundingHunter.prototype.getOpportunitiesBySource = function (source) {
        return Array.from(this.opportunities.values()).filter(function (opp) { return opp.source === source; });
    };
    /**
     * Get hunt statistics
     */
    WolfPackFundingHunter.prototype.getHuntStats = function (huntId) {
        var hunt = this.hunts.get(huntId);
        if (!hunt)
            return null;
        var byStatus = {
            discovered: 0,
            researching: 0,
            applied: 0,
            interview: 0,
            approved: 0,
            rejected: 0,
            funded: 0,
        };
        var totalPotential = 0;
        for (var _i = 0, _a = hunt.opportunities; _i < _a.length; _i++) {
            var opp = _a[_i];
            byStatus[opp.status]++;
            if (opp.amount) {
                totalPotential += opp.amount.max;
            }
        }
        return {
            totalOpportunities: hunt.opportunities.length,
            byStatus: byStatus,
            totalPotential: totalPotential,
        };
    };
    return WolfPackFundingHunter;
}());
// Export singleton
exports.wolfPack = new WolfPackFundingHunter();
