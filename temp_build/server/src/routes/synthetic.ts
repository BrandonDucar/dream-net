import { Router } from 'express';

const router: Router = Router();

// Synthetic monitoring is optional
let syntheticMonitoring: any = null;
try {
  const syntheticModule = require('../services/SyntheticMonitoring');
  syntheticMonitoring = syntheticModule.syntheticMonitoring;
} catch {
  console.warn("[Synthetic Router] Synthetic monitoring not available");
}

// Get all synthetic checks
router.get('/synthetic/checks', (req, res) => {
  try {
    const checks = syntheticMonitoring.getAllChecks();
    const overallStatus = syntheticMonitoring.getOverallStatus();
    
    res.json({
      success: true,
      checks,
      overall_status: overallStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔍 [Synthetic] Error getting checks:', error);
    res.status(500).json({ success: false, error: 'Failed to get synthetic checks' });
  }
});

// Get specific check details
router.get('/synthetic/checks/:checkId', (req, res) => {
  if (!syntheticMonitoring) {
    return res.status(503).json({ error: "Synthetic monitoring not available" });
  }
  try {
    const { checkId } = req.params;
    const check = syntheticMonitoring.getCheck(checkId);
    
    if (!check) {
      return res.status(404).json({ success: false, error: 'Check not found' });
    }

    const results = syntheticMonitoring.getResults(checkId, 20);
    const stats = syntheticMonitoring.getAvailabilityStats(checkId);
    
    res.json({
      success: true,
      check,
      recent_results: results,
      availability_stats: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔍 [Synthetic] Error getting check details:', error);
    res.status(500).json({ success: false, error: 'Failed to get check details' });
  }
});

// Add new synthetic check
router.post('/synthetic/checks', (req, res) => {
  if (!syntheticMonitoring) {
    return res.status(503).json({ error: "Synthetic monitoring not available" });
  }
  try {
    const { id, name, endpoint, method, interval_seconds, timeout_ms, expected_status, headers, body } = req.body;
    
    if (!id || !name || !endpoint) {
      return res.status(400).json({ 
        success: false, 
        error: 'id, name, and endpoint are required' 
      });
    }

    const check = {
      id,
      name,
      endpoint,
      method: method || 'GET',
      interval_seconds: interval_seconds || 60,
      timeout_ms: timeout_ms || 5000,
      expected_status: expected_status || 200,
      headers: headers || {},
      body,
      enabled: true
    };

    syntheticMonitoring.addCheck(check);
    
    res.json({
      success: true,
      message: 'Synthetic check added successfully',
      check
    });
  } catch (error: any) {
    console.error('🔍 [Synthetic] Error adding check:', error);
    res.status(500).json({ success: false, error: 'Failed to add synthetic check' });
  }
});

// Update synthetic check
router.put('/synthetic/checks/:checkId', (req, res) => {
  if (!syntheticMonitoring) {
    return res.status(503).json({ error: "Synthetic monitoring not available" });
  }
  try {
    const { checkId } = req.params;
    const updates = req.body;
    
    const existingCheck = syntheticMonitoring.getCheck(checkId);
    if (!existingCheck) {
      return res.status(404).json({ success: false, error: 'Check not found' });
    }

    syntheticMonitoring.updateCheck(checkId, updates);
    const updatedCheck = syntheticMonitoring.getCheck(checkId);
    
    res.json({
      success: true,
      message: 'Synthetic check updated successfully',
      check: updatedCheck
    });
  } catch (error: any) {
    console.error('🔍 [Synthetic] Error updating check:', error);
    res.status(500).json({ success: false, error: 'Failed to update synthetic check' });
  }
});

// Enable/disable synthetic check
router.post('/synthetic/checks/:checkId/:action', (req, res) => {
  if (!syntheticMonitoring) {
    return res.status(503).json({ error: "Synthetic monitoring not available" });
  }
  try {
    const { checkId, action } = req.params;
    
    if (!['enable', 'disable'].includes(action)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Action must be "enable" or "disable"' 
      });
    }

    const check = syntheticMonitoring.getCheck(checkId);
    if (!check) {
      return res.status(404).json({ success: false, error: 'Check not found' });
    }

    if (action === 'enable') {
      syntheticMonitoring.enableCheck(checkId);
    } else {
      syntheticMonitoring.disableCheck(checkId);
    }
    
    res.json({
      success: true,
      message: `Check ${action}d successfully`,
      check_id: checkId,
      enabled: action === 'enable'
    });
  } catch (error: any) {
    console.error(`🔍 [Synthetic] Error ${req.params.action}ing check:`, error);
    res.status(500).json({ success: false, error: `Failed to ${req.params.action} check` });
  }
});

// Delete synthetic check
router.delete('/synthetic/checks/:checkId', (req, res) => {
  if (!syntheticMonitoring) {
    return res.status(503).json({ error: "Synthetic monitoring not available" });
  }
  try {
    const { checkId } = req.params;
    
    const check = syntheticMonitoring.getCheck(checkId);
    if (!check) {
      return res.status(404).json({ success: false, error: 'Check not found' });
    }

    syntheticMonitoring.removeCheck(checkId);
    
    res.json({
      success: true,
      message: 'Synthetic check deleted successfully',
      check_id: checkId
    });
  } catch (error: any) {
    console.error('🔍 [Synthetic] Error deleting check:', error);
    res.status(500).json({ success: false, error: 'Failed to delete synthetic check' });
  }
});

// Get results for specific check
router.get('/synthetic/checks/:checkId/results', (req, res) => {
  if (!syntheticMonitoring) {
    return res.status(503).json({ error: "Synthetic monitoring not available" });
  }
  try {
    const { checkId } = req.params;
    const { limit } = req.query;
    
    const check = syntheticMonitoring.getCheck(checkId);
    if (!check) {
      return res.status(404).json({ success: false, error: 'Check not found' });
    }

    const results = syntheticMonitoring.getResults(checkId, limit ? parseInt(limit as string) : 50);
    const stats = syntheticMonitoring.getAvailabilityStats(checkId);
    
    res.json({
      success: true,
      check_id: checkId,
      check_name: check.name,
      results,
      availability_stats: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔍 [Synthetic] Error getting results:', error);
    res.status(500).json({ success: false, error: 'Failed to get check results' });
  }
});

// Get overall synthetic monitoring status
router.get('/synthetic/status', (req, res) => {
  if (!syntheticMonitoring) {
    return res.status(503).json({ error: "Synthetic monitoring not available" });
  }
  try {
    const overallStatus = syntheticMonitoring.getOverallStatus();
    const checks = syntheticMonitoring.getAllChecks();
    
    // Get summary of each check
    const checkSummaries = checks.map(check => ({
      id: check.id,
      name: check.name,
      endpoint: check.endpoint,
      enabled: check.enabled,
      last_check: check.last_check,
      last_success: check.last_result?.success,
      response_time: check.last_result?.response_time_ms,
      availability: syntheticMonitoring.getAvailabilityStats(check.id).uptime
    }));
    
    res.json({
      success: true,
      overall_status: overallStatus,
      checks: checkSummaries,
      summary: {
        total_checks: checks.length,
        enabled_checks: checks.filter(c => c.enabled).length,
        healthy_checks: checks.filter(c => c.last_result?.success).length,
        average_response_time: checks
          .filter(c => c.last_result?.response_time_ms)
          .reduce((sum, c) => sum + (c.last_result?.response_time_ms || 0), 0) / 
          Math.max(1, checks.filter(c => c.last_result?.response_time_ms).length)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔍 [Synthetic] Error getting status:', error);
    res.status(500).json({ success: false, error: 'Failed to get synthetic monitoring status' });
  }
});

export default router;