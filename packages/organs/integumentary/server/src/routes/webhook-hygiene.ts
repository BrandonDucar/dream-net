import { Router } from 'express';

const router: Router = Router();

// Services are optional - handle missing gracefully
let WebhookHygieneService: any = null;
let DependencySanityService: any = null;
let BlastRadiusControlService: any = null;
let webhookHygiene: any = null;
let dependencySanity: any = null;
let blastRadius: any = null;

try {
  const hygieneModule = require('../services/WebhookHygieneService');
  const sanityModule = require('../services/DependencySanityService');
  const blastModule = require('../services/BlastRadiusControlService');
  WebhookHygieneService = hygieneModule.WebhookHygieneService;
  DependencySanityService = sanityModule.DependencySanityService;
  BlastRadiusControlService = blastModule.BlastRadiusControlService;
  if (WebhookHygieneService) webhookHygiene = new WebhookHygieneService();
  if (DependencySanityService) dependencySanity = new DependencySanityService();
  if (BlastRadiusControlService) blastRadius = new BlastRadiusControlService();
} catch {
  console.warn("[Webhook Hygiene] Services not available");
}

// Webhook validation endpoint
router.post('/validate', async (req, res) => {
  if (!webhookHygiene) {
    return res.status(503).json({ error: "Webhook Hygiene Service not available" });
  }
  try {
    const { provider, signature, timestamp, eventId } = req.body;
    const payload = JSON.stringify(req.body.payload || {});

    const result = await webhookHygiene.validateWebhook(
      provider,
      signature,
      payload,
      timestamp,
      eventId
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: 'Webhook validation failed',
      message: error.message 
    });
  }
});

// Dependency audit endpoint
router.get('/audit/dependencies', async (req, res) => {
  if (!dependencySanity) {
    return res.status(503).json({ error: "Dependency Sanity Service not available" });
  }
  try {
    const audit = await dependencySanity.runDependencyAudit();
    res.json(audit);
  } catch (error) {
    res.status(500).json({ 
      error: 'Dependency audit failed',
      message: error.message 
    });
  }
});

// Generate dependency audit report
router.get('/audit/report', async (req, res) => {
  if (!dependencySanity) {
    return res.status(503).json({ error: "Dependency Sanity Service not available" });
  }
  try {
    const report = await dependencySanity.generateAuditReport();
    res.setHeader('Content-Type', 'text/plain');
    res.send(report);
  } catch (error) {
    res.status(500).json({ 
      error: 'Report generation failed',
      message: error.message 
    });
  }
});

// Blast radius control endpoints
router.get('/blast-radius/status', (req, res) => {
  if (!blastRadius) {
    return res.status(503).json({ error: "Blast Radius Service not available" });
  }
  try {
    const health = blastRadius.getIntegrationHealth();
    const stats = blastRadius.getBlastRadiusStats();
    
    res.json({
      integrationHealth: health,
      statistics: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Blast radius status failed',
      message: error.message 
    });
  }
});

router.post('/blast-radius/disable/:integration', async (req, res) => {
  if (!blastRadius) {
    return res.status(503).json({ error: "Blast Radius Service not available" });
  }
  try {
    const { integration } = req.params;
    const { reason } = req.body;
    
    await blastRadius.disableIntegration(integration, reason || 'Manual disable');
    
    res.json({
      success: true,
      message: `Integration ${integration} disabled`,
      integration,
      reason
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to disable integration',
      message: error.message 
    });
  }
});

router.post('/blast-radius/enable/:integration', async (req, res) => {
  if (!blastRadius) {
    return res.status(503).json({ error: "Blast Radius Service not available" });
  }
  try {
    const { integration } = req.params;
    
    await blastRadius.enableIntegration(integration);
    
    res.json({
      success: true,
      message: `Integration ${integration} enabled`,
      integration
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to enable integration',
      message: error.message 
    });
  }
});

router.post('/blast-radius/emergency-disable/:integration', async (req, res) => {
  if (!blastRadius) {
    return res.status(503).json({ error: "Blast Radius Service not available" });
  }
  try {
    const { integration } = req.params;
    const { reason } = req.body;
    
    await blastRadius.emergencyDisable(integration, reason || 'Emergency disable');
    
    res.json({
      success: true,
      message: `Integration ${integration} emergency disabled`,
      integration,
      reason,
      emergency: true
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to emergency disable integration',
      message: error.message 
    });
  }
});

// Webhook statistics
router.get('/stats', (req, res) => {
  if (!webhookHygiene) {
    return res.status(503).json({ error: "Webhook Hygiene Service not available" });
  }
  try {
    const stats = webhookHygiene.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get webhook stats',
      message: error.message 
    });
  }
});

// Integration flags management
router.get('/integration-flags', async (req, res) => {
  try {
    const { IntegrationFlagsService } = await import('../services/IntegrationFlagsService');
    const flags = await IntegrationFlagsService.getAllFlags();
    res.json(flags);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get integration flags',
      message: error.message 
    });
  }
});

router.post('/integration-flags/:name/enable', async (req, res) => {
  try {
    const { IntegrationFlagsService } = await import('../services/IntegrationFlagsService');
    const { name } = req.params;
    const { reason } = req.body;
    
    await IntegrationFlagsService.setIntegrationEnabled(name, true, reason);
    
    res.json({
      success: true,
      message: `Integration ${name} enabled`,
      integration: name,
      enabled: true
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to enable integration',
      message: error.message 
    });
  }
});

router.post('/integration-flags/:name/disable', async (req, res) => {
  try {
    const { IntegrationFlagsService } = await import('../services/IntegrationFlagsService');
    const { name } = req.params;
    const { reason } = req.body;
    
    await IntegrationFlagsService.setIntegrationEnabled(name, false, reason);
    
    res.json({
      success: true,
      message: `Integration ${name} disabled`,
      integration: name,
      enabled: false
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to disable integration',
      message: error.message 
    });
  }
});

router.post('/integration-flags/emergency-mode', async (req, res) => {
  try {
    const { IntegrationFlagsService } = await import('../services/IntegrationFlagsService');
    const { reason } = req.body;
    
    await IntegrationFlagsService.enableEmergencyMode(reason);
    
    res.json({
      success: true,
      message: 'Emergency mode activated',
      emergency_mode: true
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to enable emergency mode',
      message: error.message 
    });
  }
});

router.delete('/integration-flags/emergency-mode', async (req, res) => {
  try {
    const { IntegrationFlagsService } = await import('../services/IntegrationFlagsService');
    
    await IntegrationFlagsService.disableEmergencyMode();
    
    res.json({
      success: true,
      message: 'Emergency mode deactivated',
      emergency_mode: false
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to disable emergency mode',
      message: error.message 
    });
  }
});

router.get('/integration-flags/validate', async (req, res) => {
  try {
    const { IntegrationFlagsService } = await import('../services/IntegrationFlagsService');
    const validation = await IntegrationFlagsService.validateFlags();
    
    res.json(validation);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to validate flags',
      message: error.message 
    });
  }
});

// Provider Configuration Management
router.get('/providers', async (req, res) => {
  try {
    const { ProviderConfigurationService } = await import('../services/ProviderConfigurationService');
    const providers = await ProviderConfigurationService.getAllProvidersStatus();
    
    res.json({
      success: true,
      providers,
      total: providers.length,
      enabled: providers.filter(p => p.enabled).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get providers',
      message: error.message 
    });
  }
});

router.get('/providers/:name', async (req, res) => {
  try {
    const { ProviderConfigurationService } = await import('../services/ProviderConfigurationService');
    const { name } = req.params;
    
    const config = await ProviderConfigurationService.getProviderConfig(name);
    const readiness = await ProviderConfigurationService.getProviderReadiness(name);
    
    if (!config) {
      return res.status(404).json({ 
        error: 'Provider not found',
        name 
      });
    }
    
    res.json({
      success: true,
      provider: {
        name,
        config,
        readiness
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get provider',
      message: error.message 
    });
  }
});

router.post('/providers/:name/validate-flow', async (req, res) => {
  try {
    const { ProviderConfigurationService } = await import('../services/ProviderConfigurationService');
    const { name } = req.params;
    const { flowType, permission } = req.body;
    
    if (!flowType || !permission) {
      return res.status(400).json({ 
        error: 'Missing required fields: flowType, permission' 
      });
    }
    
    const hasPermission = await ProviderConfigurationService.validateFlowPermission(
      name, 
      flowType, 
      permission
    );
    
    res.json({
      success: true,
      provider: name,
      flowType,
      permission,
      hasPermission,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to validate flow permission',
      message: error.message 
    });
  }
});

router.post('/providers/:name/validate-webhook', async (req, res) => {
  try {
    const { ProviderConfigurationService } = await import('../services/ProviderConfigurationService');
    const { name } = req.params;
    const { eventType } = req.body;
    
    if (!eventType) {
      return res.status(400).json({ 
        error: 'Missing required field: eventType' 
      });
    }
    
    const isValid = await ProviderConfigurationService.validateWebhookEvent(name, eventType);
    
    res.json({
      success: true,
      provider: name,
      eventType,
      isValid,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to validate webhook event',
      message: error.message 
    });
  }
});

router.get('/providers/:name/readiness', async (req, res) => {
  try {
    const { ProviderConfigurationService } = await import('../services/ProviderConfigurationService');
    const { name } = req.params;
    
    const readiness = await ProviderConfigurationService.getProviderReadiness(name);
    
    res.json({
      success: true,
      provider: name,
      readiness,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get provider readiness',
      message: error.message 
    });
  }
});

// Integration sweep endpoint for proof plan
router.get('/sweep', async (req, res) => {
  try {
    const { ProviderConfigurationService } = await import('../services/ProviderConfigurationService');
    const { IntegrationFlagsService } = await import('../services/IntegrationFlagsService');
    
    const coreProviders = ['stripe', 'google', 'microsoft', 'openai', 'anthropic'];
    const results = [];
    const summary = {
      total: coreProviders.length,
      passing: 0,
      failing: 0,
      readStatus: { green: 0, yellow: 0, red: 0 },
      writeStatus: { green: 0, yellow: 0, red: 0 },
      timestamp: new Date().toISOString()
    };
    
    console.log('🔍 [Integration Sweep] Starting core provider validation...');
    
    for (const provider of coreProviders) {
      try {
        const config = await ProviderConfigurationService.getProviderConfig(provider);
        const readiness = await ProviderConfigurationService.getProviderReadiness(provider);
        const isEnabled = await IntegrationFlagsService.getIntegrationConfig(provider);
        
        // Test read capabilities
        let readStatus = 'red';
        let writeStatus = 'red';
        
        if (config && isEnabled?.enabled) {
          // Check read permissions
          const hasReadFlow = config.flows.Lead === 'read' || config.flows.Lead === 'read_write' || 
                             config.flows.Event === 'read' || config.flows.Event === 'read_write' ||
                             config.flows.Content === 'request_response';
          
          // Check write permissions  
          const hasWriteFlow = config.flows.Lead === 'write' || config.flows.Lead === 'read_write' || 
                              config.flows.Event === 'write' || config.flows.Event === 'read_write' ||
                              config.flows.Billing === 'write' ||
                              config.flows.Content === 'request_response';
          
          if (hasReadFlow && readiness.envConfigured) {
            readStatus = readiness.score >= 80 ? 'green' : 'yellow';
          } else if (hasReadFlow) {
            readStatus = 'yellow';
          }
          
          if (hasWriteFlow && readiness.envConfigured) {
            writeStatus = readiness.score >= 80 ? 'green' : 'yellow';
          } else if (hasWriteFlow) {
            writeStatus = 'yellow';
          }
        }
        
        summary.readStatus[readStatus]++;
        summary.writeStatus[writeStatus]++;
        
        const result = {
          provider,
          enabled: isEnabled?.enabled || false,
          readiness: readiness.score,
          readStatus,
          writeStatus,
          flows: config?.flows || {},
          envStatus: readiness.envConfigured ? 'configured' : 'missing',
          details: readiness.details
        };
        
        results.push(result);
        
        if (readStatus === 'green' && writeStatus === 'green') {
          summary.passing++;
          console.log(`✅ [Integration Sweep] ${provider}: PASS (${readiness.score}%)`);
        } else {
          summary.failing++;
          console.log(`❌ [Integration Sweep] ${provider}: FAIL (${readiness.score}%) - Read: ${readStatus}, Write: ${writeStatus}`);
        }
        
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        summary.failing++;
        results.push({
          provider,
          enabled: false,
          readiness: 0,
          readStatus: 'red',
          writeStatus: 'red',
          flows: {},
          envStatus: 'error',
          error: message
        });
        console.log(`❌ [Integration Sweep] ${provider}: ERROR - ${message}`);
      }
    }
    
    console.log(`🔍 [Integration Sweep] Complete: ${summary.passing}/${summary.total} passing`);
    
    res.json({
      success: true,
      summary,
      results,
      coreProviders,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      error: 'Integration sweep failed',
      message
    });
  }
});

export default router;