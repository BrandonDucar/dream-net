"use strict";
/**
 * Google Cloud Integration API Routes
 * Direct Google Cloud SDK integration - "jack it in" approach
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
var express_1 = require("express");
var googleCloudClient_1 = require("../integrations/googleCloudClient");
var router = (0, express_1.Router)();
/**
 * GET /api/google-cloud/status
 * Verify Google Cloud credentials and get project info
 */
router.get('/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var projectInfo, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, googleCloudClient_1.verifyGoogleCloudCredentials)()];
            case 1:
                projectInfo = _a.sent();
                res.json({
                    success: true,
                    project: projectInfo,
                    region: process.env.GCP_REGION || process.env.GOOGLE_CLOUD_REGION || 'us-central1',
                    message: 'Google Cloud credentials verified',
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('[Google Cloud] Status check failed:', error_1);
                res.status(500).json({
                    error: 'Failed to verify Google Cloud credentials',
                    message: error_1.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/google-cloud/run/services
 * List all Cloud Run services
 */
router.get('/run/services', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var services, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, googleCloudClient_1.listCloudRunServices)()];
            case 1:
                services = _a.sent();
                res.json({
                    success: true,
                    services: services,
                    count: services.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('[Google Cloud] List services failed:', error_2);
                res.status(500).json({
                    error: 'Failed to list Cloud Run services',
                    message: error_2.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/google-cloud/run/services/:name
 * Get Cloud Run service by name
 */
router.get('/run/services/:name', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, service, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                name_1 = req.params.name;
                return [4 /*yield*/, (0, googleCloudClient_1.getCloudRunService)(name_1)];
            case 1:
                service = _a.sent();
                if (!service) {
                    return [2 /*return*/, res.status(404).json({
                            error: 'Service not found',
                            serviceName: name_1,
                        })];
                }
                res.json({
                    success: true,
                    service: service,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('[Google Cloud] Get service failed:', error_3);
                res.status(500).json({
                    error: 'Failed to get Cloud Run service',
                    message: error_3.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/google-cloud/run/deploy
 * Deploy to Cloud Run
 */
router.post('/run/deploy', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, serviceName, image, port, environmentVariables, memory, cpu, minInstances, maxInstances, result, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, serviceName = _a.serviceName, image = _a.image, port = _a.port, environmentVariables = _a.environmentVariables, memory = _a.memory, cpu = _a.cpu, minInstances = _a.minInstances, maxInstances = _a.maxInstances;
                if (!serviceName || !image) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields',
                            required: ['serviceName', 'image'],
                        })];
                }
                return [4 /*yield*/, (0, googleCloudClient_1.deployToCloudRun)({
                        serviceName: serviceName,
                        image: image,
                        port: port,
                        environmentVariables: environmentVariables,
                        memory: memory,
                        cpu: cpu,
                        minInstances: minInstances,
                        maxInstances: maxInstances,
                    })];
            case 1:
                result = _b.sent();
                res.json({
                    success: true,
                    service: result,
                    message: 'Deployed to Cloud Run successfully',
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error('[Google Cloud] Deploy failed:', error_4);
                res.status(500).json({
                    error: 'Failed to deploy to Cloud Run',
                    message: error_4.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/google-cloud/storage/buckets
 * List all Cloud Storage buckets
 */
router.get('/storage/buckets', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var buckets, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, googleCloudClient_1.listCloudStorageBuckets)()];
            case 1:
                buckets = _a.sent();
                res.json({
                    success: true,
                    buckets: buckets,
                    count: buckets.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('[Google Cloud] List buckets failed:', error_5);
                res.status(500).json({
                    error: 'Failed to list Cloud Storage buckets',
                    message: error_5.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/google-cloud/storage/buckets
 * Create Cloud Storage bucket
 */
router.post('/storage/buckets', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bucketName, location_1, result, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, bucketName = _a.bucketName, location_1 = _a.location;
                if (!bucketName) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required field',
                            required: ['bucketName'],
                        })];
                }
                return [4 /*yield*/, (0, googleCloudClient_1.createCloudStorageBucket)(bucketName, location_1)];
            case 1:
                result = _b.sent();
                res.json({
                    success: true,
                    bucket: result,
                    message: 'Cloud Storage bucket created successfully',
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                console.error('[Google Cloud] Create bucket failed:', error_6);
                res.status(500).json({
                    error: 'Failed to create Cloud Storage bucket',
                    message: error_6.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/google-cloud/storage/upload
 * Upload file to Cloud Storage
 */
router.post('/storage/upload', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bucket, key, body, contentType, metadata, result, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, bucket = _a.bucket, key = _a.key, body = _a.body, contentType = _a.contentType, metadata = _a.metadata;
                if (!bucket || !key || !body) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields',
                            required: ['bucket', 'key', 'body'],
                        })];
                }
                return [4 /*yield*/, (0, googleCloudClient_1.uploadToCloudStorage)({
                        bucket: bucket,
                        key: key,
                        body: Buffer.from(body, 'base64'), // Expect base64 encoded body
                        contentType: contentType,
                        metadata: metadata,
                    })];
            case 1:
                result = _b.sent();
                res.json({
                    success: true,
                    file: result,
                    message: 'File uploaded to Cloud Storage successfully',
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _b.sent();
                console.error('[Google Cloud] Upload failed:', error_7);
                res.status(500).json({
                    error: 'Failed to upload to Cloud Storage',
                    message: error_7.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/google-cloud/build/builds
 * List Cloud Build builds
 */
router.get('/build/builds', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, builds, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                limit = parseInt(req.query.limit) || 10;
                return [4 /*yield*/, (0, googleCloudClient_1.listCloudBuildBuilds)(limit)];
            case 1:
                builds = _a.sent();
                res.json({
                    success: true,
                    builds: builds,
                    count: builds.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('[Google Cloud] List builds failed:', error_8);
                res.status(500).json({
                    error: 'Failed to list Cloud Build builds',
                    message: error_8.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/google-cloud/build/trigger
 * Trigger Cloud Build
 */
router.post('/build/trigger', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, source, steps, images, substitutions, result, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, source = _a.source, steps = _a.steps, images = _a.images, substitutions = _a.substitutions;
                if (!source || !steps) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields',
                            required: ['source', 'steps'],
                        })];
                }
                return [4 /*yield*/, (0, googleCloudClient_1.triggerCloudBuild)({
                        source: source,
                        steps: steps,
                        images: images,
                        substitutions: substitutions,
                    })];
            case 1:
                result = _b.sent();
                res.json({
                    success: true,
                    build: result,
                    message: 'Cloud Build triggered successfully',
                });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _b.sent();
                console.error('[Google Cloud] Trigger build failed:', error_9);
                res.status(500).json({
                    error: 'Failed to trigger Cloud Build',
                    message: error_9.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/google-cloud/functions
 * List Cloud Functions
 */
router.get('/functions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var functions, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, googleCloudClient_1.listCloudFunctions)()];
            case 1:
                functions = _a.sent();
                res.json({
                    success: true,
                    functions: functions,
                    count: functions.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error('[Google Cloud] List functions failed:', error_10);
                res.status(500).json({
                    error: 'Failed to list Cloud Functions',
                    message: error_10.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/google-cloud/functions
 * Deploy Cloud Function
 */
router.post('/functions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, functionName, runtime, entryPoint, sourceArchiveUrl, sourceRepository, httpsTrigger, eventTrigger, environmentVariables, memory, timeout, result, error_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, functionName = _a.functionName, runtime = _a.runtime, entryPoint = _a.entryPoint, sourceArchiveUrl = _a.sourceArchiveUrl, sourceRepository = _a.sourceRepository, httpsTrigger = _a.httpsTrigger, eventTrigger = _a.eventTrigger, environmentVariables = _a.environmentVariables, memory = _a.memory, timeout = _a.timeout;
                if (!functionName || !runtime || !entryPoint) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields',
                            required: ['functionName', 'runtime', 'entryPoint'],
                        })];
                }
                return [4 /*yield*/, (0, googleCloudClient_1.deployCloudFunction)({
                        functionName: functionName,
                        runtime: runtime,
                        entryPoint: entryPoint,
                        sourceArchiveUrl: sourceArchiveUrl,
                        sourceRepository: sourceRepository,
                        httpsTrigger: httpsTrigger,
                        eventTrigger: eventTrigger,
                        environmentVariables: environmentVariables,
                        memory: memory,
                        timeout: timeout,
                    })];
            case 1:
                result = _b.sent();
                res.json({
                    success: true,
                    function: result,
                    message: 'Cloud Function deployed successfully',
                });
                return [3 /*break*/, 3];
            case 2:
                error_11 = _b.sent();
                console.error('[Google Cloud] Deploy function failed:', error_11);
                res.status(500).json({
                    error: 'Failed to deploy Cloud Function',
                    message: error_11.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
