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
var SecretManager_1 = require("../services/SecretManager");
var router = (0, express_1.Router)();
// Get all secret configurations (without actual secret values)
router.get('/secrets', function (req, res) {
    try {
        var secrets = SecretManager_1.secretManager.getAllSecrets();
        // Remove sensitive information before sending
        var safeSecrets = secrets.map(function (secret) { return ({
            name: secret.name,
            rotation: secret.rotation,
            location: secret.location,
            last_rotated: secret.last_rotated,
            next_rotation: secret.next_rotation,
            key_ids_active: secret.key_ids_active,
            current_key_id: secret.current_key_id
        }); });
        res.json({
            success: true,
            secrets: safeSecrets,
            count: safeSecrets.length,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔐 [Secrets] Error getting secrets:', error);
        res.status(500).json({ success: false, error: 'Failed to get secrets' });
    }
});
// Get specific secret configuration
router.get('/secrets/:secretName', function (req, res) {
    try {
        var secretName = req.params.secretName;
        var secret = SecretManager_1.secretManager.getSecretConfig(secretName);
        if (!secret) {
            return res.status(404).json({ success: false, error: 'Secret not found' });
        }
        // Remove sensitive information
        var safeSecret = {
            name: secret.name,
            rotation: secret.rotation,
            location: secret.location,
            last_rotated: secret.last_rotated,
            next_rotation: secret.next_rotation,
            key_ids_active: secret.key_ids_active,
            current_key_id: secret.current_key_id
        };
        res.json({
            success: true,
            secret: safeSecret,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔐 [Secrets] Error getting secret config:', error);
        res.status(500).json({ success: false, error: 'Failed to get secret configuration' });
    }
});
// Get rotation status for all secrets
router.get('/secrets/status/rotation', function (req, res) {
    try {
        var rotationStatus = SecretManager_1.secretManager.getRotationStatus();
        res.json({
            success: true,
            rotation_status: rotationStatus,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔐 [Secrets] Error getting rotation status:', error);
        res.status(500).json({ success: false, error: 'Failed to get rotation status' });
    }
});
// Validate all secrets are accessible
router.get('/secrets/status/validation', function (req, res) {
    try {
        var validation = SecretManager_1.secretManager.validateSecrets();
        var validCount = Object.values(validation).filter(function (valid) { return valid; }).length;
        var totalCount = Object.keys(validation).length;
        res.json({
            success: true,
            validation: validation,
            summary: {
                valid_secrets: validCount,
                total_secrets: totalCount,
                all_valid: validCount === totalCount
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔐 [Secrets] Error validating secrets:', error);
        res.status(500).json({ success: false, error: 'Failed to validate secrets' });
    }
});
// Force rotation of specific secret (admin only)
router.post('/secrets/:secretName/rotate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var secretName, secret, success, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                secretName = req.params.secretName;
                secret = SecretManager_1.secretManager.getSecretConfig(secretName);
                if (!secret) {
                    return [2 /*return*/, res.status(404).json({ success: false, error: 'Secret not found' })];
                }
                console.log("\uD83D\uDD04 [Secrets] Force rotation requested for ".concat(secretName));
                return [4 /*yield*/, SecretManager_1.secretManager.forceRotation(secretName)];
            case 1:
                success = _a.sent();
                if (success) {
                    res.json({
                        success: true,
                        message: "Rotation initiated for ".concat(secretName),
                        secret_name: secretName,
                        timestamp: new Date().toISOString()
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: "Failed to rotate ".concat(secretName)
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('🔐 [Secrets] Error forcing rotation:', error_1);
                res.status(500).json({ success: false, error: 'Failed to force rotation' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get SolOPS keys information (current key ID only, not actual keys)
router.get('/secrets/solops/info', function (req, res) {
    try {
        var solopsKeys = SecretManager_1.secretManager.getSolOPSKeys();
        // Only return metadata, never actual keys
        var keyInfo = solopsKeys.keys.map(function (key) { return ({
            key_id: key.key_id,
            created_at: key.created_at,
            expires_at: key.expires_at,
            active: key.active
        }); });
        res.json({
            success: true,
            current_key_id: solopsKeys.current_key_id,
            keys: keyInfo,
            active_key_count: keyInfo.filter(function (k) { return k.active; }).length,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔐 [Secrets] Error getting SolOPS info:', error);
        res.status(500).json({ success: false, error: 'Failed to get SolOPS information' });
    }
});
// Verify SolOPS signature (for testing)
router.post('/secrets/solops/verify', function (req, res) {
    try {
        var _a = req.body, signature = _a.signature, payload = _a.payload, key_id = _a.key_id;
        if (!signature || !payload) {
            return res.status(400).json({
                success: false,
                error: 'signature and payload are required'
            });
        }
        var isValid = SecretManager_1.secretManager.verifySolOPSSignature(signature, payload, key_id);
        res.json({
            success: true,
            valid: isValid,
            key_id: key_id || SecretManager_1.secretManager.getSolOPSKeys().current_key_id,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔐 [Secrets] Error verifying SolOPS signature:', error);
        res.status(500).json({ success: false, error: 'Failed to verify signature' });
    }
});
// Get secrets health summary
router.get('/secrets/health', function (req, res) {
    try {
        var validation = SecretManager_1.secretManager.validateSecrets();
        var rotationStatus = SecretManager_1.secretManager.getRotationStatus();
        var overallHealth = 'healthy';
        var criticalCount = 0;
        var warningCount = 0;
        for (var _i = 0, _a = Object.entries(rotationStatus); _i < _a.length; _i++) {
            var _b = _a[_i], secretName = _b[0], status_1 = _b[1];
            if (status_1.status === 'critical') {
                criticalCount++;
                overallHealth = 'critical';
            }
            else if (status_1.status === 'warning' && overallHealth !== 'critical') {
                warningCount++;
                overallHealth = 'warning';
            }
        }
        var validSecrets = Object.values(validation).filter(function (valid) { return valid; }).length;
        var totalSecrets = Object.keys(validation).length;
        res.json({
            success: true,
            health: {
                overall_status: overallHealth,
                secrets_valid: "".concat(validSecrets, "/").concat(totalSecrets),
                rotation_alerts: {
                    critical: criticalCount,
                    warning: warningCount,
                    healthy: totalSecrets - criticalCount - warningCount
                }
            },
            validation: validation,
            rotation_status: rotationStatus,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('🔐 [Secrets] Error getting health status:', error);
        res.status(500).json({ success: false, error: 'Failed to get secrets health' });
    }
});
exports.default = router;
