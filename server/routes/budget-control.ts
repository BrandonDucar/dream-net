import { Router } from 'express';
import { BudgetControlService } from '../services/BudgetControlService';

const router = Router();

// Set budget limit for a provider
router.post('/set-limit/:provider', (req, res) => {
  try {
    const { provider } = req.params;
    const { monthly_usd } = req.body;
    
    if (typeof monthly_usd !== 'number' || monthly_usd < 0) {
      return res.status(400).json({
        error: 'Invalid monthly_usd value. Must be a non-negative number.'
      });
    }
    
    BudgetControlService.setBudgetLimit(provider, monthly_usd);
    
    res.json({
      success: true,
      provider,
      monthly_usd,
      message: `Budget limit set to $${monthly_usd} for ${provider}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to set budget limit',
      message: error.message
    });
  }
});

// Get budget status for a provider
router.get('/status/:provider', (req, res) => {
  try {
    const { provider } = req.params;
    const status = BudgetControlService.getBudgetStatus(provider);
    
    res.json({
      success: true,
      provider,
      budget: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get budget status',
      message: error.message
    });
  }
});

// Get all budget statuses
router.get('/status', (req, res) => {
  try {
    const budgets = BudgetControlService.getAllBudgets();
    
    res.json({
      success: true,
      budgets,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get budget statuses',
      message: error.message
    });
  }
});

// Check if request is within budget
router.post('/check/:provider', (req, res) => {
  try {
    const { provider } = req.params;
    const { estimated_cost = 0 } = req.body;
    
    const check = BudgetControlService.checkBudget(provider, estimated_cost);
    
    res.json({
      success: true,
      provider,
      estimated_cost,
      check,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to check budget',
      message: error.message
    });
  }
});

// Record usage for a provider
router.post('/record-usage/:provider', (req, res) => {
  try {
    const { provider } = req.params;
    const { cost } = req.body;
    
    if (typeof cost !== 'number' || cost < 0) {
      return res.status(400).json({
        error: 'Invalid cost value. Must be a non-negative number.'
      });
    }
    
    BudgetControlService.recordUsage(provider, cost);
    const status = BudgetControlService.getBudgetStatus(provider);
    
    res.json({
      success: true,
      provider,
      recorded_cost: cost,
      updated_status: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to record usage',
      message: error.message
    });
  }
});

// Reset budget for a provider
router.post('/reset/:provider', (req, res) => {
  try {
    const { provider } = req.params;
    
    BudgetControlService.resetBudget(provider);
    const status = BudgetControlService.getBudgetStatus(provider);
    
    res.json({
      success: true,
      provider,
      reset_status: status,
      message: `Budget reset for ${provider}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to reset budget',
      message: error.message
    });
  }
});

export default router;