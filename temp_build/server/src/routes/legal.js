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
exports.legalRouter = void 0;
var express_1 = require("express");
var legal_agent_1 = require("../services/legal-agent");
var router = (0, express_1.Router)();
exports.legalRouter = router;
// Get protection summary
router.get('/api/legal/protection-summary', function (req, res) {
    try {
        var summary = legal_agent_1.legalAgent.getProtectionSummary();
        res.json(summary);
    }
    catch (error) {
        console.error('Error getting protection summary:', error);
        res.status(500).json({ error: 'Failed to get protection summary' });
    }
});
// Get IP portfolio
router.get('/api/legal/ip-portfolio', function (req, res) {
    try {
        var portfolio = legal_agent_1.legalAgent.getIPPortfolio();
        res.json(portfolio);
    }
    catch (error) {
        console.error('Error getting IP portfolio:', error);
        res.status(500).json({ error: 'Failed to get IP portfolio' });
    }
});
// Get trade secrets
router.get('/api/legal/trade-secrets', function (req, res) {
    try {
        var tradeSecrets = legal_agent_1.legalAgent.getTradeSecrets();
        res.json(tradeSecrets);
    }
    catch (error) {
        console.error('Error getting trade secrets:', error);
        res.status(500).json({ error: 'Failed to get trade secrets' });
    }
});
// File patent application
router.post('/api/legal/file-patent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ipId, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ipId = req.body.ipId;
                if (!ipId) {
                    return [2 /*return*/, res.status(400).json({ error: 'IP ID is required' })];
                }
                return [4 /*yield*/, legal_agent_1.legalAgent.filePatent(ipId)];
            case 1:
                result = _a.sent();
                if (result.success) {
                    res.json(result);
                }
                else {
                    res.status(400).json(result);
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error filing patent:', error_1);
                res.status(500).json({ error: 'Failed to file patent' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get compliance status
router.get('/api/legal/compliance', function (req, res) {
    try {
        var compliance = legal_agent_1.legalAgent.getComplianceStatus();
        res.json(compliance);
    }
    catch (error) {
        console.error('Error getting compliance status:', error);
        res.status(500).json({ error: 'Failed to get compliance status' });
    }
});
// Generate legal document
router.post('/api/legal/generate-document', function (req, res) {
    try {
        var _a = req.body, type = _a.type, params = _a.params;
        if (!type) {
            return res.status(400).json({ error: 'Document type is required' });
        }
        var document_1 = legal_agent_1.legalAgent.generateDocument(type, params || {});
        if (document_1.error) {
            return res.status(400).json(document_1);
        }
        res.json(document_1);
    }
    catch (error) {
        console.error('Error generating document:', error);
        res.status(500).json({ error: 'Failed to generate document' });
    }
});
// Perform compliance check
router.get('/api/legal/compliance-check', function (req, res) {
    try {
        var complianceCheck = legal_agent_1.legalAgent.performComplianceCheck();
        res.json(complianceCheck);
    }
    catch (error) {
        console.error('Error performing compliance check:', error);
        res.status(500).json({ error: 'Failed to perform compliance check' });
    }
});
// Check Sweet Spot compliance for legal operations
router.get('/api/legal/sweet-spot-status', function (req, res) {
    try {
        var isCompliant = legal_agent_1.legalAgent.checkSweetSpotCompliance();
        res.json({
            sweetSpotCompliant: isCompliant,
            legalAgentStatus: 'active',
            resourceUsage: {
                memory: 12,
                cpu: 15,
                agentSlot: '1 of 24'
            },
            functionalCapabilities: [
                'IP Portfolio Management',
                'Trade Secret Protection',
                'Patent Filing',
                'Compliance Monitoring',
                'Legal Document Generation',
                'Automated Risk Assessment'
            ]
        });
    }
    catch (error) {
        console.error('Error checking sweet spot status:', error);
        res.status(500).json({ error: 'Failed to check sweet spot status' });
    }
});
