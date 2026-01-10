"use strict";
/**
 * DomainKeeper Service
 *
 * This keeps dreamnet.ink attached to the right Vercel project and ensures DNS records
 * match expected configuration. It provides self-healing domain management:
 *
 * - Ensures PRIMARY_DOMAIN (dreamnet.ink) is always attached to the correct Vercel project
 * - Optionally manages STAGING_DOMAIN (staging.dreamnet.ink) as a preview alias
 * - Syncs DNS records to point to Vercel's infrastructure
 * - Idempotent - safe to call multiple times
 *
 * Environment Variables:
 * - VERCEL_TOKEN: Vercel API token (required)
 * - VERCEL_TEAM_ID: Vercel team ID (optional, if account is under a team)
 * - VERCEL_PROJECT_NAME: Name of the Vercel project (default: "dream-net")
 * - PRIMARY_DOMAIN: Primary production domain (default: "dreamnet.ink")
 * - STAGING_DOMAIN: Staging/preview domain (optional, default: "staging.dreamnet.ink")
 * - DNS_PROVIDER: DNS provider name (e.g., "cloudflare", "none")
 * - CF_API_TOKEN: Cloudflare API token (if using Cloudflare)
 * - CF_ZONE_ID: Cloudflare zone ID (if using Cloudflare)
 * - CF_ZONE_NAME: Cloudflare zone name (optional, auto-detected)
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
exports.DomainKeeper = void 0;
exports.getDomainKeeper = getDomainKeeper;
var vercelClient_1 = require("../integrations/vercelClient");
var DomainKeeper = /** @class */ (function () {
    function DomainKeeper(dnsProvider) {
        this.vercelProjectName = process.env.VERCEL_PROJECT_NAME || 'dream-net';
        this.primaryDomain = process.env.PRIMARY_DOMAIN || 'dreamnet.ink';
        this.stagingDomain = process.env.STAGING_DOMAIN || null;
        this.dnsProvider = dnsProvider;
    }
    /**
     * Sync production domain (dreamnet.ink)
     * Ensures it's attached to Vercel project and DNS is correct
     */
    DomainKeeper.prototype.syncProductionDomain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, project, domain, error_1, listProjectDomains, domains, existing, dnsRecords, dnsResult, error_2, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {
                            domain: this.primaryDomain,
                            action: 'skipped',
                            message: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 12, , 13]);
                        return [4 /*yield*/, (0, vercelClient_1.getProjectByName)(this.vercelProjectName)];
                    case 2:
                        project = _a.sent();
                        if (!project) {
                            result.action = 'error';
                            result.message = "Vercel project \"".concat(this.vercelProjectName, "\" not found");
                            return [2 /*return*/, result];
                        }
                        domain = void 0;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 7]);
                        return [4 /*yield*/, (0, vercelClient_1.ensureDomainAttached)(project.id, this.primaryDomain, true)];
                    case 4:
                        domain = _a.sent();
                        result.action = 'attached';
                        result.message = "Domain attached to project ".concat(project.name);
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        listProjectDomains = require('../integrations/vercelClient').listProjectDomains;
                        return [4 /*yield*/, listProjectDomains(project.id)];
                    case 6:
                        domains = _a.sent();
                        existing = domains.find(function (d) { return d.name === _this.primaryDomain; });
                        if (existing) {
                            domain = existing;
                            result.action = 'already-attached';
                            result.message = "Domain already attached to project ".concat(project.name);
                        }
                        else {
                            throw error_1;
                        }
                        return [3 /*break*/, 7];
                    case 7:
                        _a.trys.push([7, 10, , 11]);
                        return [4 /*yield*/, (0, vercelClient_1.getVercelDnsRecords)(this.primaryDomain)];
                    case 8:
                        dnsRecords = _a.sent();
                        return [4 /*yield*/, this.syncDnsRecords(this.primaryDomain, dnsRecords)];
                    case 9:
                        dnsResult = _a.sent();
                        result.dnsAction = dnsResult.action;
                        result.dnsMessage = dnsResult.message;
                        return [3 /*break*/, 11];
                    case 10:
                        error_2 = _a.sent();
                        result.dnsAction = 'error';
                        result.dnsMessage = "DNS sync failed: ".concat(error_2.message);
                        // Don't fail the whole operation if DNS sync fails
                        console.error("[DomainKeeper] DNS sync error for ".concat(this.primaryDomain, ":"), error_2);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, result];
                    case 12:
                        error_3 = _a.sent();
                        result.action = 'error';
                        result.message = "Failed to sync production domain: ".concat(error_3.message);
                        console.error('[DomainKeeper] Production domain sync error:', error_3);
                        return [2 /*return*/, result];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sync staging domain (staging.dreamnet.ink)
     * Attaches as preview/alias domain
     */
    DomainKeeper.prototype.syncStagingDomain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, project, domain, error_4, listProjectDomains, domains, existing, dnsRecords, dnsResult, error_5, error_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.stagingDomain) {
                            return [2 /*return*/, null]; // Staging domain not configured
                        }
                        result = {
                            domain: this.stagingDomain,
                            action: 'skipped',
                            message: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 12, , 13]);
                        return [4 /*yield*/, (0, vercelClient_1.getProjectByName)(this.vercelProjectName)];
                    case 2:
                        project = _a.sent();
                        if (!project) {
                            result.action = 'error';
                            result.message = "Vercel project \"".concat(this.vercelProjectName, "\" not found");
                            return [2 /*return*/, result];
                        }
                        domain = void 0;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 7]);
                        return [4 /*yield*/, (0, vercelClient_1.ensureDomainAttached)(project.id, this.stagingDomain, false)];
                    case 4:
                        domain = _a.sent();
                        result.action = 'attached';
                        result.message = "Staging domain attached to project ".concat(project.name);
                        return [3 /*break*/, 7];
                    case 5:
                        error_4 = _a.sent();
                        listProjectDomains = require('../integrations/vercelClient').listProjectDomains;
                        return [4 /*yield*/, listProjectDomains(project.id)];
                    case 6:
                        domains = _a.sent();
                        existing = domains.find(function (d) { return d.name === _this.stagingDomain; });
                        if (existing) {
                            domain = existing;
                            result.action = 'already-attached';
                            result.message = "Staging domain already attached";
                        }
                        else {
                            throw error_4;
                        }
                        return [3 /*break*/, 7];
                    case 7:
                        _a.trys.push([7, 10, , 11]);
                        return [4 /*yield*/, (0, vercelClient_1.getVercelDnsRecords)(this.stagingDomain)];
                    case 8:
                        dnsRecords = _a.sent();
                        return [4 /*yield*/, this.syncDnsRecords(this.stagingDomain, dnsRecords)];
                    case 9:
                        dnsResult = _a.sent();
                        result.dnsAction = dnsResult.action;
                        result.dnsMessage = dnsResult.message;
                        return [3 /*break*/, 11];
                    case 10:
                        error_5 = _a.sent();
                        result.dnsAction = 'error';
                        result.dnsMessage = "DNS sync failed: ".concat(error_5.message);
                        console.error("[DomainKeeper] DNS sync error for ".concat(this.stagingDomain, ":"), error_5);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, result];
                    case 12:
                        error_6 = _a.sent();
                        result.action = 'error';
                        result.message = "Failed to sync staging domain: ".concat(error_6.message);
                        console.error('[DomainKeeper] Staging domain sync error:', error_6);
                        return [2 /*return*/, result];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sync DNS records for a domain
     */
    DomainKeeper.prototype.syncDnsRecords = function (domain, expectedRecords) {
        return __awaiter(this, void 0, void 0, function () {
            var actions, _i, expectedRecords_1, record, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (expectedRecords.length === 0) {
                            return [2 /*return*/, { action: 'skipped', message: 'No DNS records to sync' }];
                        }
                        actions = [];
                        _i = 0, expectedRecords_1 = expectedRecords;
                        _a.label = 1;
                    case 1:
                        if (!(_i < expectedRecords_1.length)) return [3 /*break*/, 9];
                        record = expectedRecords_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        if (!(record.type === 'A')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.dnsProvider.ensureARecord(record.name, record.value)];
                    case 3:
                        _a.sent();
                        actions.push("A record ".concat(record.name, " -> ").concat(record.value));
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(record.type === 'CNAME')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.dnsProvider.ensureCnameRecord(record.name, record.value)];
                    case 5:
                        _a.sent();
                        actions.push("CNAME ".concat(record.name, " -> ").concat(record.value));
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_7 = _a.sent();
                        console.error("[DomainKeeper] Failed to sync ".concat(record.type, " record for ").concat(record.name, ":"), error_7);
                        actions.push("ERROR: ".concat(record.type, " ").concat(record.name, " - ").concat(error_7.message));
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9:
                        if (actions.length > 0 && !actions.some(function (a) { return a.startsWith('ERROR'); })) {
                            return [2 /*return*/, { action: 'updated', message: actions.join('; ') }];
                        }
                        else if (actions.some(function (a) { return a.startsWith('ERROR'); })) {
                            return [2 /*return*/, { action: 'error', message: actions.join('; ') }];
                        }
                        else {
                            return [2 /*return*/, { action: 'already-correct', message: 'DNS records already correct' }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sync all domains (production + staging)
     */
    DomainKeeper.prototype.syncAllDomains = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, productionResult, stagingResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        return [4 /*yield*/, this.syncProductionDomain()];
                    case 1:
                        productionResult = _a.sent();
                        results.push(productionResult);
                        if (!this.stagingDomain) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.syncStagingDomain()];
                    case 2:
                        stagingResult = _a.sent();
                        if (stagingResult) {
                            results.push(stagingResult);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, results];
                }
            });
        });
    };
    return DomainKeeper;
}());
exports.DomainKeeper = DomainKeeper;
/**
 * Get DomainKeeper instance (singleton pattern)
 */
var domainKeeperInstance = null;
function getDomainKeeper() {
    if (!domainKeeperInstance) {
        var createDnsProvider = require('../integrations/cloudflareDns').createDnsProvider;
        var dnsProvider = createDnsProvider();
        domainKeeperInstance = new DomainKeeper(dnsProvider);
    }
    return domainKeeperInstance;
}
