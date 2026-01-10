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
var PropertiesManager_1 = require("../services/PropertiesManager");
var router = (0, express_1.Router)();
var propertiesManager = null;
// Initialize Properties Manager
var getPropertiesManager = function () {
    if (!propertiesManager) {
        propertiesManager = new PropertiesManager_1.PropertiesManager();
    }
    return propertiesManager;
};
// Get all properties
router.get('/properties', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, properties;
    return __generator(this, function (_a) {
        try {
            manager = getPropertiesManager();
            properties = manager.getAllProperties();
            res.json({ success: true, properties: properties });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
        return [2 /*return*/];
    });
}); });
// Add new property
router.post('/properties', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, property, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                manager = getPropertiesManager();
                return [4 /*yield*/, manager.addProperty(__assign(__assign({}, req.body), { tenants: [], maintenanceHistory: [], documents: [], energyEfficiency: {
                            rating: 'B',
                            score: 75,
                            lastAssessment: new Date()
                        }, biomimeticSystems: [], features: req.body.features || ['standard-hvac', 'basic-security'], coordinates: { lat: 0, lng: 0 } }))];
            case 1:
                property = _a.sent();
                res.json({ success: true, property: property });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ success: false, error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get property by ID
router.get('/properties/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, property;
    return __generator(this, function (_a) {
        try {
            manager = getPropertiesManager();
            property = manager.getProperty(req.params.id);
            if (!property) {
                return [2 /*return*/, res.status(404).json({ success: false, error: 'Property not found' })];
            }
            res.json({ success: true, property: property });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
        return [2 /*return*/];
    });
}); });
// Update property
router.put('/properties/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, property, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                manager = getPropertiesManager();
                return [4 /*yield*/, manager.updateProperty(req.params.id, req.body)];
            case 1:
                property = _a.sent();
                if (!property) {
                    return [2 /*return*/, res.status(404).json({ success: false, error: 'Property not found' })];
                }
                res.json({ success: true, property: property });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ success: false, error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get team members
router.get('/properties/team', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, teamMembers;
    return __generator(this, function (_a) {
        try {
            manager = getPropertiesManager();
            teamMembers = manager.getTeamMembers();
            res.json({ success: true, teamMembers: teamMembers });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
        return [2 /*return*/];
    });
}); });
// Add team member
router.post('/properties/team', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, member, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                manager = getPropertiesManager();
                return [4 /*yield*/, manager.addTeamMember(req.body)];
            case 1:
                member = _a.sent();
                res.json({ success: true, member: member });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ success: false, error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get maintenance records
router.get('/properties/maintenance', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, properties, allMaintenance;
    return __generator(this, function (_a) {
        try {
            manager = getPropertiesManager();
            properties = manager.getAllProperties();
            allMaintenance = properties.flatMap(function (prop) {
                return prop.maintenanceHistory.map(function (record) { return (__assign(__assign({}, record), { propertyId: prop.id, propertyAddress: prop.address })); });
            });
            res.json({ success: true, maintenance: allMaintenance });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
        return [2 /*return*/];
    });
}); });
// Schedule maintenance
router.post('/properties/:id/maintenance', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, maintenance, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                manager = getPropertiesManager();
                return [4 /*yield*/, manager.scheduleMaintenance(req.params.id, req.body)];
            case 1:
                maintenance = _a.sent();
                res.json({ success: true, maintenance: maintenance });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({ success: false, error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get portfolio analytics
router.get('/properties/analytics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, properties, analytics;
    return __generator(this, function (_a) {
        try {
            manager = getPropertiesManager();
            properties = manager.getAllProperties();
            analytics = {
                totalProperties: properties.length,
                totalValue: properties.reduce(function (sum, prop) { return sum + prop.value; }, 0),
                totalRevenue: properties.reduce(function (sum, prop) { return sum + prop.monthlyRevenue; }, 0),
                totalExpenses: properties.reduce(function (sum, prop) { return sum + prop.expenses; }, 0),
                occupancyRate: properties.filter(function (p) { return p.status === 'occupied'; }).length / properties.length * 100,
                propertyTypes: properties.reduce(function (acc, prop) {
                    acc[prop.type] = (acc[prop.type] || 0) + 1;
                    return acc;
                }, {})
            };
            res.json({ success: true, analytics: analytics });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
        return [2 /*return*/];
    });
}); });
// Get system status
router.get('/properties/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var manager, status_1;
    return __generator(this, function (_a) {
        try {
            manager = getPropertiesManager();
            status_1 = manager.getSystemStatus();
            res.json({ success: true, status: status_1 });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
