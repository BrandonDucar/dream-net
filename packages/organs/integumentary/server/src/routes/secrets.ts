import { Router } from 'express';
import { secretManager } from '../services/SecretManager';

const router = Router();

// Get all secret configurations (without actual secret values)
router.get('/secrets', (req, res) => {
  try {
    const secrets = secretManager.getAllSecrets();
    
    // Remove sensitive information before sending
    const safeSecrets = secrets.map(secret => ({
      name: secret.name,
      rotation: secret.rotation,
      location: secret.location,
      last_rotated: secret.last_rotated,
      next_rotation: secret.next_rotation,
      key_ids_active: secret.key_ids_active,
      current_key_id: secret.current_key_id
    }));
    
    res.json({
      success: true,
      secrets: safeSecrets,
      count: safeSecrets.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔐 [Secrets] Error getting secrets:', error);
    res.status(500).json({ success: false, error: 'Failed to get secrets' });
  }
});

// Get specific secret configuration
router.get('/secrets/:secretName', (req, res) => {
  try {
    const { secretName } = req.params;
    const secret = secretManager.getSecretConfig(secretName);
    
    if (!secret) {
      return res.status(404).json({ success: false, error: 'Secret not found' });
    }

    // Remove sensitive information
    const safeSecret = {
      name: secret.name,
      rotation: secret.rotation,
      location: secret.location,
      last_rotated: secret.last_rotated,
      next_rotation: secret.next_rotation,
      key_ids_active: secret.key_ids_active,
      current_key_id: secret.current_key_id
    };
    
    res.json({
      success: true,
      secret: safeSecret,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔐 [Secrets] Error getting secret config:', error);
    res.status(500).json({ success: false, error: 'Failed to get secret configuration' });
  }
});

// Get rotation status for all secrets
router.get('/secrets/status/rotation', (req, res) => {
  try {
    const rotationStatus = secretManager.getRotationStatus();
    
    res.json({
      success: true,
      rotation_status: rotationStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔐 [Secrets] Error getting rotation status:', error);
    res.status(500).json({ success: false, error: 'Failed to get rotation status' });
  }
});

// Validate all secrets are accessible
router.get('/secrets/status/validation', (req, res) => {
  try {
    const validation = secretManager.validateSecrets();
    const validCount = Object.values(validation).filter(valid => valid).length;
    const totalCount = Object.keys(validation).length;
    
    res.json({
      success: true,
      validation,
      summary: {
        valid_secrets: validCount,
        total_secrets: totalCount,
        all_valid: validCount === totalCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔐 [Secrets] Error validating secrets:', error);
    res.status(500).json({ success: false, error: 'Failed to validate secrets' });
  }
});

// Force rotation of specific secret (admin only)
router.post('/secrets/:secretName/rotate', async (req, res) => {
  try {
    const { secretName } = req.params;
    const secret = secretManager.getSecretConfig(secretName);
    
    if (!secret) {
      return res.status(404).json({ success: false, error: 'Secret not found' });
    }

    console.log(`🔄 [Secrets] Force rotation requested for ${secretName}`);
    
    const success = await secretManager.forceRotation(secretName);
    
    if (success) {
      res.json({
        success: true,
        message: `Rotation initiated for ${secretName}`,
        secret_name: secretName,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: `Failed to rotate ${secretName}`
      });
    }
  } catch (error: any) {
    console.error('🔐 [Secrets] Error forcing rotation:', error);
    res.status(500).json({ success: false, error: 'Failed to force rotation' });
  }
});

// Get SolOPS keys information (current key ID only, not actual keys)
router.get('/secrets/solops/info', (req, res) => {
  try {
    const solopsKeys = secretManager.getSolOPSKeys();
    
    // Only return metadata, never actual keys
    const keyInfo = solopsKeys.keys.map(key => ({
      key_id: key.key_id,
      created_at: key.created_at,
      expires_at: key.expires_at,
      active: key.active
    }));
    
    res.json({
      success: true,
      current_key_id: solopsKeys.current_key_id,
      keys: keyInfo,
      active_key_count: keyInfo.filter(k => k.active).length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔐 [Secrets] Error getting SolOPS info:', error);
    res.status(500).json({ success: false, error: 'Failed to get SolOPS information' });
  }
});

// Verify SolOPS signature (for testing)
router.post('/secrets/solops/verify', (req, res) => {
  try {
    const { signature, payload, key_id } = req.body;
    
    if (!signature || !payload) {
      return res.status(400).json({ 
        success: false, 
        error: 'signature and payload are required' 
      });
    }

    const isValid = secretManager.verifySolOPSSignature(signature, payload, key_id);
    
    res.json({
      success: true,
      valid: isValid,
      key_id: key_id || secretManager.getSolOPSKeys().current_key_id,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔐 [Secrets] Error verifying SolOPS signature:', error);
    res.status(500).json({ success: false, error: 'Failed to verify signature' });
  }
});

// Get secrets health summary
router.get('/secrets/health', (req, res) => {
  try {
    const validation = secretManager.validateSecrets();
    const rotationStatus = secretManager.getRotationStatus();
    
    let overallHealth = 'healthy';
    let criticalCount = 0;
    let warningCount = 0;
    
    for (const [secretName, status] of Object.entries(rotationStatus)) {
      if (status.status === 'critical') {
        criticalCount++;
        overallHealth = 'critical';
      } else if (status.status === 'warning' && overallHealth !== 'critical') {
        warningCount++;
        overallHealth = 'warning';
      }
    }
    
    const validSecrets = Object.values(validation).filter(valid => valid).length;
    const totalSecrets = Object.keys(validation).length;
    
    res.json({
      success: true,
      health: {
        overall_status: overallHealth,
        secrets_valid: `${validSecrets}/${totalSecrets}`,
        rotation_alerts: {
          critical: criticalCount,
          warning: warningCount,
          healthy: totalSecrets - criticalCount - warningCount
        }
      },
      validation,
      rotation_status: rotationStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('🔐 [Secrets] Error getting health status:', error);
    res.status(500).json({ success: false, error: 'Failed to get secrets health' });
  }
});

export default router;