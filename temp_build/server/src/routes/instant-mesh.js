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
exports.createInstantMeshRouter = createInstantMeshRouter;
var express_1 = require("express");
var InstantMesh_1 = require("../mesh/InstantMesh");
function createInstantMeshRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // GET /api/mesh/instant/status - Get instant mesh status
    router.get("/mesh/instant/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var status_1;
        return __generator(this, function (_a) {
            try {
                status_1 = InstantMesh_1.instantMesh.getStatus();
                res.json({ ok: true, status: status_1 });
            }
            catch (error) {
                console.error("Failed to get instant mesh status:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/mesh/instant/emit - Emit instant event
    router.post("/mesh/instant/emit", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, source, target, type, payload, event_1;
        return __generator(this, function (_b) {
            try {
                _a = req.body, source = _a.source, target = _a.target, type = _a.type, payload = _a.payload;
                if (!source || !type) {
                    return [2 /*return*/, res.status(400).json({ error: "source and type are required" })];
                }
                event_1 = InstantMesh_1.instantMesh.emit({
                    source: source,
                    target: target,
                    type: type,
                    payload: payload || {},
                });
                res.json({ ok: true, event: event_1 });
            }
            catch (error) {
                console.error("Failed to emit event:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/mesh/instant/events - Get recent events
    router.get("/mesh/instant/events", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var limit, events;
        return __generator(this, function (_a) {
            try {
                limit = parseInt(String(req.query.limit || 100), 10);
                events = InstantMesh_1.instantMesh.getRecentEvents(limit);
                res.json({ ok: true, events: events, count: events.length });
            }
            catch (error) {
                console.error("Failed to get events:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/mesh/hybrids/create - Create agent hybrid
    router.post("/mesh/hybrids/create", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, name_1, parentAgents, capabilities, traits, hybrid;
        return __generator(this, function (_b) {
            try {
                _a = req.body, name_1 = _a.name, parentAgents = _a.parentAgents, capabilities = _a.capabilities, traits = _a.traits;
                if (!name_1 || !parentAgents || !Array.isArray(parentAgents)) {
                    return [2 /*return*/, res.status(400).json({ error: "name and parentAgents array are required" })];
                }
                hybrid = InstantMesh_1.instantMesh.createHybrid(name_1, parentAgents, capabilities || [], traits || []);
                res.json({ ok: true, hybrid: hybrid });
            }
            catch (error) {
                console.error("Failed to create hybrid:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/mesh/hybrids/cross - Cross two agents
    router.post("/mesh/hybrids/cross", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, agent1, agent2, name_2, hybrid;
        return __generator(this, function (_b) {
            try {
                _a = req.body, agent1 = _a.agent1, agent2 = _a.agent2, name_2 = _a.name;
                if (!agent1 || !agent2) {
                    return [2 /*return*/, res.status(400).json({ error: "agent1 and agent2 are required" })];
                }
                hybrid = InstantMesh_1.instantMesh.crossAgents(agent1, agent2, name_2);
                res.json({ ok: true, hybrid: hybrid });
            }
            catch (error) {
                console.error("Failed to cross agents:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // POST /api/mesh/hybrids/evolve - Evolve hybrid from another
    router.post("/mesh/hybrids/evolve", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parentHybridId, name_3, newCapabilities, newTraits, hybrid;
        return __generator(this, function (_b) {
            try {
                _a = req.body, parentHybridId = _a.parentHybridId, name_3 = _a.name, newCapabilities = _a.newCapabilities, newTraits = _a.newTraits;
                if (!parentHybridId || !name_3) {
                    return [2 /*return*/, res.status(400).json({ error: "parentHybridId and name are required" })];
                }
                hybrid = InstantMesh_1.instantMesh.evolveHybrid(parentHybridId, name_3, newCapabilities || [], newTraits || []);
                if (!hybrid) {
                    return [2 /*return*/, res.status(404).json({ error: "Parent hybrid not found" })];
                }
                res.json({ ok: true, hybrid: hybrid });
            }
            catch (error) {
                console.error("Failed to evolve hybrid:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/mesh/hybrids - Get all hybrids
    router.get("/mesh/hybrids", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var hybrids;
        return __generator(this, function (_a) {
            try {
                hybrids = InstantMesh_1.instantMesh.getHybrids();
                res.json({ ok: true, hybrids: hybrids, count: hybrids.length });
            }
            catch (error) {
                console.error("Failed to get hybrids:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    return router;
}
