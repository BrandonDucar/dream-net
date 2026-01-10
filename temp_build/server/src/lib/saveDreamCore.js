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
exports.saveDreamCoreToLocal = saveDreamCoreToLocal;
exports.loadDreamCoreFromLocal = loadDreamCoreFromLocal;
exports.listSavedDreamCores = listSavedDreamCores;
var fs_1 = require("fs");
var path_1 = require("path");
function saveDreamCoreToLocal(dreamCore, walletAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var dataDir, filePath;
        return __generator(this, function (_a) {
            dataDir = path_1.default.resolve(process.cwd(), 'server/data');
            // Ensure data directory exists
            if (!fs_1.default.existsSync(dataDir)) {
                fs_1.default.mkdirSync(dataDir, { recursive: true });
            }
            filePath = path_1.default.join(dataDir, "".concat(walletAddress, "-dream.json"));
            try {
                fs_1.default.writeFileSync(filePath, JSON.stringify(dreamCore, null, 2));
                console.log("\uD83D\uDCBE Dream Core saved for wallet: ".concat(walletAddress));
                return [2 /*return*/, { status: 'success', message: 'Dream Core saved locally.' }];
            }
            catch (err) {
                console.error("💾 Save failed:", err);
                return [2 /*return*/, { status: 'error', message: 'Save failed.' }];
            }
            return [2 /*return*/];
        });
    });
}
function loadDreamCoreFromLocal(walletAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var dataDir, filePath, data;
        return __generator(this, function (_a) {
            dataDir = path_1.default.resolve(process.cwd(), 'server/data');
            filePath = path_1.default.join(dataDir, "".concat(walletAddress, "-dream.json"));
            try {
                if (fs_1.default.existsSync(filePath)) {
                    data = fs_1.default.readFileSync(filePath, 'utf8');
                    return [2 /*return*/, { status: 'success', data: JSON.parse(data) }];
                }
                return [2 /*return*/, { status: 'not_found', message: 'No saved dream core found.' }];
            }
            catch (err) {
                console.error("💾 Load failed:", err);
                return [2 /*return*/, { status: 'error', message: 'Load failed.' }];
            }
            return [2 /*return*/];
        });
    });
}
function listSavedDreamCores() {
    return __awaiter(this, void 0, void 0, function () {
        var dataDir, files;
        return __generator(this, function (_a) {
            dataDir = path_1.default.resolve(process.cwd(), 'server/data');
            try {
                if (!fs_1.default.existsSync(dataDir)) {
                    return [2 /*return*/, { status: 'success', cores: [] }];
                }
                files = fs_1.default.readdirSync(dataDir)
                    .filter(function (file) { return file.endsWith('-dream.json'); })
                    .map(function (file) { return ({
                    walletAddress: file.replace('-dream.json', ''),
                    fileName: file,
                    lastModified: fs_1.default.statSync(path_1.default.join(dataDir, file)).mtime
                }); });
                return [2 /*return*/, { status: 'success', cores: files }];
            }
            catch (err) {
                console.error("💾 List failed:", err);
                return [2 /*return*/, { status: 'error', message: 'List failed.' }];
            }
            return [2 /*return*/];
        });
    });
}
