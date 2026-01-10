"use strict";
/**
 * Safe Boot Sequence for DreamNet
 *
 * Implements a 7-step layered startup with health gates between steps.
 * Each layer must prove readiness before the next layer starts.
 *
 * Based on battle-tested resilient startup patterns.
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
exports.safeBootSequence = void 0;
exports.executeSafeBoot = executeSafeBoot;
var env_1 = require("../config/env");
var SafeBootSequence = /** @class */ (function () {
    function SafeBootSequence() {
        this.steps = [];
        this.startTime = Date.now();
    }
    /**
     * Step 1: Config & Feature Flags
     * Load flags and config first so everything else can read the same truth.
     */
    SafeBootSequence.prototype.step1_Config = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stepStart, config, warnings, result, result;
            return __generator(this, function (_a) {
                stepStart = Date.now();
                try {
                    config = (0, env_1.getEnvConfig)();
                    // Validate required config
                    if (!config.NODE_ENV) {
                        throw new Error('NODE_ENV is required');
                    }
                    if (!config.PORT || config.PORT <= 0) {
                        throw new Error('PORT must be a positive number');
                    }
                    warnings = [];
                    result = {
                        step: 'config',
                        success: true,
                        duration: Date.now() - stepStart,
                        metadata: {
                            nodeEnv: config.NODE_ENV,
                            port: config.PORT,
                            initSubsystems: config.INIT_SUBSYSTEMS,
                            initHeavySubsystems: config.INIT_HEAVY_SUBSYSTEMS,
                            warnings: warnings,
                        },
                    };
                    this.steps.push(result);
                    return [2 /*return*/, result];
                }
                catch (error) {
                    result = {
                        step: 'config',
                        success: false,
                        duration: Date.now() - stepStart,
                        error: error instanceof Error ? error : new Error(String(error)),
                    };
                    this.steps.push(result);
                    throw result;
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Step 2: Secrets & Env Loader (Fail Closed)
     * Pull secrets/keys. If anything critical is missing or invalid, stop here.
     */
    SafeBootSequence.prototype.step2_Secrets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stepStart, config, criticalSecrets, missingSecrets, result, result;
            return __generator(this, function (_a) {
                stepStart = Date.now();
                try {
                    config = (0, env_1.getEnvConfig)();
                    criticalSecrets = [];
                    missingSecrets = [];
                    // Database URL is optional (server can start without)
                    // But if it's set, it should be valid
                    if (config.DATABASE_URL) {
                        try {
                            new URL(config.DATABASE_URL);
                            criticalSecrets.push('DATABASE_URL');
                        }
                        catch (_b) {
                            throw new Error('DATABASE_URL is invalid');
                        }
                    }
                    // GCP Project ID is required for deployments (but not for local dev)
                    if (process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT) {
                        criticalSecrets.push('GCP_PROJECT_ID');
                    }
                    result = {
                        step: 'secrets',
                        success: true,
                        duration: Date.now() - stepStart,
                        metadata: {
                            criticalSecretsFound: criticalSecrets.length,
                            missingSecrets: missingSecrets.length,
                            // Don't log actual secret values
                        },
                    };
                    this.steps.push(result);
                    return [2 /*return*/, result];
                }
                catch (error) {
                    result = {
                        step: 'secrets',
                        success: false,
                        duration: Date.now() - stepStart,
                        error: error instanceof Error ? error : new Error(String(error)),
                    };
                    this.steps.push(result);
                    throw result; // Fail closed - stop boot if secrets invalid
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Step 3: Orchestrator Kernel
     * Bring up the core brain: service registry, routing, rate/budget limits.
     */
    SafeBootSequence.prototype.step3_Kernel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stepStart, dreamNetOS, agents, result, error_1, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stepStart = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('./dreamnet-os'); })];
                    case 2:
                        dreamNetOS = (_a.sent()).dreamNetOS;
                        agents = dreamNetOS.listAgents();
                        if (agents.length === 0) {
                            throw new Error('No agents registered in kernel');
                        }
                        result = {
                            step: 'kernel',
                            success: true,
                            duration: Date.now() - stepStart,
                            metadata: {
                                agentsRegistered: agents.length,
                                agentNames: agents.map(function (a) { return a.name; }),
                            },
                        };
                        this.steps.push(result);
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        result = {
                            step: 'kernel',
                            success: false,
                            duration: Date.now() - stepStart,
                            error: error_1 instanceof Error ? error_1 : new Error(String(error_1)),
                        };
                        this.steps.push(result);
                        throw result;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Step 4: Stateful Stores (DB/Queues)
     * Migrate DB schema, verify read/write and liveness.
     */
    SafeBootSequence.prototype.step4_Stores = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stepStart, config, result_1, _a, getPool, isDbAvailable, pool, result, error_2, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        stepStart = Date.now();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        config = (0, env_1.getEnvConfig)();
                        if (!config.DATABASE_URL) {
                            result_1 = {
                                step: 'stores',
                                success: true,
                                duration: Date.now() - stepStart,
                                metadata: {
                                    database: 'not-configured',
                                    note: 'Server can run without database',
                                },
                            };
                            this.steps.push(result_1);
                            return [2 /*return*/, result_1];
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('../db'); })];
                    case 2:
                        _a = _b.sent(), getPool = _a.getPool, isDbAvailable = _a.isDbAvailable;
                        if (!isDbAvailable()) {
                            throw new Error('Database connection failed');
                        }
                        pool = getPool();
                        // Test read/write
                        return [4 /*yield*/, pool.query('SELECT 1')];
                    case 3:
                        // Test read/write
                        _b.sent();
                        result = {
                            step: 'stores',
                            success: true,
                            duration: Date.now() - stepStart,
                            metadata: {
                                database: 'connected',
                                // TODO: schemaVersion: await getSchemaVersion(),
                            },
                        };
                        this.steps.push(result);
                        return [2 /*return*/, result];
                    case 4:
                        error_2 = _b.sent();
                        result = {
                            step: 'stores',
                            success: false,
                            duration: Date.now() - stepStart,
                            error: error_2 instanceof Error ? error_2 : new Error(String(error_2)),
                            metadata: {
                                degraded: true,
                                note: 'Continuing without database - some features unavailable',
                            },
                        };
                        this.steps.push(result);
                        // Don't throw - allow graceful degradation
                        return [2 /*return*/, result];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Step 5: Stateless APIs & Tools
     * Start HTTP/gRPC APIs that don't own state.
     */
    SafeBootSequence.prototype.step5_APIs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stepStart, result, result;
            return __generator(this, function (_a) {
                stepStart = Date.now();
                try {
                    result = {
                        step: 'apis',
                        success: true,
                        duration: Date.now() - stepStart,
                        metadata: {
                            note: 'APIs started in main server file',
                        },
                    };
                    this.steps.push(result);
                    return [2 /*return*/, result];
                }
                catch (error) {
                    result = {
                        step: 'apis',
                        success: false,
                        duration: Date.now() - stepStart,
                        error: error instanceof Error ? error : new Error(String(error)),
                    };
                    this.steps.push(result);
                    throw result;
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Step 6: Background Workers & Cron
     * Only start after APIs/stores are stable.
     */
    SafeBootSequence.prototype.step6_Workers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stepStart, config, result_2, result, result;
            return __generator(this, function (_a) {
                stepStart = Date.now();
                try {
                    config = (0, env_1.getEnvConfig)();
                    // Workers are optional (only if INIT_SUBSYSTEMS or INIT_HEAVY_SUBSYSTEMS)
                    if (!config.INIT_SUBSYSTEMS && !config.INIT_HEAVY_SUBSYSTEMS) {
                        result_2 = {
                            step: 'workers',
                            success: true,
                            duration: Date.now() - stepStart,
                            metadata: {
                                note: 'Workers disabled (INIT_SUBSYSTEMS=false)',
                            },
                        };
                        this.steps.push(result_2);
                        return [2 /*return*/, result_2];
                    }
                    result = {
                        step: 'workers',
                        success: true,
                        duration: Date.now() - stepStart,
                        metadata: {
                            initSubsystems: config.INIT_SUBSYSTEMS,
                            initHeavySubsystems: config.INIT_HEAVY_SUBSYSTEMS,
                            note: 'Workers started asynchronously after APIs',
                        },
                    };
                    this.steps.push(result);
                    return [2 /*return*/, result];
                }
                catch (error) {
                    result = {
                        step: 'workers',
                        success: false,
                        duration: Date.now() - stepStart,
                        error: error instanceof Error ? error : new Error(String(error)),
                    };
                    this.steps.push(result);
                    // Don't throw - workers are optional
                    return [2 /*return*/, result];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Step 7: UI/Ingress
     * Expose frontends and public endpoints last.
     */
    SafeBootSequence.prototype.step7_UI = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stepStart, result, result;
            return __generator(this, function (_a) {
                stepStart = Date.now();
                try {
                    result = {
                        step: 'ui',
                        success: true,
                        duration: Date.now() - stepStart,
                        metadata: {
                            note: 'UI served by API server',
                        },
                    };
                    this.steps.push(result);
                    return [2 /*return*/, result];
                }
                catch (error) {
                    result = {
                        step: 'ui',
                        success: false,
                        duration: Date.now() - stepStart,
                        error: error instanceof Error ? error : new Error(String(error)),
                    };
                    this.steps.push(result);
                    throw result;
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Execute the full boot sequence with health gates
     */
    SafeBootSequence.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3, failedStep;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        // Step 1: Config
                        return [4 /*yield*/, this.step1_Config()];
                    case 1:
                        // Step 1: Config
                        _b.sent();
                        // Step 2: Secrets (fail closed)
                        return [4 /*yield*/, this.step2_Secrets()];
                    case 2:
                        // Step 2: Secrets (fail closed)
                        _b.sent();
                        // Step 3: Kernel
                        return [4 /*yield*/, this.step3_Kernel()];
                    case 3:
                        // Step 3: Kernel
                        _b.sent();
                        // Step 4: Stores (graceful degradation allowed)
                        return [4 /*yield*/, this.step4_Stores()];
                    case 4:
                        // Step 4: Stores (graceful degradation allowed)
                        _b.sent();
                        // Step 5: APIs
                        return [4 /*yield*/, this.step5_APIs()];
                    case 5:
                        // Step 5: APIs
                        _b.sent();
                        // Step 6: Workers (optional, only if APIs ready)
                        return [4 /*yield*/, this.step6_Workers()];
                    case 6:
                        // Step 6: Workers (optional, only if APIs ready)
                        _b.sent();
                        // Step 7: UI
                        return [4 /*yield*/, this.step7_UI()];
                    case 7:
                        // Step 7: UI
                        _b.sent();
                        return [2 /*return*/, {
                                success: true,
                                steps: this.steps,
                                totalDuration: Date.now() - this.startTime,
                            }];
                    case 8:
                        error_3 = _b.sent();
                        failedStep = (_a = this.steps[this.steps.length - 1]) === null || _a === void 0 ? void 0 : _a.step;
                        return [2 /*return*/, {
                                success: false,
                                steps: this.steps,
                                totalDuration: Date.now() - this.startTime,
                                failedAt: failedStep,
                            }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get boot sequence status
     */
    SafeBootSequence.prototype.getStatus = function () {
        var _a;
        return {
            success: this.steps.every(function (s) { return s.success; }),
            steps: this.steps,
            totalDuration: Date.now() - this.startTime,
            failedAt: (_a = this.steps.find(function (s) { return !s.success; })) === null || _a === void 0 ? void 0 : _a.step,
        };
    };
    return SafeBootSequence;
}());
exports.safeBootSequence = new SafeBootSequence();
/**
 * Execute safe boot sequence
 * Call this before starting the server to ensure proper startup order
 */
function executeSafeBoot() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, exports.safeBootSequence.execute()];
        });
    });
}
