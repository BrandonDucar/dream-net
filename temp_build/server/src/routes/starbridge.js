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
var express_1 = require("express");
var schemas_1 = require("../starbridge/schemas");
var starbridge_1 = require("../starbridge");
var policy_1 = require("../starbridge/policy");
var router = (0, express_1.Router)();
function formatSseEvent(event) {
    return "data: ".concat(JSON.stringify(__assign(__assign({}, event), { ts: event.ts.toISOString() })), "\n\n");
}
router.post("/event", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!(0, policy_1.verifyIngress)(req)) {
                    return [2 /*return*/, res.status(401).json({ success: false, error: "Invalid signature" })];
                }
                return [4 /*yield*/, (0, starbridge_1.publishExternalEvent)(req.body)];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(202).json({
                        success: true,
                        message: "Event accepted",
                    })];
            case 2:
                error_1 = _b.sent();
                console.error("[StarBridge] Failed to ingest event", error_1);
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: (_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) !== null && _a !== void 0 ? _a : "Invalid event payload",
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/events", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedQuery, events, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                parsedQuery = schemas_1.starbridgeQuerySchema.parse({
                    topics: req.query.topics
                        ? String(req.query.topics)
                            .split(",")
                            .map(function (topic) { return topic.trim(); })
                            .filter(Boolean)
                        : undefined,
                    limit: req.query.limit ? Number(req.query.limit) : undefined,
                    since: req.query.since ? String(req.query.since) : undefined,
                });
                return [4 /*yield*/, (0, starbridge_1.fetchEvents)({
                        topics: parsedQuery.topics,
                        limit: parsedQuery.limit,
                        since: parsedQuery.since ? new Date(parsedQuery.since) : undefined,
                    })];
            case 1:
                events = _b.sent();
                return [2 /*return*/, res.json({
                        success: true,
                        events: events.map(function (event) { return (__assign(__assign({}, event), { ts: event.ts })); }),
                    })];
            case 2:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: (_a = error_2 === null || error_2 === void 0 ? void 0 : error_2.message) !== null && _a !== void 0 ? _a : "Invalid query parameters",
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/stream", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var topicsParam, topics, limit, since, replay, sendEvent, unsubscribe, replayEvents, _i, _a, event_1, error_3, heartbeat;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                res.set({
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    Connection: "keep-alive",
                });
                (_b = res.flushHeaders) === null || _b === void 0 ? void 0 : _b.call(res);
                topicsParam = req.query.topics ? String(req.query.topics) : "";
                topics = topicsParam
                    ? topicsParam
                        .split(",")
                        .map(function (topic) { return topic.trim(); })
                        .filter(Boolean)
                        .map(function (topic) { return topic; })
                    : Object.values(starbridge_1.StarbridgeTopic);
                limit = req.query.limit ? Number(req.query.limit) : 100;
                since = req.query.since ? new Date(String(req.query.since)) : undefined;
                replay = req.query.replay !== "false";
                sendEvent = function (event) {
                    res.write(formatSseEvent(event));
                };
                unsubscribe = (0, starbridge_1.subscribeToTopics)(topics, sendEvent);
                res.write(": connected\n\n");
                if (!replay) return [3 /*break*/, 8];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                return [4 /*yield*/, (0, starbridge_1.fetchEvents)({
                        topics: topics,
                        limit: limit,
                        since: since,
                    })];
            case 2:
                replayEvents = _c.sent();
                _i = 0, _a = replayEvents.reverse();
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                event_1 = _a[_i];
                sendEvent(__assign(__assign({}, event_1), { ts: new Date(event_1.ts), replayed: true, topic: event_1.topic }));
                return [4 /*yield*/, (0, starbridge_1.markEventReplayed)(event_1.id)];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_3 = _c.sent();
                console.error("[StarBridge] Failed to fetch replay events", error_3);
                return [3 /*break*/, 8];
            case 8:
                heartbeat = setInterval(function () {
                    res.write(": ping\n\n");
                }, 15000);
                req.on("close", function () {
                    clearInterval(heartbeat);
                    unsubscribe();
                });
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
