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
var express_1 = require("express");
var KeymasterService_1 = require("../services/KeymasterService");
var LegalAgency_1 = require("../services/LegalAgency");
var router = (0, express_1.Router)();
/**
 * Keymaster & Legal Agency Routes
 * Auto-manages API keys and legal compliance
 */
// Get vault status
router.get('/vault/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var vaultStatus, legalStatus;
    return __generator(this, function (_a) {
        try {
            vaultStatus = KeymasterService_1.keymaster.getVaultStatus();
            legalStatus = LegalAgency_1.legalAgency.getAgencyStatus();
            res.json({
                keymaster: vaultStatus,
                legal: legalStatus,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Vault status error:', error);
            res.status(500).json({ error: 'Failed to get vault status' });
        }
        return [2 /*return*/];
    });
}); });
// Auto-inject API key for service
router.post('/vault/inject-key', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceName, key, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                serviceName = req.body.serviceName;
                if (!serviceName) {
                    return [2 /*return*/, res.status(400).json({ error: 'Service name required' })];
                }
                return [4 /*yield*/, KeymasterService_1.keymaster.injectKey(serviceName)];
            case 1:
                key = _a.sent();
                if (key) {
                    res.json({
                        success: true,
                        message: "Key auto-injected for ".concat(serviceName),
                        hasKey: true
                    });
                }
                else {
                    res.status(404).json({
                        success: false,
                        message: "No key available for ".concat(serviceName)
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Key injection error:', error_1);
                res.status(500).json({ error: 'Failed to inject key' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get auth headers for service
router.get('/vault/auth-headers/:serviceName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceName, headers;
    return __generator(this, function (_a) {
        try {
            serviceName = req.params.serviceName;
            headers = KeymasterService_1.keymaster.getAuthHeaders(serviceName);
            res.json({ headers: headers });
        }
        catch (error) {
            console.error('Auth headers error:', error);
            res.status(500).json({ error: 'Failed to get auth headers' });
        }
        return [2 /*return*/];
    });
}); });
// Check service key availability
router.get('/vault/check-service/:serviceName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceName, hasKeys;
    return __generator(this, function (_a) {
        try {
            serviceName = req.params.serviceName;
            hasKeys = KeymasterService_1.keymaster.hasRequiredKeys(serviceName);
            res.json({
                serviceName: serviceName,
                hasRequiredKeys: hasKeys,
                ready: hasKeys
            });
        }
        catch (error) {
            console.error('Service check error:', error);
            res.status(500).json({ error: 'Failed to check service' });
        }
        return [2 /*return*/];
    });
}); });
// Run compliance audit
router.post('/legal/audit', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var auditResults, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, LegalAgency_1.legalAgency.runComplianceAudit()];
            case 1:
                auditResults = _a.sent();
                res.json(auditResults);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Compliance audit error:', error_2);
                res.status(500).json({ error: 'Failed to run compliance audit' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get legal document
router.get('/legal/document/:type', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var type, document_1;
    return __generator(this, function (_a) {
        try {
            type = req.params.type;
            document_1 = LegalAgency_1.legalAgency.getLegalDocument(type);
            if (document_1) {
                res.json(document_1);
            }
            else {
                res.status(404).json({ error: 'Document not found' });
            }
        }
        catch (error) {
            console.error('Legal document error:', error);
            res.status(500).json({ error: 'Failed to get legal document' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
