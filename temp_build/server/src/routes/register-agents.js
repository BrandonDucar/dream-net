"use strict";
/**
 * Register All Agents as Citizens API
 *
 * POST /api/register-agents - Register all 143 agents as citizens
 * GET /api/register-agents/status - Check registration status
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
var express_1 = require("express");
var registry_1 = require("../../packages/directory/src/registry");
var citizenshipStore_1 = require("../../packages/dream-state-core/store/citizenshipStore");
var fs_1 = require("fs");
var path_1 = require("path");
var router = (0, express_1.Router)();
function cleanAgentId(id) {
    return id.replace(/^(server-|client-|package-|foundry-|system-|legacy-|nano-)/, "");
}
function determineTier(agent) {
    var name = agent.name.toUpperCase();
    if (["LUCID", "CANVAS", "ROOT", "ECHO", "CRADLE", "WING"].includes(name)) {
        return "operator";
    }
    if (name.includes("KEEPER") || name === "COINSENSEI" || name.includes("DREAMKEEPER")) {
        return "operator";
    }
    if (name.startsWith("AEGIS")) {
        return "architect";
    }
    if (name.includes("SPINE") || name.includes("NERVE") || name.includes("SHIELD") ||
        name.includes("DEFENSE") || name.includes("CORE")) {
        return "architect";
    }
    if (agent.type === "server" &&
        !name.includes("DEMO") &&
        !name.includes("TEST") &&
        !name.includes("ROUTE")) {
        return "citizen";
    }
    if (agent.type === "package") {
        return "citizen";
    }
    if (agent.type === "client") {
        return "dreamer";
    }
    if (agent.type === "foundry" || agent.type === "system") {
        return "citizen";
    }
    return "citizen";
}
function determineFlags(agent) {
    var flags = [];
    var name = agent.name.toUpperCase();
    if (agent.status === "active")
        flags.push("active");
    if (agent.type === "server")
        flags.push("backend");
    if (agent.type === "client")
        flags.push("frontend");
    if (agent.type === "package")
        flags.push("shared");
    if (name.includes("CORE") || name.includes("KEEPER"))
        flags.push("core");
    if (name.startsWith("AEGIS"))
        flags.push("aegis", "defense");
    if (name.includes("SPINE") || name.includes("NERVE"))
        flags.push("nervous-system");
    if (name.includes("SHIELD") || name.includes("DEFENSE"))
        flags.push("defense");
    if (name.includes("WOLF") || name.includes("PACK"))
        flags.push("wolf-pack");
    if (name.includes("OCTOPUS"))
        flags.push("octopus");
    if (name.includes("SWARM"))
        flags.push("swarm");
    if (name.includes("SPIDER") || name.includes("WEB"))
        flags.push("spider-web");
    if (name.includes("FALCON") || name.includes("EYE"))
        flags.push("falcon-eye");
    return flags;
}
function determineClusterId(agent) {
    var name = agent.name.toUpperCase();
    if (name.includes("WOLF") || name.includes("PACK"))
        return "WOLF_PACK";
    if (name.includes("OCTOPUS"))
        return "OCTOPUS";
    if (name.includes("SWARM"))
        return "SWARM";
    if (name.includes("SPIDER") || name.includes("WEB"))
        return "SPIDER_WEB";
    if (name.includes("FALCON") || name.includes("EYE"))
        return "FALCON_EYE";
    if (name.includes("SHIELD") || name.includes("DEFENSE"))
        return "SHIELD_CORE";
    if (name.includes("API") || name.includes("KEEPER")) {
        if (name.includes("API"))
            return "API_KEEPER";
        if (name.includes("ENV"))
            return "ENVKEEPER_CORE";
        if (name.includes("DEPLOY"))
            return "DEPLOYKEEPER_CORE";
        return "API_KEEPER";
    }
    if (name.includes("DREAM") && name.includes("STATE"))
        return "DREAM_STATE";
    if (name.includes("STAR") || name.includes("BRIDGE"))
        return "STAR_BRIDGE";
    if (name.includes("JAGGY") || name.includes("SILENT"))
        return "JAGGY";
    if (name.includes("WEBHOOK") || name.includes("NERVOUS"))
        return "WEBHOOK_NERVOUS_SYSTEM";
    if (name.startsWith("AEGIS"))
        return "AEGIS_FLEET";
    return undefined;
}
function determineKind(agentType) {
    if (agentType === "server")
        return "infra";
    if (agentType === "client")
        return "social";
    if (agentType === "package")
        return "system";
    if (agentType === "foundry")
        return "system";
    if (agentType === "system")
        return "system";
    return "other";
}
// POST /api/register-agents - Register all agents
router.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var inventoryPath, COMPREHENSIVE_AGENT_INVENTORY, agents, results, _i, agents_1, agent, agentId, tier, flags, clusterId, kind, identityId, passport, citizenId, clusterInfo, registeredAgents, registeredCitizens, passports;
    return __generator(this, function (_a) {
        try {
            console.log("🏛️ Registering All 143 Agents as DreamNet Citizens...\n");
            inventoryPath = (0, path_1.join)(process.cwd(), "COMPREHENSIVE_AGENT_INVENTORY.json");
            COMPREHENSIVE_AGENT_INVENTORY = JSON.parse((0, fs_1.readFileSync)(inventoryPath, "utf-8"));
            agents = COMPREHENSIVE_AGENT_INVENTORY.agents;
            results = {
                registered: 0,
                passportsIssued: 0,
                citizensCreated: 0,
                skipped: 0,
                errors: [],
                details: []
            };
            for (_i = 0, agents_1 = agents; _i < agents_1.length; _i++) {
                agent = agents_1[_i];
                try {
                    if (agent.status === "stub") {
                        console.log("\u23ED\uFE0F  Skipping stub agent: ".concat(agent.name));
                        results.skipped++;
                        continue;
                    }
                    agentId = cleanAgentId(agent.id);
                    tier = determineTier(agent);
                    flags = determineFlags(agent);
                    clusterId = determineClusterId(agent);
                    kind = determineKind(agent.type);
                    // 1. Register agent in Directory
                    (0, registry_1.registerAgent)({
                        agentId: agentId,
                        label: agent.name,
                        clusterId: clusterId,
                        kind: kind,
                        description: agent.description || "Agent from ".concat(agent.file)
                    });
                    results.registered++;
                    identityId = "agent:".concat(agentId);
                    passport = citizenshipStore_1.CitizenshipStore.issuePassport(identityId, tier, flags);
                    results.passportsIssued++;
                    citizenId = "CIT-".concat(agentId);
                    (0, registry_1.registerCitizen)({
                        citizenId: citizenId,
                        label: "".concat(agent.name, " (Agent Citizen)"),
                        description: "Agent citizen with passport ".concat(passport.id, ", tier ").concat(tier)
                    });
                    results.citizensCreated++;
                    results.details.push({
                        agent: agent.name,
                        citizenId: citizenId,
                        passportId: passport.id,
                        tier: tier,
                        cluster: clusterId
                    });
                    clusterInfo = clusterId ? " [".concat(clusterId, "]") : "";
                    console.log("\u2705 ".concat(agent.name, " \u2192 Citizen ").concat(citizenId, " (Passport: ").concat(passport.id, ", Tier: ").concat(tier).concat(clusterInfo, ")"));
                }
                catch (error) {
                    results.errors.push({
                        agent: agent.name,
                        error: error.message
                    });
                    console.error("\u274C Failed to register ".concat(agent.name, ": ").concat(error.message));
                }
            }
            registeredAgents = (0, registry_1.listEntriesByType)("agent");
            registeredCitizens = (0, registry_1.listEntriesByType)("citizen");
            passports = citizenshipStore_1.CitizenshipStore.listPassports();
            console.log("\n\uD83D\uDCCA Summary:");
            console.log("   Registered Agents: ".concat(results.registered));
            console.log("   Passports Issued: ".concat(results.passportsIssued));
            console.log("   Citizens Created: ".concat(results.citizensCreated));
            console.log("   Skipped (stub): ".concat(results.skipped));
            console.log("   Errors: ".concat(results.errors.length));
            console.log("\n\uD83D\uDD0D Verification:");
            console.log("   Directory Agents: ".concat(registeredAgents.length));
            console.log("   Directory Citizens: ".concat(registeredCitizens.length));
            console.log("   Passports: ".concat(passports.length));
            res.json({
                success: true,
                summary: {
                    registered: results.registered,
                    passportsIssued: results.passportsIssued,
                    citizensCreated: results.citizensCreated,
                    skipped: results.skipped,
                    errors: results.errors.length
                },
                verification: {
                    directoryAgents: registeredAgents.length,
                    directoryCitizens: registeredCitizens.length,
                    passports: passports.length
                },
                details: results.details.slice(0, 50), // First 50 for preview
                errors: results.errors.length > 0 ? results.errors : undefined
            });
        }
        catch (error) {
            console.error("❌ Registration failed:", error);
            res.status(500).json({
                success: false,
                error: error.message,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/register-agents/status - Check current status
router.get("/status", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var registeredAgents, registeredCitizens, passports;
    return __generator(this, function (_a) {
        try {
            registeredAgents = (0, registry_1.listEntriesByType)("agent");
            registeredCitizens = (0, registry_1.listEntriesByType)("citizen");
            passports = citizenshipStore_1.CitizenshipStore.listPassports();
            res.json({
                success: true,
                counts: {
                    agents: registeredAgents.length,
                    citizens: registeredCitizens.length,
                    passports: passports.length
                },
                expected: {
                    agents: 143,
                    citizens: 143,
                    passports: 143
                },
                status: registeredAgents.length === 143 && registeredCitizens.length === 143 && passports.length === 143
                    ? "complete"
                    : "incomplete"
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
