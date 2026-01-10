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
var express_1 = require("express");
var router = (0, express_1.Router)();
// Video processor is optional
var processVideoJob = null;
try {
    var videoModule = require('../utils/videoProcessor');
    processVideoJob = videoModule.processVideoJob;
}
catch (_a) {
    console.warn("[Video Router] Video processor not available");
}
// POST /api/video/process - Process video job
router.post('/process', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobSpec, result, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                jobSpec = req.body;
                if (!jobSpec.job_id && !jobSpec.title) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing job_id or title in job specification'
                        })];
                }
                if (!((_b = (_a = jobSpec.sources) === null || _a === void 0 ? void 0 : _a.clips) === null || _b === void 0 ? void 0 : _b.length)) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'No video clips provided in job specification'
                        })];
                }
                return [4 /*yield*/, processVideoJob(jobSpec)];
            case 1:
                result = _c.sent();
                res.json(__assign({ status: 'success', timestamp: new Date().toISOString() }, result));
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                res.status(500).json({
                    error: 'Video processing failed',
                    message: error_1.message,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/video/status/:job_id - Get processing status
router.get('/status/:job_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var job_id, fs, path, previewPath, exportPath, previewExists, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                job_id = req.params.job_id;
                return [4 /*yield*/, Promise.resolve().then(function () { return require('node:fs/promises'); })];
            case 1:
                fs = _a.sent();
                return [4 /*yield*/, Promise.resolve().then(function () { return require('node:path'); })];
            case 2:
                path = _a.sent();
                previewPath = path.join('public/previews', "".concat(job_id, "_preview.mp4"));
                exportPath = path.join('public/exports');
                return [4 /*yield*/, Promise.allSettled([
                        fs.access(previewPath),
                        fs.readdir(exportPath)
                    ])];
            case 3:
                previewExists = (_a.sent())[0];
                res.json({
                    job_id: job_id,
                    status: previewExists.status === 'fulfilled' ? 'completed' : 'processing',
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                res.status(500).json({
                    error: 'Status check failed',
                    message: error_2.message
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
