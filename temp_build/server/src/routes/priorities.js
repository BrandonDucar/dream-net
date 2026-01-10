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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var uuid_1 = require("uuid");
var router = (0, express_1.Router)();
// In-memory storage (replace with database in production)
var priorities = [
    {
        id: 'patent-1',
        title: 'File Biomimetic Agent Swarm Patents',
        description: 'Submit 10 high-value patents for biomimetic multi-agent coordination system worth $280M+ to USPTO',
        priority: 'critical',
        category: 'patents',
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedValue: 280000000,
        progress: 85,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'seed-1',
        title: 'Plant Initial Dream Seeds',
        description: 'Plant 5-10 dream seeds across different categories to start building dream intelligence network',
        priority: 'high',
        category: 'technical',
        status: 'pending',
        estimatedValue: 50000000,
        progress: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'bio-1',
        title: 'Optimize Biometric Performance',
        description: 'Monitor 92% optimization score and synchronize 23,000+ nano agents with caffeine protocol',
        priority: 'high',
        category: 'personal',
        status: 'in-progress',
        progress: 92,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'revenue-1',
        title: 'Launch Commercialization Strategy',
        description: 'Begin monetizing $200M+ market opportunity through IP licensing and service offerings',
        priority: 'high',
        category: 'revenue',
        status: 'pending',
        estimatedValue: 200000000,
        progress: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
// Get all priorities
router.get('/', function (req, res) {
    try {
        // Update overdue status
        var now_1 = new Date();
        priorities.forEach(function (item) {
            if (item.dueDate && new Date(item.dueDate) < now_1 && item.status !== 'completed') {
                item.status = 'overdue';
                item.updatedAt = new Date().toISOString();
            }
        });
        // Sort by priority and due date
        var sortedPriorities = __spreadArray([], priorities, true).sort(function (a, b) {
            var priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            var aPriority = priorityOrder[a.priority];
            var bPriority = priorityOrder[b.priority];
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            // If same priority, sort by due date
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            return 0;
        });
        res.json({
            success: true,
            items: sortedPriorities,
            stats: {
                total: priorities.length,
                critical: priorities.filter(function (p) { return p.priority === 'critical' || p.status === 'overdue'; }).length,
                completed: priorities.filter(function (p) { return p.status === 'completed'; }).length,
                totalValue: priorities.reduce(function (sum, p) { return sum + (p.estimatedValue || 0); }, 0)
            }
        });
    }
    catch (error) {
        console.error('Error fetching priorities:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch priorities'
        });
    }
});
// Add new priority
router.post('/', function (req, res) {
    try {
        var _a = req.body, title = _a.title, description = _a.description, _b = _a.priority, priority = _b === void 0 ? 'medium' : _b, _c = _a.category, category = _c === void 0 ? 'technical' : _c, _d = _a.status, status_1 = _d === void 0 ? 'pending' : _d, dueDate = _a.dueDate, estimatedValue = _a.estimatedValue, dependencies = _a.dependencies, _e = _a.progress, progress = _e === void 0 ? 0 : _e;
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                error: 'Title and description are required'
            });
        }
        var newPriority = {
            id: (0, uuid_1.v4)(),
            title: title,
            description: description,
            priority: priority,
            category: category,
            status: status_1,
            dueDate: dueDate,
            estimatedValue: estimatedValue ? parseInt(estimatedValue) : undefined,
            dependencies: dependencies,
            progress: parseInt(progress) || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        priorities.push(newPriority);
        res.json({
            success: true,
            item: newPriority,
            message: 'Priority item added successfully'
        });
    }
    catch (error) {
        console.error('Error adding priority:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add priority item'
        });
    }
});
// Update priority
router.put('/:id', function (req, res) {
    try {
        var id_1 = req.params.id;
        var updateData = req.body;
        var itemIndex = priorities.findIndex(function (p) { return p.id === id_1; });
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Priority item not found'
            });
        }
        priorities[itemIndex] = __assign(__assign(__assign({}, priorities[itemIndex]), updateData), { updatedAt: new Date().toISOString() });
        res.json({
            success: true,
            item: priorities[itemIndex],
            message: 'Priority item updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating priority:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update priority item'
        });
    }
});
// Delete priority
router.delete('/:id', function (req, res) {
    try {
        var id_2 = req.params.id;
        var itemIndex = priorities.findIndex(function (p) { return p.id === id_2; });
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Priority item not found'
            });
        }
        priorities.splice(itemIndex, 1);
        res.json({
            success: true,
            message: 'Priority item deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting priority:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete priority item'
        });
    }
});
// Get AI-generated suggestions based on system state
router.get('/suggestions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var suggestions, now, nextWeek;
    return __generator(this, function (_a) {
        try {
            suggestions = [];
            now = new Date();
            nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            // Patent filing urgency
            suggestions.push({
                title: 'File Patent Applications',
                description: 'Submit high-value biomimetic swarm patents to secure IP protection',
                priority: 'critical',
                category: 'patents',
                status: 'pending',
                estimatedValue: 280000000,
                dueDate: nextWeek.toISOString(),
                confidence: 95
            });
            // Dream seed planting
            suggestions.push({
                title: 'Plant Dream Seeds',
                description: 'Dream network lucidity optimal for seed planting across all categories',
                priority: 'high',
                category: 'technical',
                status: 'pending',
                estimatedValue: 50000000,
                confidence: 88
            });
            // Revenue generation
            suggestions.push({
                title: 'Launch Beta Revenue Streams',
                description: 'Begin monetizing core technologies through licensing agreements',
                priority: 'high',
                category: 'revenue',
                status: 'pending',
                estimatedValue: 2000000,
                confidence: 82
            });
            // System optimization
            suggestions.push({
                title: 'Scale Viral Swarm Population',
                description: 'Expand nano-agent population from 19K to 50K+ for enhanced capabilities',
                priority: 'medium',
                category: 'technical',
                status: 'pending',
                confidence: 76
            });
            res.json({
                success: true,
                suggestions: suggestions.slice(0, 3), // Return top 3 suggestions
                generated_at: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Error generating suggestions:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate suggestions'
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
