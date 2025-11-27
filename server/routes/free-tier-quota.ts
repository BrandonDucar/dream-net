/**
 * Free Tier Quota API Routes
 * Provides endpoints to check and manage Google Cloud Free Tier quota usage
 */

import { Router } from 'express';
import { FreeTierQuotaService } from '../services/FreeTierQuotaService';
import { recordCloudRunRequestUsage } from '../../packages/dreamnet-control-core/src/cloudRunGovernor';

const router = Router();

/**
 * GET /api/free-tier-quota/status
 * Get all Free Tier quota statuses
 */
router.get('/status', (_req, res) => {
  try {
    const allQuotas = FreeTierQuotaService.getAllQuotaStatuses();
    const critical = FreeTierQuotaService.getCriticalQuotas();
    const warnings = FreeTierQuotaService.getWarningQuotas();
    
    res.json({
      success: true,
      quotas: allQuotas,
      summary: {
        total: allQuotas.length,
        ok: allQuotas.filter(q => q.status === 'ok').length,
        warning: warnings.length,
        critical: critical.length,
        exceeded: allQuotas.filter(q => q.status === 'exceeded').length,
      },
      critical,
      warnings,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get quota status',
      message: error.message,
    });
  }
});

/**
 * GET /api/free-tier-quota/status/:quotaType
 * Get status for a specific quota type
 */
router.get('/status/:quotaType', (req, res) => {
  try {
    const { quotaType } = req.params;
    const status = FreeTierQuotaService.getQuotaStatus(quotaType as any);
    
    res.json({
      success: true,
      quota: status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(400).json({
      error: 'Invalid quota type or failed to get status',
      message: error.message,
    });
  }
});

/**
 * POST /api/free-tier-quota/record-usage
 * Record Cloud Run request usage
 * Body: { memoryGB: number, vcpu: number, executionSeconds: number }
 */
router.post('/record-usage', (req, res) => {
  try {
    const { memoryGB, vcpu, executionSeconds } = req.body;
    
    if (typeof memoryGB !== 'number' || typeof vcpu !== 'number' || typeof executionSeconds !== 'number') {
      return res.status(400).json({
        error: 'Invalid usage data. memoryGB, vcpu, and executionSeconds must be numbers.',
      });
    }
    
    recordCloudRunRequestUsage({
      memoryGB,
      vcpu,
      executionSeconds,
    });
    
    const requestsStatus = FreeTierQuotaService.getQuotaStatus('cloudrun-requests');
    const gbSecondsStatus = FreeTierQuotaService.getQuotaStatus('cloudrun-gb-seconds');
    const vcpuSecondsStatus = FreeTierQuotaService.getQuotaStatus('cloudrun-vcpu-seconds');
    
    res.json({
      success: true,
      recorded: {
        memoryGB,
        vcpu,
        executionSeconds,
      },
      quotas: {
        requests: requestsStatus,
        gbSeconds: gbSecondsStatus,
        vcpuSeconds: vcpuSecondsStatus,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to record usage',
      message: error.message,
    });
  }
});

/**
 * POST /api/free-tier-quota/reset/:quotaType
 * Reset a specific quota (admin/testing)
 */
router.post('/reset/:quotaType', (req, res) => {
  try {
    const { quotaType } = req.params;
    FreeTierQuotaService.resetQuota(quotaType as any);
    const status = FreeTierQuotaService.getQuotaStatus(quotaType as any);
    
    res.json({
      success: true,
      message: `Quota ${quotaType} reset`,
      quota: status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to reset quota',
      message: error.message,
    });
  }
});

export default router;

