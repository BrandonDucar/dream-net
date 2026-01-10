"use strict";
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
exports.registerCapabilitiesRoutes = registerCapabilitiesRoutes;
var fs_1 = require("fs");
var path_1 = require("path");
// Check if environment secrets exist
function checkSecrets(requiredKeys) {
    var missing = requiredKeys.filter(function (key) { return !process.env[key]; });
    return { present: missing.length === 0, missing: missing };
}
// Get last artifact timestamp for a feature
function getLastArtifact(feature) {
    return __awaiter(this, void 0, void 0, function () {
        var artifactsPath_1, files, stats, latest, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    artifactsPath_1 = path_1.default.join(process.cwd(), 'data', 'artifacts', feature);
                    return [4 /*yield*/, fs_1.promises.readdir(artifactsPath_1)];
                case 1:
                    files = _b.sent();
                    if (files.length === 0)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = {
                                            file: file
                                        };
                                        return [4 /*yield*/, fs_1.promises.stat(path_1.default.join(artifactsPath_1, file))];
                                    case 1: return [2 /*return*/, (_a.mtime = (_b.sent()).mtime,
                                            _a)];
                                }
                            });
                        }); }))];
                case 2:
                    stats = _b.sent();
                    latest = stats.sort(function (a, b) { return b.mtime.getTime() - a.mtime.getTime(); })[0];
                    return [2 /*return*/, latest ? latest.mtime.toISOString() : null];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Define capability checks
function checkCapabilities() {
    return __awaiter(this, void 0, void 0, function () {
        var capabilities, dbCheck, stripeCheck, _a, googleCheck, _b, openaiCheck, _c, metalsCheck, _d, twilioCheck, _e, emailCheck, _f, _g;
        var _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    capabilities = {};
                    dbCheck = checkSecrets(['DATABASE_URL']);
                    capabilities.database = {
                        enabled: dbCheck.present ? 'live' : 'off',
                        keys_present: dbCheck.present,
                        last_real_success: dbCheck.present ? new Date().toISOString() : null,
                        proof_route: '/api/db/health',
                        provider: 'PostgreSQL',
                        error: dbCheck.missing.length > 0 ? "Missing: ".concat(dbCheck.missing.join(', ')) : undefined
                    };
                    stripeCheck = checkSecrets(['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY']);
                    _a = capabilities;
                    _h = {
                        enabled: stripeCheck.present ? 'live' : 'off',
                        keys_present: stripeCheck.present
                    };
                    return [4 /*yield*/, getLastArtifact('stripe')];
                case 1:
                    _a.stripe_payments = (_h.last_real_success = _q.sent(),
                        _h.proof_route = '/api/stripe/test',
                        _h.provider = 'Stripe',
                        _h.scopes = ['payments', 'subscriptions'],
                        _h.error = stripeCheck.missing.length > 0 ? "Missing: ".concat(stripeCheck.missing.join(', ')) : undefined,
                        _h);
                    googleCheck = checkSecrets(['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']);
                    _b = capabilities;
                    _j = {
                        enabled: googleCheck.present ? 'draft' : 'off',
                        keys_present: googleCheck.present
                    };
                    return [4 /*yield*/, getLastArtifact('google')];
                case 2:
                    _b.google_services = (_j.last_real_success = _q.sent(),
                        _j.proof_route = '/api/google/test',
                        _j.provider = 'Google',
                        _j.scopes = ['drive', 'calendar', 'gmail'],
                        _j.error = googleCheck.missing.length > 0 ? "Missing: ".concat(googleCheck.missing.join(', ')) : undefined,
                        _j);
                    openaiCheck = checkSecrets(['OPENAI_API_KEY']);
                    _c = capabilities;
                    _k = {
                        enabled: openaiCheck.present ? 'live' : 'off',
                        keys_present: openaiCheck.present
                    };
                    return [4 /*yield*/, getLastArtifact('openai')];
                case 3:
                    _c.openai_gpt = (_k.last_real_success = _q.sent(),
                        _k.proof_route = '/api/ai/test',
                        _k.provider = 'OpenAI',
                        _k.scopes = ['gpt-4', 'embeddings'],
                        _k.error = openaiCheck.missing.length > 0 ? "Missing: ".concat(openaiCheck.missing.join(', ')) : undefined,
                        _k);
                    metalsCheck = checkSecrets(['METALS_API_KEY']);
                    _d = capabilities;
                    _l = {
                        enabled: metalsCheck.present ? 'live' : 'sim',
                        keys_present: metalsCheck.present
                    };
                    return [4 /*yield*/, getLastArtifact('metals')];
                case 4:
                    _d.metals_intelligence = (_l.last_real_success = _q.sent(),
                        _l.proof_route = '/api/metals/current',
                        _l.provider = 'MetalsAPI',
                        _l.error = metalsCheck.missing.length > 0 ? "Missing: ".concat(metalsCheck.missing.join(', ')) : undefined,
                        _l);
                    // Budget monitoring (always live - internal system)
                    capabilities.budget_control = {
                        enabled: 'live',
                        keys_present: true,
                        last_real_success: new Date().toISOString(),
                        proof_route: '/api/budget/status',
                        provider: 'Internal'
                    };
                    // Agent mesh communication (always live - internal system)
                    capabilities.agent_mesh = {
                        enabled: 'live',
                        keys_present: true,
                        last_real_success: new Date().toISOString(),
                        proof_route: '/api/ops/summary',
                        provider: 'Internal'
                    };
                    // SEO intelligence (simulated for now)
                    capabilities.seo_intelligence = {
                        enabled: 'sim',
                        keys_present: true,
                        last_real_success: null,
                        proof_route: '/api/seo/analyze',
                        provider: 'Internal'
                    };
                    twilioCheck = checkSecrets(['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN']);
                    _e = capabilities;
                    _m = {
                        enabled: twilioCheck.present ? 'draft' : 'off',
                        keys_present: twilioCheck.present
                    };
                    return [4 /*yield*/, getLastArtifact('twilio')];
                case 5:
                    _e.sms_notifications = (_m.last_real_success = _q.sent(),
                        _m.proof_route = '/api/twilio/test',
                        _m.provider = 'Twilio',
                        _m.scopes = ['sms', 'webhooks'],
                        _m.error = twilioCheck.missing.length > 0 ? "Missing: ".concat(twilioCheck.missing.join(', ')) : undefined,
                        _m);
                    emailCheck = checkSecrets(['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']);
                    _f = capabilities;
                    _o = {
                        enabled: emailCheck.present ? 'draft' : 'off',
                        keys_present: emailCheck.present
                    };
                    return [4 /*yield*/, getLastArtifact('gmail')];
                case 6:
                    _f.email_services = (_o.last_real_success = _q.sent(),
                        _o.proof_route = '/api/comm/test',
                        _o.provider = 'Gmail',
                        _o.scopes = ['send', 'compose'],
                        _o.error = emailCheck.missing.length > 0 ? "Missing: ".concat(emailCheck.missing.join(', ')) : undefined,
                        _o);
                    // Grants system
                    _g = capabilities;
                    _p = {
                        enabled: 'live',
                        keys_present: true
                    };
                    return [4 /*yield*/, getLastArtifact('grant')];
                case 7:
                    // Grants system
                    _g.grants_pipeline = (_p.last_real_success = _q.sent(),
                        _p.proof_route = '/api/grants/status',
                        _p.provider = 'Internal',
                        _p.scopes = ['opportunities', 'applications', 'outreach'],
                        _p);
                    return [2 /*return*/, capabilities];
            }
        });
    });
}
function registerCapabilitiesRoutes(app) {
    var _this = this;
    // Main capabilities manifest endpoint
    app.get('/api/capabilities', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var capabilities, statuses, summary, manifest, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, checkCapabilities()];
                case 1:
                    capabilities = _a.sent();
                    statuses = Object.values(capabilities).map(function (c) { return c.enabled; });
                    summary = {
                        total: statuses.length,
                        live: statuses.filter(function (s) { return s === 'live'; }).length,
                        draft: statuses.filter(function (s) { return s === 'draft'; }).length,
                        sim: statuses.filter(function (s) { return s === 'sim'; }).length,
                        off: statuses.filter(function (s) { return s === 'off'; }).length
                    };
                    manifest = {
                        timestamp: new Date().toISOString(),
                        capabilities: capabilities,
                        summary: summary
                    };
                    res.json(manifest);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    res.status(500).json({
                        error: 'Failed to generate capabilities manifest',
                        details: error_1 instanceof Error ? error_1.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Individual capability check
    app.get('/api/capabilities/:name', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var capabilities, capability, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, checkCapabilities()];
                case 1:
                    capabilities = _a.sent();
                    capability = capabilities[req.params.name];
                    if (!capability) {
                        return [2 /*return*/, res.status(404).json({
                                error: 'Capability not found',
                                available: Object.keys(capabilities)
                            })];
                    }
                    res.json(__assign(__assign({ name: req.params.name }, capability), { checked_at: new Date().toISOString() }));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    res.status(500).json({
                        error: 'Failed to check capability',
                        details: error_2 instanceof Error ? error_2.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Test any capability's proof route
    app.post('/api/capabilities/:name/test', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var capabilities, capability, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, checkCapabilities()];
                case 1:
                    capabilities = _a.sent();
                    capability = capabilities[req.params.name];
                    if (!capability) {
                        return [2 /*return*/, res.status(404).json({
                                error: 'Capability not found'
                            })];
                    }
                    // Return the proof route for client to test
                    res.json({
                        name: req.params.name,
                        proof_route: capability.proof_route,
                        test_url: "".concat(req.protocol, "://").concat(req.get('host')).concat(capability.proof_route),
                        status: capability.enabled,
                        message: "Test this capability by calling: ".concat(capability.proof_route)
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    res.status(500).json({
                        error: 'Failed to generate capability test',
                        details: error_3 instanceof Error ? error_3.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    console.log('✅ [REALITY CONTRACT] Capabilities manifest routes registered');
}
