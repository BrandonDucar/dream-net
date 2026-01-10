"use strict";
/**
 * AWS Integration API Routes
 * Direct AWS SDK integration - "jack it in" approach
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
var awsClient_1 = require("../integrations/awsClient");
var fs_1 = require("fs");
var path_1 = require("path");
var router = (0, express_1.Router)();
/**
 * GET /api/aws/status
 * Verify AWS credentials and get account info
 */
router.get('/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var identity, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, awsClient_1.verifyAwsCredentials)()];
            case 1:
                identity = _a.sent();
                res.json({
                    success: true,
                    account: identity.account,
                    arn: identity.arn,
                    userId: identity.userId,
                    region: process.env.AWS_REGION || 'us-east-1',
                    message: 'AWS credentials verified',
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: 'Failed to verify AWS credentials',
                    message: error_1.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/aws/amplify/apps
 * List all Amplify apps
 */
router.get('/amplify/apps', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var apps, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, awsClient_1.listAmplifyApps)()];
            case 1:
                apps = _a.sent();
                res.json({
                    success: true,
                    apps: apps,
                    count: apps.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: 'Failed to list Amplify apps',
                    message: error_2.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/aws/amplify/apps/:name
 * Get Amplify app by name
 */
router.get('/amplify/apps/:name', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, app, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                name_1 = req.params.name;
                return [4 /*yield*/, (0, awsClient_1.getAmplifyApp)(name_1)];
            case 1:
                app = _a.sent();
                if (!app) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            error: 'Amplify app not found',
                            name: name_1,
                        })];
                }
                res.json({
                    success: true,
                    app: app,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: 'Failed to get Amplify app',
                    message: error_3.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/aws/amplify/apps
 * Create Amplify app
 */
router.post('/amplify/apps', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_2, description, repository, platform, environmentVariables, app, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_2 = _a.name, description = _a.description, repository = _a.repository, platform = _a.platform, environmentVariables = _a.environmentVariables;
                if (!name_2) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Missing required field: name',
                        })];
                }
                return [4 /*yield*/, (0, awsClient_1.createAmplifyApp)({
                        name: name_2,
                        description: description,
                        repository: repository,
                        platform: platform,
                        environmentVariables: environmentVariables,
                    })];
            case 1:
                app = _b.sent();
                res.json({
                    success: true,
                    app: app,
                    message: "Amplify app \"".concat(name_2, "\" created successfully"),
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                res.status(400).json({
                    success: false,
                    error: 'Failed to create Amplify app',
                    message: error_4.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/aws/amplify/deploy
 * Deploy to Amplify
 */
router.post('/amplify/deploy', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, appId, branchName, deployment, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, appId = _a.appId, branchName = _a.branchName;
                if (!appId || !branchName) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Missing required fields: appId, branchName',
                        })];
                }
                return [4 /*yield*/, (0, awsClient_1.deployToAmplify)({ appId: appId, branchName: branchName })];
            case 1:
                deployment = _b.sent();
                res.json({
                    success: true,
                    deployment: deployment,
                    message: "Deployment started for ".concat(branchName),
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                res.status(400).json({
                    success: false,
                    error: 'Failed to deploy to Amplify',
                    message: error_5.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/aws/s3/buckets
 * List S3 buckets
 */
router.get('/s3/buckets', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var buckets, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, awsClient_1.listS3Buckets)()];
            case 1:
                buckets = _a.sent();
                res.json({
                    success: true,
                    buckets: buckets,
                    count: buckets.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: 'Failed to list S3 buckets',
                    message: error_6.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/aws/s3/buckets
 * Create S3 bucket
 */
router.post('/s3/buckets', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bucketName, region, result, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, bucketName = _a.bucketName, region = _a.region;
                if (!bucketName) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Missing required field: bucketName',
                        })];
                }
                return [4 /*yield*/, (0, awsClient_1.createS3Bucket)(bucketName, region)];
            case 1:
                result = _b.sent();
                res.json(__assign(__assign({ success: true }, result), { message: "S3 bucket \"".concat(bucketName, "\" created successfully") }));
                return [3 /*break*/, 3];
            case 2:
                error_7 = _b.sent();
                res.status(400).json({
                    success: false,
                    error: 'Failed to create S3 bucket',
                    message: error_7.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/aws/s3/upload
 * Upload file to S3
 */
router.post('/s3/upload', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bucket, key, filePath, contentType, fileBody, fullPath, result, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, bucket = _a.bucket, key = _a.key, filePath = _a.filePath, contentType = _a.contentType;
                if (!bucket || !key) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Missing required fields: bucket, key',
                        })];
                }
                fileBody = void 0;
                if (filePath) {
                    fullPath = path_1.default.resolve(filePath);
                    if (!fs_1.default.existsSync(fullPath)) {
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                error: 'File not found',
                                filePath: fullPath,
                            })];
                    }
                    fileBody = fs_1.default.readFileSync(fullPath);
                }
                else {
                    // Expect file content in request body (for small files)
                    fileBody = Buffer.from(req.body.content || '');
                }
                return [4 /*yield*/, (0, awsClient_1.uploadToS3)({
                        bucket: bucket,
                        key: key,
                        body: fileBody,
                        contentType: contentType || 'application/octet-stream',
                    })];
            case 1:
                result = _b.sent();
                res.json(__assign(__assign({ success: true }, result), { message: "File uploaded to S3: ".concat(key) }));
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                res.status(400).json({
                    success: false,
                    error: 'Failed to upload to S3',
                    message: error_8.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * GET /api/aws/lambda/functions
 * List Lambda functions
 */
router.get('/lambda/functions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var functions, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, awsClient_1.listLambdaFunctions)()];
            case 1:
                functions = _a.sent();
                res.json({
                    success: true,
                    functions: functions,
                    count: functions.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                res.status(500).json({
                    success: false,
                    error: 'Failed to list Lambda functions',
                    message: error_9.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/aws/lambda/functions
 * Create Lambda function
 */
router.post('/lambda/functions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, functionName, runtime, role, handler, code, environment, func, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, functionName = _a.functionName, runtime = _a.runtime, role = _a.role, handler = _a.handler, code = _a.code, environment = _a.environment;
                if (!functionName || !runtime || !role || !handler || !code) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Missing required fields: functionName, runtime, role, handler, code',
                        })];
                }
                return [4 /*yield*/, (0, awsClient_1.createLambdaFunction)({
                        functionName: functionName,
                        runtime: runtime,
                        role: role,
                        handler: handler,
                        code: Buffer.from(code),
                        environment: environment,
                    })];
            case 1:
                func = _b.sent();
                res.json({
                    success: true,
                    function: func,
                    message: "Lambda function \"".concat(functionName, "\" created successfully"),
                });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _b.sent();
                res.status(400).json({
                    success: false,
                    error: 'Failed to create Lambda function',
                    message: error_10.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
