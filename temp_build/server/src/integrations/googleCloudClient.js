"use strict";
/**
 * Google Cloud SDK Client Integration
 * Direct Google Cloud integration - "jack it in" approach
 * Uses Google Cloud credentials (via GOOGLE_APPLICATION_CREDENTIALS or default credentials)
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
exports.verifyGoogleCloudCredentials = verifyGoogleCloudCredentials;
exports.listCloudRunServices = listCloudRunServices;
exports.getCloudRunService = getCloudRunService;
exports.deployToCloudRun = deployToCloudRun;
exports.listCloudStorageBuckets = listCloudStorageBuckets;
exports.createCloudStorageBucket = createCloudStorageBucket;
exports.uploadToCloudStorage = uploadToCloudStorage;
exports.listCloudBuildBuilds = listCloudBuildBuilds;
exports.triggerCloudBuild = triggerCloudBuild;
exports.listCloudFunctions = listCloudFunctions;
exports.deployCloudFunction = deployCloudFunction;
var run_1 = require("@google-cloud/run");
var storage_1 = require("@google-cloud/storage");
var cloudbuild_1 = require("@google-cloud/cloudbuild");
var functions_1 = require("@google-cloud/functions");
var resource_manager_1 = require("@google-cloud/resource-manager");
// Get project ID from environment or default
var projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'dreamnet-62b49';
var region = process.env.GCP_REGION || process.env.GOOGLE_CLOUD_REGION || 'us-central1';
// Google Cloud clients (use default credential chain - picks up GOOGLE_APPLICATION_CREDENTIALS or gcloud auth)
var cloudRunClient = new run_1.ServicesClient({
    projectId: projectId,
    // Credentials will be picked up from:
    // 1. GOOGLE_APPLICATION_CREDENTIALS env var (path to JSON key file)
    // 2. gcloud auth application-default login
    // 3. Google Cloud metadata server (if running on GCP)
});
var storageClient = new storage_1.Storage({
    projectId: projectId,
});
var cloudBuildClient = new cloudbuild_1.CloudBuildClient({
    projectId: projectId,
});
var functionsClient = new functions_1.CloudFunctionsServiceClient({
    projectId: projectId,
});
var projectsClient = new resource_manager_1.ProjectsClient({
    projectId: projectId,
});
/**
 * Verify Google Cloud credentials and get project info
 */
function verifyGoogleCloudCredentials() {
    return __awaiter(this, void 0, void 0, function () {
        var project, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, projectsClient.getProject({
                            name: "projects/".concat(projectId),
                        })];
                case 1:
                    project = (_b.sent())[0];
                    return [2 /*return*/, {
                            projectId: projectId,
                            projectNumber: (_a = project.name) === null || _a === void 0 ? void 0 : _a.split('/')[1],
                            region: region,
                        }];
                case 2:
                    error_1 = _b.sent();
                    // If project doesn't exist or credentials invalid, return basic info
                    return [2 /*return*/, {
                            projectId: projectId,
                            region: region,
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * List Cloud Run services
 */
function listCloudRunServices() {
    return __awaiter(this, void 0, void 0, function () {
        var parent_1, services, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parent_1 = "projects/".concat(projectId, "/locations/").concat(region);
                    return [4 /*yield*/, cloudRunClient.listServices({
                            parent: parent_1,
                        })];
                case 1:
                    services = (_a.sent())[0];
                    return [2 /*return*/, services.map(function (service) {
                            var _a, _b, _c, _d, _e;
                            return ({
                                name: service.name,
                                serviceName: (_a = service.metadata) === null || _a === void 0 ? void 0 : _a.name,
                                url: (_b = service.status) === null || _b === void 0 ? void 0 : _b.url,
                                revision: (_c = service.status) === null || _c === void 0 ? void 0 : _c.latestReadyRevisionName,
                                traffic: (_d = service.status) === null || _d === void 0 ? void 0 : _d.traffic,
                                createdAt: (_e = service.metadata) === null || _e === void 0 ? void 0 : _e.creationTimestamp,
                            });
                        })];
                case 2:
                    error_2 = _a.sent();
                    throw new Error("Failed to list Cloud Run services: ".concat(error_2.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get Cloud Run service by name
 */
function getCloudRunService(serviceName) {
    return __awaiter(this, void 0, void 0, function () {
        var name_1, service, error_3;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 2, , 3]);
                    name_1 = "projects/".concat(projectId, "/locations/").concat(region, "/services/").concat(serviceName);
                    return [4 /*yield*/, cloudRunClient.getService({
                            name: name_1,
                        })];
                case 1:
                    service = (_f.sent())[0];
                    return [2 /*return*/, {
                            name: service.name,
                            serviceName: (_a = service.metadata) === null || _a === void 0 ? void 0 : _a.name,
                            url: (_b = service.status) === null || _b === void 0 ? void 0 : _b.url,
                            revision: (_c = service.status) === null || _c === void 0 ? void 0 : _c.latestReadyRevisionName,
                            traffic: (_d = service.status) === null || _d === void 0 ? void 0 : _d.traffic,
                            createdAt: (_e = service.metadata) === null || _e === void 0 ? void 0 : _e.creationTimestamp,
                        }];
                case 2:
                    error_3 = _f.sent();
                    if (error_3.code === 5) { // NOT_FOUND
                        return [2 /*return*/, null];
                    }
                    throw new Error("Failed to get Cloud Run service: ".concat(error_3.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Deploy to Cloud Run
 */
function deployToCloudRun(config) {
    return __awaiter(this, void 0, void 0, function () {
        var parent_2, serviceName, service, existingService, error_4, containerEnv, serviceConfig, updatedService, newService, error_5;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 9, , 10]);
                    parent_2 = "projects/".concat(projectId, "/locations/").concat(region);
                    serviceName = "projects/".concat(projectId, "/locations/").concat(region, "/services/").concat(config.serviceName);
                    service = void 0;
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cloudRunClient.getService({
                            name: serviceName,
                        })];
                case 2:
                    existingService = (_g.sent())[0];
                    service = existingService;
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _g.sent();
                    if (error_4.code === 5) { // NOT_FOUND - create new service
                        service = null;
                    }
                    else {
                        throw error_4;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    containerEnv = Object.entries(config.environmentVariables || {}).map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return ({
                            name: key,
                            value: String(value),
                        });
                    });
                    serviceConfig = {
                        template: {
                            spec: {
                                containers: [{
                                        image: config.image,
                                        ports: config.port ? [{ containerPort: config.port }] : [],
                                        env: containerEnv,
                                        resources: {
                                            limits: {
                                                memory: config.memory || '512Mi',
                                                cpu: config.cpu || '1',
                                            },
                                        },
                                    }],
                            },
                            metadata: {
                                annotations: {
                                    'autoscaling.knative.dev/minScale': String(config.minInstances || 0),
                                    'autoscaling.knative.dev/maxScale': String(config.maxInstances || 100),
                                },
                            },
                        },
                    };
                    if (!service) return [3 /*break*/, 6];
                    return [4 /*yield*/, cloudRunClient.updateService({
                            service: __assign(__assign({}, service), serviceConfig),
                        })];
                case 5:
                    updatedService = (_g.sent())[0];
                    return [2 /*return*/, {
                            name: updatedService.name,
                            serviceName: (_a = updatedService.metadata) === null || _a === void 0 ? void 0 : _a.name,
                            url: (_b = updatedService.status) === null || _b === void 0 ? void 0 : _b.url,
                            revision: (_c = updatedService.status) === null || _c === void 0 ? void 0 : _c.latestReadyRevisionName,
                        }];
                case 6: return [4 /*yield*/, cloudRunClient.createService({
                        parent: parent_2,
                        service: __assign({ apiVersion: 'serving.knative.dev/v1', kind: 'Service', metadata: {
                                name: config.serviceName,
                            } }, serviceConfig),
                        serviceId: config.serviceName,
                    })];
                case 7:
                    newService = (_g.sent())[0];
                    return [2 /*return*/, {
                            name: newService.name,
                            serviceName: (_d = newService.metadata) === null || _d === void 0 ? void 0 : _d.name,
                            url: (_e = newService.status) === null || _e === void 0 ? void 0 : _e.url,
                            revision: (_f = newService.status) === null || _f === void 0 ? void 0 : _f.latestReadyRevisionName,
                        }];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_5 = _g.sent();
                    throw new Error("Failed to deploy to Cloud Run: ".concat(error_5.message));
                case 10: return [2 /*return*/];
            }
        });
    });
}
/**
 * List Cloud Storage buckets
 */
function listCloudStorageBuckets() {
    return __awaiter(this, void 0, void 0, function () {
        var buckets, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storageClient.getBuckets()];
                case 1:
                    buckets = (_a.sent())[0];
                    return [2 /*return*/, buckets.map(function (bucket) {
                            var _a, _b, _c;
                            return ({
                                name: bucket.name,
                                location: (_a = bucket.metadata) === null || _a === void 0 ? void 0 : _a.location,
                                createdAt: (_b = bucket.metadata) === null || _b === void 0 ? void 0 : _b.timeCreated,
                                updatedAt: (_c = bucket.metadata) === null || _c === void 0 ? void 0 : _c.updated,
                            });
                        })];
                case 2:
                    error_6 = _a.sent();
                    throw new Error("Failed to list Cloud Storage buckets: ".concat(error_6.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create Cloud Storage bucket
 */
function createCloudStorageBucket(bucketName, location) {
    return __awaiter(this, void 0, void 0, function () {
        var bucket, error_7;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storageClient.createBucket(bucketName, {
                            location: location || region,
                            storageClass: 'STANDARD',
                        })];
                case 1:
                    bucket = (_c.sent())[0];
                    return [2 /*return*/, {
                            name: bucket.name,
                            location: (_a = bucket.metadata) === null || _a === void 0 ? void 0 : _a.location,
                            createdAt: (_b = bucket.metadata) === null || _b === void 0 ? void 0 : _b.timeCreated,
                        }];
                case 2:
                    error_7 = _c.sent();
                    throw new Error("Failed to create Cloud Storage bucket: ".concat(error_7.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Upload file to Cloud Storage
 */
function uploadToCloudStorage(config) {
    return __awaiter(this, void 0, void 0, function () {
        var bucket, file, buffer, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    bucket = storageClient.bucket(config.bucket);
                    file = bucket.file(config.key);
                    buffer = typeof config.body === 'string' ? Buffer.from(config.body) : config.body;
                    return [4 /*yield*/, file.save(buffer, {
                            contentType: config.contentType || 'application/octet-stream',
                            metadata: config.metadata,
                        })];
                case 1:
                    _a.sent();
                    // Make file publicly readable (optional)
                    // await file.makePublic();
                    return [2 /*return*/, {
                            bucket: config.bucket,
                            key: config.key,
                            publicUrl: "https://storage.googleapis.com/".concat(config.bucket, "/").concat(config.key),
                            gsUrl: "gs://".concat(config.bucket, "/").concat(config.key),
                        }];
                case 2:
                    error_8 = _a.sent();
                    throw new Error("Failed to upload to Cloud Storage: ".concat(error_8.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * List Cloud Build builds
 */
function listCloudBuildBuilds() {
    return __awaiter(this, arguments, void 0, function (limit) {
        var parent_3, builds, error_9;
        if (limit === void 0) { limit = 10; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parent_3 = "projects/".concat(projectId, "/locations/").concat(region);
                    return [4 /*yield*/, cloudBuildClient.listBuilds({
                            parent: parent_3,
                            pageSize: limit,
                        })];
                case 1:
                    builds = (_a.sent())[0];
                    return [2 /*return*/, builds.map(function (build) { return ({
                            id: build.id,
                            name: build.name,
                            status: build.status,
                            createTime: build.createTime,
                            startTime: build.startTime,
                            finishTime: build.finishTime,
                            source: build.source,
                            steps: build.steps,
                        }); })];
                case 2:
                    error_9 = _a.sent();
                    throw new Error("Failed to list Cloud Build builds: ".concat(error_9.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Trigger Cloud Build
 */
function triggerCloudBuild(config) {
    return __awaiter(this, void 0, void 0, function () {
        var parent_4, build, operation, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parent_4 = "projects/".concat(projectId, "/locations/").concat(region);
                    build = {
                        source: config.source,
                        steps: config.steps,
                        images: config.images || [],
                        substitutions: config.substitutions,
                    };
                    return [4 /*yield*/, cloudBuildClient.createBuild({
                            parent: parent_4,
                            build: build,
                        })];
                case 1:
                    operation = (_a.sent())[0];
                    return [2 /*return*/, {
                            name: operation.name,
                            metadata: operation.metadata,
                        }];
                case 2:
                    error_10 = _a.sent();
                    throw new Error("Failed to trigger Cloud Build: ".concat(error_10.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * List Cloud Functions
 */
function listCloudFunctions() {
    return __awaiter(this, void 0, void 0, function () {
        var parent_5, functions, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parent_5 = "projects/".concat(projectId, "/locations/").concat(region);
                    return [4 /*yield*/, functionsClient.listFunctions({
                            parent: parent_5,
                        })];
                case 1:
                    functions = (_a.sent())[0];
                    return [2 /*return*/, functions.map(function (func) {
                            var _a;
                            return ({
                                name: func.name,
                                functionName: (_a = func.name) === null || _a === void 0 ? void 0 : _a.split('/').pop(),
                                httpsTrigger: func.httpsTrigger,
                                eventTrigger: func.eventTrigger,
                                runtime: func.runtime,
                                entryPoint: func.entryPoint,
                                updateTime: func.updateTime,
                                status: func.state,
                            });
                        })];
                case 2:
                    error_11 = _a.sent();
                    throw new Error("Failed to list Cloud Functions: ".concat(error_11.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Deploy Cloud Function
 */
function deployCloudFunction(config) {
    return __awaiter(this, void 0, void 0, function () {
        var parent_6, functionPath, existingFunction, func, error_12, cloudFunction, updatedFunction, newFunction, error_13;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 9, , 10]);
                    parent_6 = "projects/".concat(projectId, "/locations/").concat(region);
                    functionPath = "".concat(parent_6, "/functions/").concat(config.functionName);
                    existingFunction = void 0;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, functionsClient.getFunction({
                            name: functionPath,
                        })];
                case 2:
                    func = (_c.sent())[0];
                    existingFunction = func;
                    return [3 /*break*/, 4];
                case 3:
                    error_12 = _c.sent();
                    if (error_12.code === 5) { // NOT_FOUND
                        existingFunction = null;
                    }
                    else {
                        throw error_12;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    cloudFunction = {
                        name: functionPath,
                        runtime: config.runtime,
                        entryPoint: config.entryPoint,
                        sourceArchiveUrl: config.sourceArchiveUrl,
                        sourceRepository: config.sourceRepository,
                        httpsTrigger: config.httpsTrigger,
                        eventTrigger: config.eventTrigger,
                        environmentVariables: config.environmentVariables,
                        availableMemoryMb: config.memory || 256,
                        timeout: config.timeout || '60s',
                    };
                    if (!existingFunction) return [3 /*break*/, 6];
                    return [4 /*yield*/, functionsClient.updateFunction({
                            function: __assign(__assign({}, existingFunction), cloudFunction),
                            updateMask: {
                                paths: [
                                    'runtime',
                                    'entryPoint',
                                    'sourceArchiveUrl',
                                    'sourceRepository',
                                    'httpsTrigger',
                                    'eventTrigger',
                                    'environmentVariables',
                                    'availableMemoryMb',
                                    'timeout',
                                ],
                            },
                        })];
                case 5:
                    updatedFunction = (_c.sent())[0];
                    return [2 /*return*/, {
                            name: updatedFunction.name,
                            functionName: (_a = updatedFunction.name) === null || _a === void 0 ? void 0 : _a.split('/').pop(),
                            httpsTrigger: updatedFunction.httpsTrigger,
                            updateTime: updatedFunction.updateTime,
                        }];
                case 6: return [4 /*yield*/, functionsClient.createFunction({
                        parent: parent_6,
                        function: cloudFunction,
                        functionId: config.functionName,
                    })];
                case 7:
                    newFunction = (_c.sent())[0];
                    return [2 /*return*/, {
                            name: newFunction.name,
                            functionName: (_b = newFunction.name) === null || _b === void 0 ? void 0 : _b.split('/').pop(),
                            httpsTrigger: newFunction.httpsTrigger,
                            updateTime: newFunction.updateTime,
                        }];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_13 = _c.sent();
                    throw new Error("Failed to deploy Cloud Function: ".concat(error_13.message));
                case 10: return [2 /*return*/];
            }
        });
    });
}
