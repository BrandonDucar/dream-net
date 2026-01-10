"use strict";
/**
 * Cloudflare DNS Provider Implementation
 * Manages DNS records via Cloudflare API
 */
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
exports.CloudflareDnsProvider = void 0;
exports.createDnsProvider = createDnsProvider;
var CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';
var CloudflareDnsProvider = /** @class */ (function () {
    function CloudflareDnsProvider() {
        this.apiToken = process.env.CF_API_TOKEN || '';
        this.zoneId = process.env.CF_ZONE_ID || '';
        if (!this.apiToken || !this.zoneId) {
            throw new Error('Cloudflare DNS provider requires CF_API_TOKEN and CF_ZONE_ID environment variables');
        }
        // Extract zone name from CF_ZONE_ID or use CF_ZONE_NAME if provided
        this.zoneName = process.env.CF_ZONE_NAME || '';
    }
    CloudflareDnsProvider.prototype.makeRequest = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, options) {
            var response, data, errors;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(CLOUDFLARE_API_BASE).concat(endpoint), __assign(__assign({}, options), { headers: __assign({ 'Authorization': "Bearer ".concat(this.apiToken), 'Content-Type': 'application/json' }, options.headers) }))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (!response.ok || !data.success) {
                            errors = data.errors || [{ message: response.statusText }];
                            throw new Error("Cloudflare API error: ".concat(errors.map(function (e) { return e.message; }).join(', ')));
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Normalize record name (remove zone name if present)
     */
    CloudflareDnsProvider.prototype.normalizeName = function (name) {
        if (this.zoneName && name.endsWith(".".concat(this.zoneName))) {
            return name.slice(0, -(this.zoneName.length + 1));
        }
        if (name === '@' || name === this.zoneName) {
            return '@';
        }
        return name;
    };
    /**
     * Get full record name (add zone name if needed)
     */
    CloudflareDnsProvider.prototype.getFullName = function (name) {
        if (name === '@') {
            return this.zoneName;
        }
        if (name.includes('.')) {
            return name;
        }
        return "".concat(name, ".").concat(this.zoneName);
    };
    CloudflareDnsProvider.prototype.listRecords = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var typeParam, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        typeParam = type ? "&type=".concat(type) : '';
                        return [4 /*yield*/, this.makeRequest("/zones/".concat(this.zoneId, "/dns_records?per_page=100").concat(typeParam))];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, (data.result || []).map(function (record) { return ({
                                type: record.type,
                                name: _this.normalizeName(record.name),
                                value: record.content,
                                ttl: record.ttl,
                                proxied: record.proxied,
                                id: record.id,
                            }); })];
                }
            });
        });
    };
    CloudflareDnsProvider.prototype.getRecord = function (name, type) {
        return __awaiter(this, void 0, void 0, function () {
            var records, normalizedName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listRecords(type)];
                    case 1:
                        records = _a.sent();
                        normalizedName = this.normalizeName(name);
                        return [2 /*return*/, records.find(function (r) { return r.name === normalizedName && r.type === type; }) || null];
                }
            });
        });
    };
    CloudflareDnsProvider.prototype.ensureARecord = function (name, value, options) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedName, existing, recordData, data, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        normalizedName = this.normalizeName(name);
                        return [4 /*yield*/, this.getRecord(name, 'A')];
                    case 1:
                        existing = _a.sent();
                        recordData = {
                            type: 'A',
                            name: normalizedName === '@' ? this.zoneName : this.getFullName(name),
                            content: value,
                            ttl: (options === null || options === void 0 ? void 0 : options.ttl) || 1, // 1 = auto, or specific TTL
                            proxied: (options === null || options === void 0 ? void 0 : options.proxied) || false,
                        };
                        if (!existing) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.makeRequest("/zones/".concat(this.zoneId, "/dns_records/").concat(existing.id), {
                                method: 'PUT',
                                body: JSON.stringify(recordData),
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, {
                                type: 'A',
                                name: normalizedName,
                                value: data.result.content,
                                ttl: data.result.ttl,
                                proxied: data.result.proxied,
                                id: data.result.id,
                            }];
                    case 3: return [4 /*yield*/, this.makeRequest("/zones/".concat(this.zoneId, "/dns_records"), {
                            method: 'POST',
                            body: JSON.stringify(recordData),
                        })];
                    case 4:
                        data = _a.sent();
                        return [2 /*return*/, {
                                type: 'A',
                                name: normalizedName,
                                value: data.result.content,
                                ttl: data.result.ttl,
                                proxied: data.result.proxied,
                                id: data.result.id,
                            }];
                }
            });
        });
    };
    CloudflareDnsProvider.prototype.ensureCnameRecord = function (name, target, options) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedName, existing, recordData, data, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        normalizedName = this.normalizeName(name);
                        return [4 /*yield*/, this.getRecord(name, 'CNAME')];
                    case 1:
                        existing = _a.sent();
                        recordData = {
                            type: 'CNAME',
                            name: normalizedName === '@' ? this.zoneName : this.getFullName(name),
                            content: target,
                            ttl: (options === null || options === void 0 ? void 0 : options.ttl) || 1,
                            proxied: (options === null || options === void 0 ? void 0 : options.proxied) || false,
                        };
                        if (!existing) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.makeRequest("/zones/".concat(this.zoneId, "/dns_records/").concat(existing.id), {
                                method: 'PUT',
                                body: JSON.stringify(recordData),
                            })];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, {
                                type: 'CNAME',
                                name: normalizedName,
                                value: data.result.content,
                                ttl: data.result.ttl,
                                proxied: data.result.proxied,
                                id: data.result.id,
                            }];
                    case 3: return [4 /*yield*/, this.makeRequest("/zones/".concat(this.zoneId, "/dns_records"), {
                            method: 'POST',
                            body: JSON.stringify(recordData),
                        })];
                    case 4:
                        data = _a.sent();
                        return [2 /*return*/, {
                                type: 'CNAME',
                                name: normalizedName,
                                value: data.result.content,
                                ttl: data.result.ttl,
                                proxied: data.result.proxied,
                                id: data.result.id,
                            }];
                }
            });
        });
    };
    CloudflareDnsProvider.prototype.removeRecord = function (name, type) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRecord(name, type)];
                    case 1:
                        existing = _a.sent();
                        if (!existing || !existing.id) {
                            return [2 /*return*/]; // Already removed or doesn't exist
                        }
                        return [4 /*yield*/, this.makeRequest("/zones/".concat(this.zoneId, "/dns_records/").concat(existing.id), {
                                method: 'DELETE',
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CloudflareDnsProvider;
}());
exports.CloudflareDnsProvider = CloudflareDnsProvider;
/**
 * Create DNS provider based on environment configuration
 */
function createDnsProvider() {
    var _a;
    var provider = ((_a = process.env.DNS_PROVIDER) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
    if (provider === 'cloudflare' || (process.env.CF_API_TOKEN && process.env.CF_ZONE_ID)) {
        try {
            return new CloudflareDnsProvider();
        }
        catch (error) {
            console.warn("[DomainKeeper] Failed to initialize Cloudflare DNS provider: ".concat(error.message));
            console.warn('[DomainKeeper] Falling back to NoOp provider');
            return new (require('./dnsProvider').NoOpDnsProvider)();
        }
    }
    // Unknown or no provider configured
    if (provider && provider !== 'none') {
        console.warn("[DomainKeeper] Unknown DNS provider: ".concat(provider, ". DNS sync will be skipped."));
    }
    return new (require('./dnsProvider').NoOpDnsProvider)();
}
