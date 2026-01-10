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
exports.createFoundryRouter = createFoundryRouter;
var express_1 = require("express");
var AgentFoundry_1 = require("../foundry/AgentFoundry");
var InstantMesh_1 = require("../mesh/InstantMesh");
function createFoundryRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // GET /api/foundry/templates - Get all templates
    router.get("/foundry/templates", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var templates;
        return __generator(this, function (_a) {
            try {
                templates = AgentFoundry_1.agentFoundry.getTemplates();
                res.json({ ok: true, templates: templates });
            }
            catch (error) {
                console.error("Failed to get templates:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/foundry/templates/:slug - Get specific template
    router.get("/foundry/templates/:slug", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var template;
        return __generator(this, function (_a) {
            try {
                template = AgentFoundry_1.agentFoundry.getTemplate(req.params.slug);
                if (!template) {
                    return [2 /*return*/, res.status(404).json({ error: "Template not found" })];
                }
                res.json({ ok: true, template: template });
            }
            catch (error) {
                console.error("Failed to get template:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/foundry/build - Request agent build (from any agent)
    router.post("/foundry/build", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, requestedBy, agentName, templateSlug, capabilities, traits, parentAgents;
        return __generator(this, function (_b) {
            try {
                _a = req.body, requestedBy = _a.requestedBy, agentName = _a.agentName, templateSlug = _a.templateSlug, capabilities = _a.capabilities, traits = _a.traits, parentAgents = _a.parentAgents;
                if (!requestedBy || !agentName) {
                    return [2 /*return*/, res.status(400).json({ error: "requestedBy and agentName are required" })];
                }
                // Request build through foundry
                AgentFoundry_1.agentFoundry.requestBuild(requestedBy, agentName, {
                    templateSlug: templateSlug,
                    capabilities: capabilities,
                    traits: traits,
                    parentAgents: parentAgents,
                });
                res.json({
                    ok: true,
                    message: "Agent build requested",
                    requestedBy: requestedBy,
                    agentName: agentName,
                });
            }
            catch (error) {
                console.error("Failed to request build:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/foundry/build-direct - Build agent directly (bypasses mesh)
    router.post("/foundry/build-direct", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, requestedBy, agentName, templateSlug, capabilities, traits, parentAgents, build, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, requestedBy = _a.requestedBy, agentName = _a.agentName, templateSlug = _a.templateSlug, capabilities = _a.capabilities, traits = _a.traits, parentAgents = _a.parentAgents;
                    if (!requestedBy || !agentName) {
                        return [2 /*return*/, res.status(400).json({ error: "requestedBy and agentName are required" })];
                    }
                    return [4 /*yield*/, AgentFoundry_1.agentFoundry.buildAgent({
                            requestedBy: requestedBy,
                            agentName: agentName,
                            templateSlug: templateSlug,
                            capabilities: capabilities,
                            traits: traits,
                            parentAgents: parentAgents,
                        })];
                case 1:
                    build = _b.sent();
                    res.json({ ok: true, build: build });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error("Failed to build agent:", error_1);
                    res.status(500).json({ error: error_1.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/foundry/builds - Get all builds
    router.get("/foundry/builds", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var requestedBy, builds;
        return __generator(this, function (_a) {
            try {
                requestedBy = req.query.requestedBy;
                builds = AgentFoundry_1.agentFoundry.getBuilds(requestedBy);
                res.json({ ok: true, builds: builds, count: builds.length });
            }
            catch (error) {
                console.error("Failed to get builds:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/foundry/builds/:id - Get specific build
    router.get("/foundry/builds/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var build;
        return __generator(this, function (_a) {
            try {
                build = AgentFoundry_1.agentFoundry.getBuild(req.params.id);
                if (!build) {
                    return [2 /*return*/, res.status(404).json({ error: "Build not found" })];
                }
                res.json({ ok: true, build: build });
            }
            catch (error) {
                console.error("Failed to get build:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/foundry/hybrid/build - Build agent from hybrid
    router.post("/foundry/hybrid/build", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, hybridId_1, agentName, templateSlug, hybrids, hybrid;
        return __generator(this, function (_b) {
            try {
                _a = req.body, hybridId_1 = _a.hybridId, agentName = _a.agentName, templateSlug = _a.templateSlug;
                if (!hybridId_1 || !agentName) {
                    return [2 /*return*/, res.status(400).json({ error: "hybridId and agentName are required" })];
                }
                hybrids = InstantMesh_1.instantMesh.getHybrids();
                hybrid = hybrids.find(function (h) { return h.id === hybridId_1; });
                if (!hybrid) {
                    return [2 /*return*/, res.status(404).json({ error: "Hybrid not found" })];
                }
                // Request build from hybrid
                AgentFoundry_1.agentFoundry.requestBuild(hybrid.id, agentName, {
                    templateSlug: templateSlug,
                    capabilities: hybrid.capabilities,
                    traits: hybrid.traits,
                    parentAgents: hybrid.parentAgents,
                });
                res.json({
                    ok: true,
                    message: "Agent build requested from hybrid",
                    hybrid: hybrid.name,
                    agentName: agentName,
                });
            }
            catch (error) {
                console.error("Failed to build from hybrid:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    return router;
}
