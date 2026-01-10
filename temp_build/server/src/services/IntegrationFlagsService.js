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
exports.IntegrationFlagsService = void 0;
var flags = new Map();
var emergencyMode = {
    active: false,
};
function getFlag(name) {
    if (!flags.has(name)) {
        flags.set(name, {
            enabled: true,
            updatedAt: new Date().toISOString(),
        });
    }
    return flags.get(name);
}
exports.IntegrationFlagsService = {
    requireEnabled: function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var flag, reason;
            return __generator(this, function (_a) {
                flag = getFlag(name);
                if (!flag.enabled || emergencyMode.active) {
                    reason = flag.reason || emergencyMode.reason || "disabled";
                    throw new Error("Integration \"".concat(name, "\" disabled: ").concat(reason));
                }
                return [2 /*return*/];
            });
        });
    },
    setIntegrationEnabled: function (name, enabled, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var flag;
            return __generator(this, function (_a) {
                flag = getFlag(name);
                flag.enabled = enabled;
                flag.reason = reason;
                flag.updatedAt = new Date().toISOString();
                flags.set(name, flag);
                return [2 /*return*/];
            });
        });
    },
    enableEmergencyMode: function (reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                emergencyMode = {
                    active: true,
                    reason: reason,
                    activatedAt: new Date().toISOString(),
                };
                return [2 /*return*/];
            });
        });
    },
    disableEmergencyMode: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                emergencyMode = { active: false };
                return [2 /*return*/];
            });
        });
    },
    getAllFlags: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(flags.entries()).map(function (_a) {
                        var name = _a[0], flag = _a[1];
                        return (__assign({ name: name }, flag));
                    })];
            });
        });
    },
    getIntegrationConfig: function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var flag;
            return __generator(this, function (_a) {
                flag = getFlag(name);
                return [2 /*return*/, {
                        name: name,
                        enabled: flag.enabled && !emergencyMode.active,
                        reason: emergencyMode.active ? emergencyMode.reason : flag.reason,
                        emergencyMode: emergencyMode.active,
                    }];
            });
        });
    },
    getEmergencyStatus: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, emergencyMode];
            });
        });
    },
    validateFlags: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        ok: true,
                        issues: [],
                        emergencyMode: emergencyMode,
                        totalFlags: flags.size,
                    }];
            });
        });
    },
};
