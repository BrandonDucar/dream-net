"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDomainAllowlist = exports.DomainAllowlist = void 0;
var url_1 = require("url");
// Default allowed domains for DreamNet Browser Agent
var DEFAULT_ALLOWED_DOMAINS = new Set([
    'dreamnet.ink',
    'api.dreamnet.ink',
    'vercel.app',
    'github.com',
    'twitter.com',
    'x.com',
    'google.com',
    'example.com' // For testing
]);
var DomainAllowlist = /** @class */ (function () {
    function DomainAllowlist(initialDomains) {
        if (initialDomains === void 0) { initialDomains = []; }
        this.allowedDomains = new Set(__spreadArray(__spreadArray([], DEFAULT_ALLOWED_DOMAINS, true), initialDomains, true));
    }
    /**
     * Check if a URL is allowed
     */
    DomainAllowlist.prototype.isAllowed = function (urlStr) {
        try {
            var url = new url_1.URL(urlStr);
            var hostname = url.hostname;
            // Check exact match
            if (this.allowedDomains.has(hostname)) {
                return { allowed: true };
            }
            // Check wildcard subdomains (e.g., *.dreamnet.ink)
            // This is a simplified check. For production, we might want more robust wildcard handling.
            for (var _i = 0, _a = this.allowedDomains; _i < _a.length; _i++) {
                var domain = _a[_i];
                if (hostname.endsWith('.' + domain)) {
                    return { allowed: true };
                }
            }
            return { allowed: false, reason: "Domain '".concat(hostname, "' is not in the allowlist.") };
        }
        catch (error) {
            return { allowed: false, reason: 'Invalid URL format.' };
        }
    };
    /**
     * Add a domain to the allowlist
     */
    DomainAllowlist.prototype.addDomain = function (domain) {
        this.allowedDomains.add(domain);
    };
    /**
     * Remove a domain from the allowlist
     */
    DomainAllowlist.prototype.removeDomain = function (domain) {
        this.allowedDomains.delete(domain);
    };
    /**
     * Get all allowed domains
     */
    DomainAllowlist.prototype.getDomains = function () {
        return Array.from(this.allowedDomains);
    };
    return DomainAllowlist;
}());
exports.DomainAllowlist = DomainAllowlist;
exports.defaultDomainAllowlist = new DomainAllowlist();
