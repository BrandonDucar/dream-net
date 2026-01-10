"use strict";
/**
 * System Graph API Route
 *
 * Provides read-only access to DreamNet internal system topology:
 * ports, routes, and wormholes.
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
var graph_1 = require("../system/graph");
var logger_1 = require("../utils/logger");
var router = (0, express_1.Router)();
/**
 * GET /api/system/graph
 *
 * Returns a complete snapshot of the DreamNet internal system topology.
 * Includes ports, routes, and wormholes with their current state.
 *
 * No authentication required (for now).
 * Read-only endpoint.
 */
router.get('/graph', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var log, snapshot, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log = (0, logger_1.getRequestLogger)(req);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                log.info('Fetching system graph snapshot');
                return [4 /*yield*/, (0, graph_1.getSystemSnapshot)()];
            case 2:
                snapshot = _a.sent();
                res.json({
                    ports: snapshot.ports,
                    routes: snapshot.routes,
                    wormholes: snapshot.wormholes
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                log.error('Failed to build system graph', error_1 instanceof Error ? error_1 : new Error(String(error_1)), {
                    route: '/api/system/graph',
                    method: 'GET'
                });
                res.status(500).json({
                    message: 'Failed to build system graph'
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
