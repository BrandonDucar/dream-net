import { Router } from 'express';
import { keymaster } from '../services/KeymasterService';
import { legalAgency } from '../services/LegalAgency';

const router = Router();

/**
 * Keymaster & Legal Agency Routes
 * Auto-manages API keys and legal compliance
 */

// Get vault status
router.get('/vault/status', async (req, res) => {
  try {
    const vaultStatus = keymaster.getVaultStatus();
    const legalStatus = legalAgency.getAgencyStatus();
    
    res.json({
      keymaster: vaultStatus,
      legal: legalStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Vault status error:', error);
    res.status(500).json({ error: 'Failed to get vault status' });
  }
});

// Auto-inject API key for service
router.post('/vault/inject-key', async (req, res) => {
  try {
    const { serviceName } = req.body;
    
    if (!serviceName) {
      return res.status(400).json({ error: 'Service name required' });
    }
    
    const key = await keymaster.injectKey(serviceName);
    
    if (key) {
      res.json({ 
        success: true, 
        message: `Key auto-injected for ${serviceName}`,
        hasKey: true 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: `No key available for ${serviceName}` 
      });
    }
  } catch (error) {
    console.error('Key injection error:', error);
    res.status(500).json({ error: 'Failed to inject key' });
  }
});

// Get auth headers for service
router.get('/vault/auth-headers/:serviceName', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const headers = keymaster.getAuthHeaders(serviceName);
    
    res.json({ headers });
  } catch (error) {
    console.error('Auth headers error:', error);
    res.status(500).json({ error: 'Failed to get auth headers' });
  }
});

// Check service key availability
router.get('/vault/check-service/:serviceName', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const hasKeys = keymaster.hasRequiredKeys(serviceName);
    
    res.json({ 
      serviceName,
      hasRequiredKeys: hasKeys,
      ready: hasKeys
    });
  } catch (error) {
    console.error('Service check error:', error);
    res.status(500).json({ error: 'Failed to check service' });
  }
});

// Run compliance audit
router.post('/legal/audit', async (req, res) => {
  try {
    const auditResults = await legalAgency.runComplianceAudit();
    res.json(auditResults);
  } catch (error) {
    console.error('Compliance audit error:', error);
    res.status(500).json({ error: 'Failed to run compliance audit' });
  }
});

// Get legal document
router.get('/legal/document/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const document = legalAgency.getLegalDocument(type);
    
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    console.error('Legal document error:', error);
    res.status(500).json({ error: 'Failed to get legal document' });
  }
});

export default router;