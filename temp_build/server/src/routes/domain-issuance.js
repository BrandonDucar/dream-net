"use strict";
/**
 * Domain Issuance API
 *
 * Endpoints for issuing and managing .dream and .sheep domains
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
var express_1 = require("express");
var domain_issuance_core_1 = require("../../packages/domain-issuance-core");
var router = (0, express_1.Router)();
// POST /api/domains/issue/dream - Issue a .dream domain
router.post('/issue/dream', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, passportId, walletAddress, requestedName, tier, domain;
    return __generator(this, function (_b) {
        try {
            _a = req.body, passportId = _a.passportId, walletAddress = _a.walletAddress, requestedName = _a.requestedName, tier = _a.tier;
            if (!passportId || !walletAddress) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Missing required fields',
                        required: ['passportId', 'walletAddress'],
                    })];
            }
            domain = (0, domain_issuance_core_1.issueDreamDomain)({
                passportId: passportId,
                walletAddress: walletAddress,
                requestedName: requestedName,
                tier: tier,
            });
            res.json({
                success: true,
                domain: domain,
                message: "Domain ".concat(domain.domain, " issued successfully"),
            });
        }
        catch (error) {
            res.status(400).json({
                error: 'Failed to issue domain',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
// POST /api/domains/issue/sheep - Issue a .sheep domain
router.post('/issue/sheep', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, passportId, walletAddress, requestedName, tier, domain;
    return __generator(this, function (_b) {
        try {
            _a = req.body, passportId = _a.passportId, walletAddress = _a.walletAddress, requestedName = _a.requestedName, tier = _a.tier;
            if (!passportId || !walletAddress) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Missing required fields',
                        required: ['passportId', 'walletAddress'],
                    })];
            }
            domain = (0, domain_issuance_core_1.issueSheepDomain)({
                passportId: passportId,
                walletAddress: walletAddress,
                requestedName: requestedName,
                tier: tier,
            });
            res.json({
                success: true,
                domain: domain,
                message: "Domain ".concat(domain.domain, " issued successfully"),
            });
        }
        catch (error) {
            res.status(400).json({
                error: 'Failed to issue domain',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/domains/resolve/:domain - Resolve domain to passport/wallet
router.get('/resolve/:domain', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var domain, resolved;
    return __generator(this, function (_a) {
        try {
            domain = req.params.domain;
            resolved = (0, domain_issuance_core_1.resolveDomain)(domain);
            if (!resolved) {
                return [2 /*return*/, res.status(404).json({
                        error: 'Domain not found',
                        domain: domain,
                    })];
            }
            res.json(__assign({ success: true, domain: domain }, resolved));
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to resolve domain',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/domains/passport/:passportId - Get all domains for a passport
router.get('/passport/:passportId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var passportId, domains;
    return __generator(this, function (_a) {
        try {
            passportId = req.params.passportId;
            domains = (0, domain_issuance_core_1.getDomainsForPassport)(passportId);
            res.json({
                success: true,
                passportId: passportId,
                domains: domains,
                count: domains.length,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to get domains',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/domains/wallet/:walletAddress - Get all domains for a wallet
router.get('/wallet/:walletAddress', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, domains;
    return __generator(this, function (_a) {
        try {
            walletAddress = req.params.walletAddress;
            domains = (0, domain_issuance_core_1.getDomainsForWallet)(walletAddress);
            res.json({
                success: true,
                walletAddress: walletAddress,
                domains: domains,
                count: domains.length,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to get domains',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
// POST /api/domains/link - Link external domain to .dream domain
router.post('/link', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, dreamDomain, externalDomain;
    return __generator(this, function (_b) {
        try {
            _a = req.body, dreamDomain = _a.dreamDomain, externalDomain = _a.externalDomain;
            if (!dreamDomain || !externalDomain) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Missing required fields',
                        required: ['dreamDomain', 'externalDomain'],
                    })];
            }
            (0, domain_issuance_core_1.linkExternalDomain)(dreamDomain, externalDomain);
            res.json({
                success: true,
                message: "Linked ".concat(externalDomain, " \u2192 ").concat(dreamDomain),
            });
        }
        catch (error) {
            res.status(400).json({
                error: 'Failed to link domain',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/domains/list - List all issued domains (admin)
router.get('/list', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var domains;
    return __generator(this, function (_a) {
        try {
            domains = (0, domain_issuance_core_1.listAllDomains)();
            res.json({
                success: true,
                domains: domains,
                count: domains.length,
            });
        }
        catch (error) {
            res.status(500).json({
                error: 'Failed to list domains',
                message: error.message,
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
