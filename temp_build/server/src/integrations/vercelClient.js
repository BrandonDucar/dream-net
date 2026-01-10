"use strict";
/**
 * Vercel API Client for Domain Management
 * Handles project domain attachment and configuration
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
exports.getProjectByName = getProjectByName;
exports.listProjectDomains = listProjectDomains;
exports.addProjectDomain = addProjectDomain;
exports.removeProjectDomain = removeProjectDomain;
exports.ensureDomainAttached = ensureDomainAttached;
exports.getVercelDnsRecords = getVercelDnsRecords;
var VERCEL_API_BASE = 'https://api.vercel.com';
function makeVercelRequest(path_1) {
    return __awaiter(this, arguments, void 0, function (path, options) {
        var token, teamId, url, response, error;
        var _a;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    token = process.env.VERCEL_TOKEN;
                    if (!token) {
                        throw new Error('VERCEL_TOKEN not configured');
                    }
                    teamId = process.env.VERCEL_TEAM_ID;
                    url = teamId
                        ? "".concat(VERCEL_API_BASE).concat(path).concat(path.includes('?') ? '&' : '?', "teamId=").concat(teamId)
                        : "".concat(VERCEL_API_BASE).concat(path);
                    return [4 /*yield*/, fetch(url, __assign(__assign({}, options), { headers: __assign({ 'Authorization': "Bearer ".concat(token), 'Content-Type': 'application/json' }, options.headers) }))];
                case 1:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json().catch(function () { return ({ message: response.statusText }); })];
                case 2:
                    error = _b.sent();
                    throw new Error("Vercel API error: ".concat(response.status, " - ").concat(error.message || ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'));
                case 3: return [2 /*return*/, response.json()];
            }
        });
    });
}
/**
 * Get project by name
 */
function getProjectByName(name) {
    return __awaiter(this, void 0, void 0, function () {
        var data, projects, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, makeVercelRequest('/v9/projects')];
                case 1:
                    data = _a.sent();
                    projects = data.projects;
                    return [2 /*return*/, projects.find(function (p) { return p.name === name; }) || null];
                case 2:
                    error_1 = _a.sent();
                    console.error('[VercelClient] Error getting project:', error_1.message);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * List all domains attached to a project
 */
function listProjectDomains(projectId) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, makeVercelRequest("/v9/projects/".concat(projectId, "/domains"))];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, (data.domains || [])];
                case 2:
                    error_2 = _a.sent();
                    console.error('[VercelClient] Error listing domains:', error_2.message);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Add a domain to a project
 */
function addProjectDomain(projectId, domain, options) {
    return __awaiter(this, void 0, void 0, function () {
        var body, data, error_3, domains, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 5]);
                    body = { name: domain };
                    if (options === null || options === void 0 ? void 0 : options.gitBranch)
                        body.gitBranch = options.gitBranch;
                    if (options === null || options === void 0 ? void 0 : options.redirect)
                        body.redirect = options.redirect;
                    if (options === null || options === void 0 ? void 0 : options.redirectStatusCode)
                        body.redirectStatusCode = options.redirectStatusCode;
                    return [4 /*yield*/, makeVercelRequest("/v9/projects/".concat(projectId, "/domains"), {
                            method: 'POST',
                            body: JSON.stringify(body),
                        })];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 2:
                    error_3 = _a.sent();
                    if (!(error_3.message.includes('already exists') || error_3.message.includes('409'))) return [3 /*break*/, 4];
                    return [4 /*yield*/, listProjectDomains(projectId)];
                case 3:
                    domains = _a.sent();
                    existing = domains.find(function (d) { return d.name === domain; });
                    if (existing)
                        return [2 /*return*/, existing];
                    _a.label = 4;
                case 4:
                    console.error('[VercelClient] Error adding domain:', error_3.message);
                    throw error_3;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Remove a domain from a project
 */
function removeProjectDomain(projectId, domain) {
    return __awaiter(this, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, makeVercelRequest("/v9/projects/".concat(projectId, "/domains/").concat(encodeURIComponent(domain)), {
                            method: 'DELETE',
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    // If domain doesn't exist, that's okay
                    if (error_4.message.includes('404') || error_4.message.includes('not found')) {
                        return [2 /*return*/];
                    }
                    console.error('[VercelClient] Error removing domain:', error_4.message);
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get project domain configuration
 * Vercel doesn't have a direct "set primary domain" API, but we can ensure
 * the domain is attached and verified
 */
function ensureDomainAttached(projectId_1, domain_1) {
    return __awaiter(this, arguments, void 0, function (projectId, domain, isProduction) {
        var domains, existing;
        if (isProduction === void 0) { isProduction = true; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, listProjectDomains(projectId)];
                case 1:
                    domains = _a.sent();
                    existing = domains.find(function (d) { return d.name === domain; });
                    if (existing) {
                        // Domain already attached
                        return [2 /*return*/, existing];
                    }
                    return [4 /*yield*/, addProjectDomain(projectId, domain, {
                            gitBranch: isProduction ? undefined : 'main', // Production uses default branch
                        })];
                case 2: 
                // Add domain
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Get Vercel's expected DNS records for a domain
 * Vercel uses CNAME records for subdomains and CNAME flattening for apex domains
 */
function getVercelDnsRecords(domain) {
    return __awaiter(this, void 0, void 0, function () {
        var parts, isApex, subdomain;
        return __generator(this, function (_a) {
            parts = domain.split('.');
            isApex = parts.length === 2;
            if (isApex) {
                // Apex domain - Vercel uses CNAME flattening (CNAME record at root)
                // Most DNS providers support CNAME flattening, but some require A records
                // We'll use CNAME as primary, which works with Cloudflare and most modern DNS providers
                return [2 /*return*/, [
                        {
                            type: 'CNAME',
                            name: '@',
                            value: 'cname.vercel-dns.com',
                        },
                    ]];
            }
            else {
                subdomain = parts[0];
                return [2 /*return*/, [
                        {
                            type: 'CNAME',
                            name: subdomain,
                            value: 'cname.vercel-dns.com',
                        },
                    ]];
            }
            return [2 /*return*/];
        });
    });
}
