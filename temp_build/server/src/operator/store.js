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
exports.listTasks = listTasks;
exports.addTask = addTask;
exports.listSpores = listSpores;
exports.addSpore = addSpore;
exports.listWormholes = listWormholes;
exports.addWormhole = addWormhole;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var STORE_PATH = node_path_1.default.resolve(process.cwd(), "server/operator/operatorStore.json");
function ensureStore() {
    return __awaiter(this, void 0, void 0, function () {
        var data, parsed, error_1, empty;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, node_fs_1.promises.readFile(STORE_PATH, "utf8")];
                case 1:
                    data = _d.sent();
                    parsed = JSON.parse(data);
                    return [2 /*return*/, {
                            tasks: (_a = parsed.tasks) !== null && _a !== void 0 ? _a : [],
                            spores: (_b = parsed.spores) !== null && _b !== void 0 ? _b : [],
                            wormholes: (_c = parsed.wormholes) !== null && _c !== void 0 ? _c : [],
                        }];
                case 2:
                    error_1 = _d.sent();
                    if (!(error_1.code === "ENOENT")) return [3 /*break*/, 5];
                    empty = { tasks: [], spores: [], wormholes: [] };
                    return [4 /*yield*/, node_fs_1.promises.mkdir(node_path_1.default.dirname(STORE_PATH), { recursive: true })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, node_fs_1.promises.writeFile(STORE_PATH, JSON.stringify(empty, null, 2), "utf8")];
                case 4:
                    _d.sent();
                    return [2 /*return*/, empty];
                case 5: throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function persist(store) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fs_1.promises.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function listTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureStore()];
                case 1:
                    store = _a.sent();
                    return [2 /*return*/, store.tasks];
            }
        });
    });
}
function addTask(task) {
    return __awaiter(this, void 0, void 0, function () {
        var store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureStore()];
                case 1:
                    store = _a.sent();
                    store.tasks.unshift(task);
                    store.tasks = store.tasks.slice(0, 100);
                    return [4 /*yield*/, persist(store)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function listSpores() {
    return __awaiter(this, void 0, void 0, function () {
        var store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureStore()];
                case 1:
                    store = _a.sent();
                    return [2 /*return*/, store.spores];
            }
        });
    });
}
function addSpore(spore) {
    return __awaiter(this, void 0, void 0, function () {
        var store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureStore()];
                case 1:
                    store = _a.sent();
                    store.spores.unshift(spore);
                    store.spores = store.spores.slice(0, 100);
                    return [4 /*yield*/, persist(store)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function listWormholes() {
    return __awaiter(this, void 0, void 0, function () {
        var store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureStore()];
                case 1:
                    store = _a.sent();
                    return [2 /*return*/, store.wormholes];
            }
        });
    });
}
function addWormhole(wormhole) {
    return __awaiter(this, void 0, void 0, function () {
        var store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureStore()];
                case 1:
                    store = _a.sent();
                    store.wormholes.unshift(wormhole);
                    store.wormholes = store.wormholes.slice(0, 100);
                    return [4 /*yield*/, persist(store)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
