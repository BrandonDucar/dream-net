"use strict";
/**
 * Rate Limiter Middleware
 *
 * Simple in-memory rate limiter
 * In production, this should use Redis or similar
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
exports.rateLimitManager = void 0;
var RateLimitManager = /** @class */ (function () {
    function RateLimitManager() {
        this.clients = new Map();
        this.WINDOW_MS = 60 * 1000; // 1 minute
        this.MAX_REQUESTS = 100; // per window
    }
    RateLimitManager.prototype.getClient = function (clientId) {
        var existing = this.clients.get(clientId);
        var now = Date.now();
        if (!existing || now >= existing.resetAt) {
            var newClient = {
                requests: 0,
                resetAt: now + this.WINDOW_MS,
            };
            this.clients.set(clientId, newClient);
            return newClient;
        }
        return existing;
    };
    RateLimitManager.prototype.checkLimit = function (clientId) {
        var client = this.getClient(clientId);
        var allowed = client.requests < this.MAX_REQUESTS;
        if (allowed) {
            client.requests++;
        }
        return {
            allowed: allowed,
            remaining: Math.max(0, this.MAX_REQUESTS - client.requests),
        };
    };
    RateLimitManager.prototype.getStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, _i, _a, _b, id, client;
            return __generator(this, function (_c) {
                now = Date.now();
                // Clean up expired clients
                for (_i = 0, _a = this.clients.entries(); _i < _a.length; _i++) {
                    _b = _a[_i], id = _b[0], client = _b[1];
                    if (now >= client.resetAt) {
                        this.clients.delete(id);
                    }
                }
                return [2 /*return*/, {
                        active_clients: this.clients.size,
                        status: 'operational',
                    }];
            });
        });
    };
    return RateLimitManager;
}());
exports.rateLimitManager = new RateLimitManager();
