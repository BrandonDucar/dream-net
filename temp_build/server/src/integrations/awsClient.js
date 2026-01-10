"use strict";
/**
 * AWS SDK Client Integration
 * Direct AWS integration - "jack it in" approach
 * Uses your AWS credentials (already configured via AWS CLI)
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
exports.verifyAwsCredentials = verifyAwsCredentials;
exports.listAmplifyApps = listAmplifyApps;
exports.getAmplifyApp = getAmplifyApp;
exports.createAmplifyApp = createAmplifyApp;
exports.createAmplifyBranch = createAmplifyBranch;
exports.deployToAmplify = deployToAmplify;
exports.listS3Buckets = listS3Buckets;
exports.createS3Bucket = createS3Bucket;
exports.uploadToS3 = uploadToS3;
exports.listLambdaFunctions = listLambdaFunctions;
exports.createLambdaFunction = createLambdaFunction;
exports.updateLambdaCode = updateLambdaCode;
var client_amplify_1 = require("@aws-sdk/client-amplify");
var client_s3_1 = require("@aws-sdk/client-s3");
var client_lambda_1 = require("@aws-sdk/client-lambda");
var client_sts_1 = require("@aws-sdk/client-sts");
// AWS SDK clients (use default credential chain - picks up AWS CLI config)
var amplifyClient = new client_amplify_1.AmplifyClient({
    region: process.env.AWS_REGION || 'us-east-1',
});
var s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
});
var lambdaClient = new client_lambda_1.LambdaClient({
    region: process.env.AWS_REGION || 'us-east-1',
});
var stsClient = new client_sts_1.STSClient({
    region: process.env.AWS_REGION || 'us-east-1',
});
/**
 * Verify AWS credentials and get account info
 */
function verifyAwsCredentials() {
    return __awaiter(this, void 0, void 0, function () {
        var command, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    command = new client_sts_1.GetCallerIdentityCommand({});
                    return [4 /*yield*/, stsClient.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, {
                            account: response.Account || 'unknown',
                            arn: response.Arn || 'unknown',
                            userId: response.UserId || 'unknown',
                        }];
                case 2:
                    error_1 = _a.sent();
                    throw new Error("AWS credentials verification failed: ".concat(error_1.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * List all Amplify apps
 */
function listAmplifyApps() {
    return __awaiter(this, void 0, void 0, function () {
        var command, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    command = new client_amplify_1.ListAppsCommand({});
                    return [4 /*yield*/, amplifyClient.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.apps || []];
                case 2:
                    error_2 = _a.sent();
                    throw new Error("Failed to list Amplify apps: ".concat(error_2.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get Amplify app by name
 */
function getAmplifyApp(appName) {
    return __awaiter(this, void 0, void 0, function () {
        var apps, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, listAmplifyApps()];
                case 1:
                    apps = _a.sent();
                    return [2 /*return*/, apps.find(function (app) { return app.name === appName; }) || null];
                case 2:
                    error_3 = _a.sent();
                    throw new Error("Failed to get Amplify app: ".concat(error_3.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create Amplify app
 */
function createAmplifyApp(config) {
    return __awaiter(this, void 0, void 0, function () {
        var input, command, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    input = {
                        name: config.name,
                        description: config.description,
                        platform: config.platform || 'WEB',
                        environmentVariables: config.environmentVariables,
                        // If repository provided, connect to GitHub
                        repository: config.repository,
                    };
                    command = new client_amplify_1.CreateAppCommand(input);
                    return [4 /*yield*/, amplifyClient.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.app];
                case 2:
                    error_4 = _a.sent();
                    throw new Error("Failed to create Amplify app: ".concat(error_4.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create Amplify branch
 */
function createAmplifyBranch(config) {
    return __awaiter(this, void 0, void 0, function () {
        var input, command, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    input = {
                        appId: config.appId,
                        branchName: config.branchName,
                        framework: config.framework || 'React',
                    };
                    command = new client_amplify_1.CreateBranchCommand(input);
                    return [4 /*yield*/, amplifyClient.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.branch];
                case 2:
                    error_5 = _a.sent();
                    throw new Error("Failed to create Amplify branch: ".concat(error_5.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Deploy to Amplify
 */
function deployToAmplify(config) {
    return __awaiter(this, void 0, void 0, function () {
        var command, response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    command = new client_amplify_1.StartDeploymentCommand({
                        appId: config.appId,
                        branchName: config.branchName,
                    });
                    return [4 /*yield*/, amplifyClient.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.jobSummary];
                case 2:
                    error_6 = _a.sent();
                    throw new Error("Failed to deploy to Amplify: ".concat(error_6.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * List S3 buckets
 */
function listS3Buckets() {
    return __awaiter(this, void 0, void 0, function () {
        var command, response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    command = new client_s3_1.ListBucketsCommand({});
                    return [4 /*yield*/, s3Client.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.Buckets || []];
                case 2:
                    error_7 = _a.sent();
                    throw new Error("Failed to list S3 buckets: ".concat(error_7.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create S3 bucket
 */
function createS3Bucket(bucketName, region) {
    return __awaiter(this, void 0, void 0, function () {
        var command, response, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    command = new client_s3_1.CreateBucketCommand(__assign({ Bucket: bucketName }, (region && { CreateBucketConfiguration: { LocationConstraint: region } })));
                    return [4 /*yield*/, s3Client.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, { bucketName: bucketName, location: response.Location }];
                case 2:
                    error_8 = _a.sent();
                    throw new Error("Failed to create S3 bucket: ".concat(error_8.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Upload file to S3
 */
function uploadToS3(config) {
    return __awaiter(this, void 0, void 0, function () {
        var input, command, response, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    input = {
                        Bucket: config.bucket,
                        Key: config.key,
                        Body: typeof config.body === 'string' ? Buffer.from(config.body) : config.body,
                        ContentType: config.contentType || 'application/octet-stream',
                    };
                    command = new client_s3_1.PutObjectCommand(input);
                    return [4 /*yield*/, s3Client.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, {
                            bucket: config.bucket,
                            key: config.key,
                            etag: response.ETag,
                            location: "https://".concat(config.bucket, ".s3.").concat(process.env.AWS_REGION || 'us-east-1', ".amazonaws.com/").concat(config.key),
                        }];
                case 2:
                    error_9 = _a.sent();
                    throw new Error("Failed to upload to S3: ".concat(error_9.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * List Lambda functions
 */
function listLambdaFunctions() {
    return __awaiter(this, void 0, void 0, function () {
        var command, response, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    command = new client_lambda_1.ListFunctionsCommand({});
                    return [4 /*yield*/, lambdaClient.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.Functions || []];
                case 2:
                    error_10 = _a.sent();
                    throw new Error("Failed to list Lambda functions: ".concat(error_10.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create Lambda function
 */
function createLambdaFunction(config) {
    return __awaiter(this, void 0, void 0, function () {
        var input, command, response, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    input = {
                        FunctionName: config.functionName,
                        Runtime: config.runtime,
                        Role: config.role,
                        Handler: config.handler,
                        Code: {
                            ZipFile: typeof config.code === 'string' ? Buffer.from(config.code) : config.code,
                        },
                        Environment: config.environment ? { Variables: config.environment } : undefined,
                    };
                    command = new client_lambda_1.CreateFunctionCommand(input);
                    return [4 /*yield*/, lambdaClient.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 2:
                    error_11 = _a.sent();
                    throw new Error("Failed to create Lambda function: ".concat(error_11.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Update Lambda function code
 */
function updateLambdaCode(config) {
    return __awaiter(this, void 0, void 0, function () {
        var command, response, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    command = new client_lambda_1.UpdateFunctionCodeCommand({
                        FunctionName: config.functionName,
                        ZipFile: typeof config.code === 'string' ? Buffer.from(config.code) : config.code,
                    });
                    return [4 /*yield*/, lambdaClient.send(command)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 2:
                    error_12 = _a.sent();
                    throw new Error("Failed to update Lambda code: ".concat(error_12.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
