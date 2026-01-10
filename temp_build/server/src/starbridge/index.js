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
Object.defineProperty(exports, "__esModule", { value: true });
exports.markEventReplayed = exports.fetchEvents = exports.StarbridgeSource = exports.StarbridgeTopic = void 0;
exports.publishInternalEvent = publishInternalEvent;
exports.publishExternalEvent = publishExternalEvent;
exports.subscribeToTopics = subscribeToTopics;
exports.seedSystemHeartbeat = seedSystemHeartbeat;
var nanoid_1 = require("nanoid");
var repository_1 = require("./repository");
Object.defineProperty(exports, "fetchEvents", { enumerable: true, get: function () { return repository_1.fetchEvents; } });
Object.defineProperty(exports, "markEventReplayed", { enumerable: true, get: function () { return repository_1.markEventReplayed; } });
var bus_1 = require("./bus");
var schemas_1 = require("./schemas");
var types_1 = require("./types");
var types_2 = require("./types");
Object.defineProperty(exports, "StarbridgeTopic", { enumerable: true, get: function () { return types_2.StarbridgeTopic; } });
Object.defineProperty(exports, "StarbridgeSource", { enumerable: true, get: function () { return types_2.StarbridgeSource; } });
function publishInternalEvent(partial) {
    return __awaiter(this, void 0, void 0, function () {
        var event, parsed;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    event = (0, bus_1.rebuildEvent)(partial);
                    parsed = schemas_1.starbridgeEventSchema.parse(__assign(__assign({}, event), { ts: event.ts.getTime() }));
                    return [4 /*yield*/, (0, bus_1.publish)({
                            id: (_a = parsed.id) !== null && _a !== void 0 ? _a : (0, nanoid_1.nanoid)(),
                            topic: parsed.topic,
                            source: parsed.source,
                            type: parsed.type,
                            ts: new Date((_b = parsed.ts) !== null && _b !== void 0 ? _b : Date.now()),
                            payload: parsed.payload,
                            replayed: false,
                        })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function publishExternalEvent(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, event;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    parsed = schemas_1.starbridgeEventSchema.parse(payload);
                    event = {
                        id: (_a = parsed.id) !== null && _a !== void 0 ? _a : (0, nanoid_1.nanoid)(),
                        topic: parsed.topic,
                        source: parsed.source,
                        type: parsed.type,
                        ts: new Date((_b = parsed.ts) !== null && _b !== void 0 ? _b : Date.now()),
                        payload: parsed.payload,
                        replayed: false,
                    };
                    return [4 /*yield*/, (0, bus_1.publish)(event)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function subscribeToTopics(topics, handler) {
    return (0, bus_1.addSubscriber)(topics, handler);
}
function seedSystemHeartbeat() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, repository_1.persistEvent)({
                        id: (0, nanoid_1.nanoid)(),
                        topic: types_1.StarbridgeTopic.System,
                        source: types_1.StarbridgeSource.Runtime,
                        type: "system.startup",
                        ts: new Date(),
                        payload: { boot: "StarBridge online" },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
