"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMesh = startMesh;
exports.stopMesh = stopMesh;
exports.meshStatus = meshStatus;
exports.meshEvents = meshEvents;
var loader_1 = require("../legacy/loader");
var BudgetControlService_1 = require("../services/BudgetControlService");
var bus_1 = require("../starbridge/bus");
var types_1 = require("../starbridge/types");
var EVENT_BUFFER_LIMIT = parseInt((_a = process.env.MESH_EVENT_BUFFER) !== null && _a !== void 0 ? _a : "200", 10);
var LOG_EVENTS = process.env.MESH_EVENT_LOG === "true";
var recentEvents = [];
var handles = {
    started: false,
    intervals: [],
    unsubscribeEvents: null,
    components: {
        dreamKeeper: false,
        defenseNet: false,
        surgeonAgent: false,
        deployKeeper: false,
        magneticRail: false,
    },
};
function recordEvent(event) {
    var _a;
    recentEvents.push(event);
    if (recentEvents.length > EVENT_BUFFER_LIMIT) {
        recentEvents.shift();
    }
    if (LOG_EVENTS) {
        console.debug("[starbridge] ".concat(event.topic, ".").concat(event.type, " (").concat(event.source, ")"), (_a = event.payload) !== null && _a !== void 0 ? _a : {});
    }
}
function startDreamKeeper() {
    return __awaiter(this, void 0, void 0, function () {
        var module, dreamkeeper, interval;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (handles.components.dreamKeeper)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, loader_1.legacyImport)("../lib/dreamkeeperCore")];
                case 1:
                    module = _a.sent();
                    dreamkeeper = module === null || module === void 0 ? void 0 : module.DREAMKEEPER_CORE;
                    if (!dreamkeeper) {
                        console.warn("[mesh] DREAMKEEPER_CORE not available");
                        return [2 /*return*/];
                    }
                    if (typeof dreamkeeper.init === "function") {
                        dreamkeeper.init();
                    }
                    interval = setInterval(function () {
                        var _a;
                        try {
                            var status_1 = (_a = dreamkeeper.getStatus) === null || _a === void 0 ? void 0 : _a.call(dreamkeeper);
                            if (!status_1)
                                return;
                            void (0, bus_1.broadcastStarbridgeEvent)({
                                topic: types_1.StarbridgeTopic.System,
                                source: types_1.StarbridgeSource.DreamKeeper,
                                type: "dreamkeeper.status",
                                payload: status_1,
                            }, { skipPersistence: false });
                        }
                        catch (error) {
                            console.warn("[mesh] failed to publish DreamKeeper status: ".concat(error.message));
                        }
                    }, 30000);
                    handles.intervals.push(interval);
                    handles.components.dreamKeeper = true;
                    return [2 /*return*/];
            }
        });
    });
}
function startDefenseNet() {
    return __awaiter(this, void 0, void 0, function () {
        var module, defenseNet, interval;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (handles.components.defenseNet)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, loader_1.legacyImport)("../lib/defenseBots")];
                case 1:
                    module = _a.sent();
                    defenseNet = module === null || module === void 0 ? void 0 : module.DreamDefenseNet;
                    if (!defenseNet) {
                        console.warn("[mesh] DreamDefenseNet not available");
                        return [2 /*return*/];
                    }
                    if (typeof defenseNet.init === "function") {
                        defenseNet.init();
                    }
                    interval = setInterval(function () {
                        var _a;
                        try {
                            var status_2 = (_a = defenseNet.getStatus) === null || _a === void 0 ? void 0 : _a.call(defenseNet);
                            if (!status_2)
                                return;
                            void (0, bus_1.broadcastStarbridgeEvent)({
                                topic: types_1.StarbridgeTopic.System,
                                source: types_1.StarbridgeSource.Runtime,
                                type: "defense.status",
                                payload: status_2,
                            }, { skipPersistence: false });
                        }
                        catch (error) {
                            console.warn("[mesh] failed to publish DefenseNet status: ".concat(error.message));
                        }
                    }, 15000);
                    handles.intervals.push(interval);
                    handles.components.defenseNet = true;
                    return [2 /*return*/];
            }
        });
    });
}
function startSurgeonAgent() {
    return __awaiter(this, void 0, void 0, function () {
        var module, surgeon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (handles.components.surgeonAgent)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, loader_1.legacyImport)("../lib/aiSurgeonAgents")];
                case 1:
                    module = _a.sent();
                    surgeon = module === null || module === void 0 ? void 0 : module.SurgeonAgent;
                    if (!surgeon) {
                        console.warn("[mesh] SurgeonAgent not available");
                        return [2 /*return*/];
                    }
                    if (typeof surgeon.init === "function") {
                        surgeon.init();
                    }
                    handles.components.surgeonAgent = true;
                    return [2 /*return*/];
            }
        });
    });
}
function startDeployKeeper() {
    return __awaiter(this, void 0, void 0, function () {
        var deployInterval;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (handles.components.deployKeeper)
                        return [2 /*return*/];
                    deployInterval = setInterval(function () {
                        try {
                            var budgets = BudgetControlService_1.BudgetControlService.getAllBudgets();
                            void (0, bus_1.broadcastStarbridgeEvent)({
                                topic: types_1.StarbridgeTopic.Governor,
                                source: types_1.StarbridgeSource.DeployKeeper,
                                type: "deploykeeper.status",
                                payload: {
                                    budgets: budgets,
                                    timestamp: new Date().toISOString(),
                                },
                            }, { skipPersistence: false });
                        }
                        catch (error) {
                            console.warn("[mesh] failed to publish DeployKeeper status: ".concat(error.message));
                        }
                    }, 60000);
                    handles.intervals.push(deployInterval);
                    handles.components.deployKeeper = true;
                    return [4 /*yield*/, (0, bus_1.broadcastStarbridgeEvent)({
                            topic: types_1.StarbridgeTopic.Governor,
                            source: types_1.StarbridgeSource.DeployKeeper,
                            type: "deploykeeper.started",
                        }, { skipPersistence: false })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function startMagneticRail() {
    return __awaiter(this, void 0, void 0, function () {
        var schedulerModule, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (handles.components.magneticRail)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, (0, loader_1.legacyImport)("./magnetic-rail/scheduler")];
                case 2:
                    schedulerModule = _b.sent();
                    (_a = schedulerModule === null || schedulerModule === void 0 ? void 0 : schedulerModule.bootstrapRail) === null || _a === void 0 ? void 0 : _a.call(schedulerModule);
                    // Register jobs (these modules self-register when loaded)
                    return [4 /*yield*/, Promise.allSettled([
                            (0, loader_1.legacyImport)("./jobs/reputation"),
                            (0, loader_1.legacyImport)("./jobs/vectorRollup"),
                            (0, loader_1.legacyImport)("./jobs/watchdog"),
                        ])];
                case 3:
                    // Register jobs (these modules self-register when loaded)
                    _b.sent();
                    handles.components.magneticRail = true;
                    return [4 /*yield*/, (0, bus_1.broadcastStarbridgeEvent)({
                            topic: types_1.StarbridgeTopic.System,
                            source: types_1.StarbridgeSource.Runtime,
                            type: "rail.started",
                        }, { skipPersistence: false })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.warn("[mesh] failed to bootstrap Magnetic Rail: ".concat(error_1.message));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function startMesh() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (handles.started) {
                        return [2 /*return*/];
                    }
                    if (!handles.unsubscribeEvents) {
                        handles.unsubscribeEvents = (0, bus_1.onStarbridgeEvent)(recordEvent);
                    }
                    return [4 /*yield*/, Promise.all([
                            startDreamKeeper(),
                            startDefenseNet(),
                            startSurgeonAgent(),
                            startDeployKeeper(),
                            startMagneticRail(),
                        ])];
                case 1:
                    _a.sent();
                    handles.started = true;
                    return [4 /*yield*/, (0, bus_1.broadcastStarbridgeEvent)({
                            topic: types_1.StarbridgeTopic.System,
                            source: types_1.StarbridgeSource.Runtime,
                            type: "mesh.started",
                        }, { skipPersistence: false })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function stopMesh() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handles.intervals.forEach(function (interval) { return clearInterval(interval); });
                    handles.intervals.length = 0;
                    if (handles.unsubscribeEvents) {
                        handles.unsubscribeEvents();
                        handles.unsubscribeEvents = null;
                    }
                    handles.components = {
                        dreamKeeper: false,
                        defenseNet: false,
                        surgeonAgent: false,
                        deployKeeper: false,
                        magneticRail: false,
                    };
                    handles.started = false;
                    return [4 /*yield*/, (0, bus_1.broadcastStarbridgeEvent)({
                            topic: types_1.StarbridgeTopic.System,
                            source: types_1.StarbridgeSource.Runtime,
                            type: "mesh.stopped",
                        }, { skipPersistence: false })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function meshStatus() {
    return {
        started: handles.started,
        intervalCount: handles.intervals.length,
        components: __assign({}, handles.components),
        recentEventCount: recentEvents.length,
    };
}
function meshEvents(limit) {
    if (limit === void 0) { limit = 50; }
    var safeLimit = Math.max(1, Math.min(limit, EVENT_BUFFER_LIMIT));
    return recentEvents.slice(-safeLimit).reverse();
}
