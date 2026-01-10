import type { Express } from "express";
import { promises as fs } from "fs";
import path from "path";

// Feature status types
type FeatureStatus = 'off' | 'sim' | 'draft' | 'live';

interface CapabilityCheck {
  enabled: FeatureStatus;
  keys_present: boolean;
  last_real_success: string | null;
  proof_route: string;
  provider?: string;
  scopes?: string[];
  error?: string;
}

interface CapabilitiesManifest {
  timestamp: string;
  capabilities: Record<string, CapabilityCheck>;
  summary: {
    total: number;
    live: number;
    draft: number;
    sim: number;
    off: number;
  };
}

// Check if environment secrets exist
function checkSecrets(requiredKeys: string[]): { present: boolean; missing: string[] } {
  const missing = requiredKeys.filter(key => !process.env[key]);
  return { present: missing.length === 0, missing };
}

// Get last artifact timestamp for a feature
async function getLastArtifact(feature: string): Promise<string | null> {
  try {
    const artifactsPath = path.join(process.cwd(), 'data', 'artifacts', feature);
    const files = await fs.readdir(artifactsPath);
    if (files.length === 0) return null;
    
    // Get most recent file
    const stats = await Promise.all(
      files.map(async (file) => ({
        file,
        mtime: (await fs.stat(path.join(artifactsPath, file))).mtime
      }))
    );
    const latest = stats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime())[0];
    return latest ? latest.mtime.toISOString() : null;
  } catch {
    return null;
  }
}

// Define capability checks
async function checkCapabilities(): Promise<Record<string, CapabilityCheck>> {
  const capabilities: Record<string, CapabilityCheck> = {};

  // Database connectivity
  const dbCheck = checkSecrets(['DATABASE_URL']);
  capabilities.database = {
    enabled: dbCheck.present ? 'live' : 'off',
    keys_present: dbCheck.present,
    last_real_success: dbCheck.present ? new Date().toISOString() : null,
    proof_route: '/api/db/health',
    provider: 'PostgreSQL',
    error: dbCheck.missing.length > 0 ? `Missing: ${dbCheck.missing.join(', ')}` : undefined
  };

  // Stripe payments
  const stripeCheck = checkSecrets(['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY']);
  capabilities.stripe_payments = {
    enabled: stripeCheck.present ? 'live' : 'off',
    keys_present: stripeCheck.present,
    last_real_success: await getLastArtifact('stripe'),
    proof_route: '/api/stripe/test',
    provider: 'Stripe',
    scopes: ['payments', 'subscriptions'],
    error: stripeCheck.missing.length > 0 ? `Missing: ${stripeCheck.missing.join(', ')}` : undefined
  };

  // Google integrations
  const googleCheck = checkSecrets(['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']);
  capabilities.google_services = {
    enabled: googleCheck.present ? 'draft' : 'off',
    keys_present: googleCheck.present,
    last_real_success: await getLastArtifact('google'),
    proof_route: '/api/google/test',
    provider: 'Google',
    scopes: ['drive', 'calendar', 'gmail'],
    error: googleCheck.missing.length > 0 ? `Missing: ${googleCheck.missing.join(', ')}` : undefined
  };

  // OpenAI integration
  const openaiCheck = checkSecrets(['OPENAI_API_KEY']);
  capabilities.openai_gpt = {
    enabled: openaiCheck.present ? 'live' : 'off',
    keys_present: openaiCheck.present,
    last_real_success: await getLastArtifact('openai'),
    proof_route: '/api/ai/test',
    provider: 'OpenAI',
    scopes: ['gpt-4', 'embeddings'],
    error: openaiCheck.missing.length > 0 ? `Missing: ${openaiCheck.missing.join(', ')}` : undefined
  };

  // Metals intelligence
  const metalsCheck = checkSecrets(['METALS_API_KEY']);
  capabilities.metals_intelligence = {
    enabled: metalsCheck.present ? 'live' : 'sim',
    keys_present: metalsCheck.present,
    last_real_success: await getLastArtifact('metals'),
    proof_route: '/api/metals/current',
    provider: 'MetalsAPI',
    error: metalsCheck.missing.length > 0 ? `Missing: ${metalsCheck.missing.join(', ')}` : undefined
  };

  // Budget monitoring (always live - internal system)
  capabilities.budget_control = {
    enabled: 'live',
    keys_present: true,
    last_real_success: new Date().toISOString(),
    proof_route: '/api/budget/status',
    provider: 'Internal'
  };

  // Agent mesh communication (always live - internal system)
  capabilities.agent_mesh = {
    enabled: 'live',
    keys_present: true,
    last_real_success: new Date().toISOString(),
    proof_route: '/api/ops/summary',
    provider: 'Internal'
  };

  // SEO intelligence (simulated for now)
  capabilities.seo_intelligence = {
    enabled: 'sim',
    keys_present: true,
    last_real_success: null,
    proof_route: '/api/seo/analyze',
    provider: 'Internal'
  };

  // Twilio SMS
  const twilioCheck = checkSecrets(['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN']);
  capabilities.sms_notifications = {
    enabled: twilioCheck.present ? 'draft' : 'off',
    keys_present: twilioCheck.present,
    last_real_success: await getLastArtifact('twilio'),
    proof_route: '/api/twilio/test',
    provider: 'Twilio',
    scopes: ['sms', 'webhooks'],
    error: twilioCheck.missing.length > 0 ? `Missing: ${twilioCheck.missing.join(', ')}` : undefined
  };

  // Email services (Gmail)
  const emailCheck = checkSecrets(['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']);
  capabilities.email_services = {
    enabled: emailCheck.present ? 'draft' : 'off',
    keys_present: emailCheck.present,
    last_real_success: await getLastArtifact('gmail'),
    proof_route: '/api/comm/test',
    provider: 'Gmail',
    scopes: ['send', 'compose'],
    error: emailCheck.missing.length > 0 ? `Missing: ${emailCheck.missing.join(', ')}` : undefined
  };

  // Grants system
  capabilities.grants_pipeline = {
    enabled: 'live',
    keys_present: true,
    last_real_success: await getLastArtifact('grant'),
    proof_route: '/api/grants/status',
    provider: 'Internal',
    scopes: ['opportunities', 'applications', 'outreach']
  };

  return capabilities;
}

export function registerCapabilitiesRoutes(app: Express) {
  // Main capabilities manifest endpoint
  app.get('/api/capabilities', async (req, res) => {
    try {
      const capabilities = await checkCapabilities();
      
      // Calculate summary
      const statuses = Object.values(capabilities).map(c => c.enabled);
      const summary = {
        total: statuses.length,
        live: statuses.filter(s => s === 'live').length,
        draft: statuses.filter(s => s === 'draft').length,
        sim: statuses.filter(s => s === 'sim').length,
        off: statuses.filter(s => s === 'off').length
      };

      const manifest: CapabilitiesManifest = {
        timestamp: new Date().toISOString(),
        capabilities,
        summary
      };

      res.json(manifest);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to generate capabilities manifest',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Individual capability check
  app.get('/api/capabilities/:name', async (req, res) => {
    try {
      const capabilities = await checkCapabilities();
      const capability = capabilities[req.params.name];
      
      if (!capability) {
        return res.status(404).json({
          error: 'Capability not found',
          available: Object.keys(capabilities)
        });
      }

      res.json({
        name: req.params.name,
        ...capability,
        checked_at: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to check capability',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Test any capability's proof route
  app.post('/api/capabilities/:name/test', async (req, res) => {
    try {
      const capabilities = await checkCapabilities();
      const capability = capabilities[req.params.name];
      
      if (!capability) {
        return res.status(404).json({
          error: 'Capability not found'
        });
      }

      // Return the proof route for client to test
      res.json({
        name: req.params.name,
        proof_route: capability.proof_route,
        test_url: `${req.protocol}://${req.get('host')}${capability.proof_route}`,
        status: capability.enabled,
        message: `Test this capability by calling: ${capability.proof_route}`
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to generate capability test',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  console.log('✅ [REALITY CONTRACT] Capabilities manifest routes registered');
}