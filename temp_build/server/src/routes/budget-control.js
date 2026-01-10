"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var BudgetControlService_1 = require("../services/BudgetControlService");
var router = (0, express_1.Router)();
// Set budget limit for a provider
router.post('/set-limit/:provider', function (req, res) {
    try {
        var provider = req.params.provider;
        var monthly_usd = req.body.monthly_usd;
        if (typeof monthly_usd !== 'number' || monthly_usd < 0) {
            return res.status(400).json({
                error: 'Invalid monthly_usd value. Must be a non-negative number.'
            });
        }
        BudgetControlService_1.BudgetControlService.setBudgetLimit(provider, monthly_usd);
        res.json({
            success: true,
            provider: provider,
            monthly_usd: monthly_usd,
            message: "Budget limit set to $".concat(monthly_usd, " for ").concat(provider),
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to set budget limit',
            message: error.message
        });
    }
});
// Get budget status for a provider
router.get('/status/:provider', function (req, res) {
    try {
        var provider = req.params.provider;
        var status_1 = BudgetControlService_1.BudgetControlService.getBudgetStatus(provider);
        res.json({
            success: true,
            provider: provider,
            budget: status_1,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to get budget status',
            message: error.message
        });
    }
});
// Get all budget statuses
router.get('/status', function (req, res) {
    try {
        var budgets = BudgetControlService_1.BudgetControlService.getAllBudgets();
        res.json({
            success: true,
            budgets: budgets,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to get budget statuses',
            message: error.message
        });
    }
});
// Check if request is within budget
router.post('/check/:provider', function (req, res) {
    try {
        var provider = req.params.provider;
        var _a = req.body.estimated_cost, estimated_cost = _a === void 0 ? 0 : _a;
        var check = BudgetControlService_1.BudgetControlService.checkBudget(provider, estimated_cost);
        res.json({
            success: true,
            provider: provider,
            estimated_cost: estimated_cost,
            check: check,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to check budget',
            message: error.message
        });
    }
});
// Record usage for a provider
router.post('/record-usage/:provider', function (req, res) {
    try {
        var provider = req.params.provider;
        var cost = req.body.cost;
        if (typeof cost !== 'number' || cost < 0) {
            return res.status(400).json({
                error: 'Invalid cost value. Must be a non-negative number.'
            });
        }
        BudgetControlService_1.BudgetControlService.recordUsage(provider, cost);
        var status_2 = BudgetControlService_1.BudgetControlService.getBudgetStatus(provider);
        res.json({
            success: true,
            provider: provider,
            recorded_cost: cost,
            updated_status: status_2,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to record usage',
            message: error.message
        });
    }
});
// Reset budget for a provider
router.post('/reset/:provider', function (req, res) {
    try {
        var provider = req.params.provider;
        BudgetControlService_1.BudgetControlService.resetBudget(provider);
        var status_3 = BudgetControlService_1.BudgetControlService.getBudgetStatus(provider);
        res.json({
            success: true,
            provider: provider,
            reset_status: status_3,
            message: "Budget reset for ".concat(provider),
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to reset budget',
            message: error.message
        });
    }
});
exports.default = router;
