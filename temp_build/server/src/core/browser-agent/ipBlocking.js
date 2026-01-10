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
exports.defaultIpBlocking = exports.IPBlocking = void 0;
var url_1 = require("url");
var dns_1 = require("dns");
var util_1 = require("util");
var net_1 = require("net");
var lookup = (0, util_1.promisify)(dns_1.default.lookup);
var IPBlocking = /** @class */ (function () {
    function IPBlocking() {
    }
    /**
     * Validate that a URL does not resolve to a blocked IP address
     */
    IPBlocking.prototype.validateUrl = function (urlStr) {
        return __awaiter(this, void 0, void 0, function () {
            var url, hostname, address, dnsError_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        url = new url_1.URL(urlStr);
                        hostname = url.hostname;
                        // 1. Check if hostname is an IP literal and block if internal
                        if (net_1.default.isIP(hostname)) {
                            if (this.isInternalIP(hostname)) {
                                return [2 /*return*/, { allowed: false, reason: "Direct IP access to internal address '".concat(hostname, "' is blocked."), resolvedIp: hostname }];
                            }
                            // If it's a public IP, we might still want to block it if we only allow domains, 
                            // but for now we rely on domainAllowlist for that policy. 
                            // This class strictly checks for *internal/unsafe* IPs.
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, lookup(hostname)];
                    case 2:
                        address = (_a.sent()).address;
                        if (this.isInternalIP(address)) {
                            return [2 /*return*/, { allowed: false, reason: "Domain '".concat(hostname, "' resolves to internal IP '").concat(address, "'."), resolvedIp: address }];
                        }
                        return [2 /*return*/, { allowed: true, resolvedIp: address }];
                    case 3:
                        dnsError_1 = _a.sent();
                        // If DNS fails, we can't verify it's safe, but we also can't connect to it.
                        // However, to be safe against some DNS rebinding tricks or partial failures, 
                        // we might fail open or closed. 
                        // For now, if we can't resolve it, Lighthouse will likely fail anyway.
                        // We'll allow it to proceed to Lighthouse which handles its own errors, 
                        // assuming the domainAllowlist has already passed.
                        return [2 /*return*/, { allowed: true, reason: 'DNS resolution failed, proceeding with caution.' }];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        return [2 /*return*/, { allowed: false, reason: 'Invalid URL format.' }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if an IP address is internal/private/reserved
     */
    IPBlocking.prototype.isInternalIP = function (ip) {
        // IPv4 Checks
        if (net_1.default.isIPv4(ip)) {
            var parts = ip.split('.').map(Number);
            // 127.0.0.0/8 (Loopback)
            if (parts[0] === 127)
                return true;
            // 10.0.0.0/8 (Private)
            if (parts[0] === 10)
                return true;
            // 172.16.0.0/12 (Private)
            if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
                return true;
            // 192.168.0.0/16 (Private)
            if (parts[0] === 192 && parts[1] === 168)
                return true;
            // 169.254.0.0/16 (Link-Local)
            if (parts[0] === 169 && parts[1] === 254)
                return true;
            // 0.0.0.0/8 (Current network)
            if (parts[0] === 0)
                return true;
        }
        // IPv6 Checks
        if (net_1.default.isIPv6(ip)) {
            // ::1 (Loopback)
            if (ip === '::1' || ip === '0:0:0:0:0:0:0:1')
                return true;
            // fe80::/10 (Link-Local)
            if (ip.toLowerCase().startsWith('fe80:'))
                return true;
            // fc00::/7 (Unique Local Address - Private)
            if (ip.toLowerCase().startsWith('fc') || ip.toLowerCase().startsWith('fd'))
                return true;
        }
        return false;
    };
    return IPBlocking;
}());
exports.IPBlocking = IPBlocking;
exports.defaultIpBlocking = new IPBlocking();
