"use strict";
/**
 * Custom GPT Fleet System
 *
 * Manages all 30-40 custom GPTs organized by vertical ecosystems:
 * - Atlas Ecosystem
 * - Aegis Ecosystem
 * - Travel & Commerce Ecosystem
 * - Creative Ecosystem
 * - Commerce Ecosystem
 * - Sentinel Ecosystem
 * - And more...
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.customGPTFleetSystem = void 0;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_crypto_1 = require("node:crypto");
var CustomGPTFleetSystem = /** @class */ (function () {
    function CustomGPTFleetSystem() {
        this.gpts = [];
        this.fleets = new Map();
        this.loadGPTs();
        this.initializeFleets();
    }
    /**
     * Load GPTs from registry.json
     */
    CustomGPTFleetSystem.prototype.loadGPTs = function () {
        try {
            var registryPath = (0, node_path_1.join)(process.cwd(), "registry.json");
            var registryData = JSON.parse((0, node_fs_1.readFileSync)(registryPath, "utf-8"));
            this.gpts = registryData;
            console.log("\uD83D\uDCDA [Custom GPT Fleet] Loaded ".concat(this.gpts.length, " custom GPTs"));
        }
        catch (error) {
            console.error("Failed to load GPT registry:", error);
            this.gpts = [];
        }
    };
    /**
     * Initialize fleets by category
     */
    CustomGPTFleetSystem.prototype.initializeFleets = function () {
        // Group GPTs by category
        var gptsByCategory = new Map();
        for (var _i = 0, _a = this.gpts; _i < _a.length; _i++) {
            var gpt = _a[_i];
            if (!gptsByCategory.has(gpt.category)) {
                gptsByCategory.set(gpt.category, []);
            }
            gptsByCategory.get(gpt.category).push(gpt);
        }
        // Create fleet for each category
        for (var _b = 0, _c = gptsByCategory.entries(); _b < _c.length; _b++) {
            var _d = _c[_b], category = _d[0], gpts = _d[1];
            var fleet = {
                id: (0, node_crypto_1.randomUUID)(),
                category: category.toLowerCase().replace(/\s+/g, "-"),
                name: "".concat(category, " Fleet"),
                description: this.getCategoryDescription(category),
                gpts: gpts.filter(function (g) { return g.status === "Active"; }),
                status: "active",
                mission: null,
                createdAt: new Date().toISOString(),
                lastDeployedAt: null,
            };
            this.fleets.set(fleet.category, fleet);
            console.log("\uD83D\uDE80 [Custom GPT Fleet] Initialized ".concat(fleet.name, " with ").concat(fleet.gpts.length, " GPTs"));
        }
    };
    /**
     * Get category description
     */
    CustomGPTFleetSystem.prototype.getCategoryDescription = function (category) {
        var descriptions = {
            "Atlas": "AI model training, coordination, and agent building ecosystem",
            "Aegis": "Security, privacy, compliance, and defense ecosystem",
            "Travel & Commerce": "Travel optimization, logistics, and commerce ecosystem",
            "Creative": "Content creation, design, and creative tools ecosystem",
            "Commerce": "Payment, revenue, and business operations ecosystem",
            "Sentinel": "Monitoring, auditing, and network security ecosystem",
            "Core": "Core DreamNet orchestration and control systems",
            "Experimental": "Experimental and cutting-edge research systems",
            "Automation": "Workflow automation and orchestration",
            "Compliance & Tokenization": "Legal compliance and tokenization systems",
            "Growth": "Community growth and SEO systems",
            "Infra": "Infrastructure and system management",
            "Memory": "Memory and data systems",
            "Security": "Security and access control",
            "Production": "Production and deployment systems",
            "Web3": "Web3 and blockchain systems",
            "DreamOps": "Dream operations and management",
            "Evolution": "Evolution and improvement systems",
            "Luxury Design": "Luxury design and creative systems",
            "OmniBridge": "Bridge and integration systems",
        };
        return descriptions[category] || "".concat(category, " ecosystem for specialized operations");
    };
    /**
     * Get all fleets
     */
    CustomGPTFleetSystem.prototype.getAllFleets = function () {
        return Array.from(this.fleets.values());
    };
    /**
     * Get fleet by category
     */
    CustomGPTFleetSystem.prototype.getFleet = function (category) {
        var normalized = category.toLowerCase().replace(/\s+/g, "-");
        return this.fleets.get(normalized);
    };
    /**
     * Get all GPTs
     */
    CustomGPTFleetSystem.prototype.getAllGPTs = function () {
        return this.gpts;
    };
    /**
     * Get GPTs by category
     */
    CustomGPTFleetSystem.prototype.getGPTsByCategory = function (category) {
        return this.gpts.filter(function (gpt) {
            return gpt.category.toLowerCase() === category.toLowerCase();
        });
    };
    /**
     * Deploy fleet on mission
     */
    CustomGPTFleetSystem.prototype.deployFleet = function (category, objective) {
        var fleet = this.getFleet(category);
        if (!fleet)
            return null;
        fleet.status = "deployed";
        fleet.mission = objective;
        fleet.lastDeployedAt = new Date().toISOString();
        console.log("\uD83D\uDE80 [Custom GPT Fleet] ".concat(fleet.name, " deployed on mission: ").concat(objective));
        return fleet;
    };
    /**
     * Get fleet statistics
     */
    CustomGPTFleetSystem.prototype.getStatistics = function () {
        var activeGPTs = this.gpts.filter(function (g) { return g.status === "Active"; }).length;
        var fleetsByCategory = {};
        for (var _i = 0, _a = this.fleets.values(); _i < _a.length; _i++) {
            var fleet = _a[_i];
            fleetsByCategory[fleet.category] = fleet.gpts.length;
        }
        return {
            totalGPTs: this.gpts.length,
            activeGPTs: activeGPTs,
            totalFleets: this.fleets.size,
            fleetsByCategory: fleetsByCategory,
        };
    };
    return CustomGPTFleetSystem;
}());
// Export singleton
exports.customGPTFleetSystem = new CustomGPTFleetSystem();
