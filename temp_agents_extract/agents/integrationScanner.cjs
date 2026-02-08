// Integration monitoring and connectivity scanner

class IntegrationScannerAgent {
  constructor(httpClient, replitUrl) {
    this.http = httpClient;
    this.replitUrl = replitUrl;
  }

  async scanIntegrations() {
    console.log('[SCAN] Scanning all integrations...');
    
    const results = {
      timestamp: new Date().toISOString(),
      integrations: {},
      summary: {
        total: 0,
        healthy: 0,
        issues: 0
      }
    };

    // Scan DreamForge internal services
    results.integrations.dreamforge = await this.scanDreamForge();
    
    // Scan external APIs
    results.integrations.openai = await this.scanOpenAI();
    results.integrations.telegram = await this.scanTelegram();
    results.integrations.github = await this.scanGitHub();
    results.integrations.vercel = await this.scanVercel();
    
    // Scan domain/connectivity
    results.integrations.domain = await this.scanDomain();

    // Calculate summary
    const integrations = Object.values(results.integrations);
    results.summary.total = integrations.length;
    results.summary.healthy = integrations.filter(i => i.status === 'healthy').length;
    results.summary.issues = integrations.filter(i => i.status === 'error').length;
    
    results.overall = results.summary.issues === 0 ? 'healthy' : 
                     results.summary.healthy > results.summary.issues ? 'partial' : 'critical';

    return results;
  }

  async scanDreamForge() {
    try {
      const response = await this.http.get(`${this.replitUrl}/health`, { timeout: 5000 });
      
      if (response.ok && response.data) {
        return {
          status: response.data.status === 'ok' ? 'healthy' : 'degraded',
          version: response.data.version,
          uptime: response.data.uptime,
          lastCheck: new Date().toISOString()
        };
      }
      
      return {
        status: 'error',
        error: `HTTP ${response.status}`,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
  }

  async scanOpenAI() {
    if (!process.env.OPENAI_API_KEY) {
      return {
        status: 'not_configured',
        error: 'OPENAI_API_KEY not set'
      };
    }

    try {
      // Simple API check
      const response = await this.http.get('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        timeout: 5000
      });

      return {
        status: response.ok ? 'healthy' : 'error',
        error: response.ok ? null : `HTTP ${response.status}`,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
  }

  async scanTelegram() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return {
        status: 'not_configured',
        error: 'TELEGRAM_BOT_TOKEN not set'
      };
    }

    try {
      const response = await this.http.get(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`,
        { timeout: 5000 }
      );

      return {
        status: response.ok ? 'healthy' : 'error',
        botInfo: response.ok ? response.data?.result : null,
        error: response.ok ? null : `HTTP ${response.status}`,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
  }

  async scanGitHub() {
    if (!process.env.GITHUB_TOKEN) {
      return {
        status: 'not_configured',
        error: 'GITHUB_TOKEN not set'
      };
    }

    try {
      const response = await this.http.get('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        timeout: 5000
      });

      return {
        status: response.ok ? 'healthy' : 'error',
        user: response.ok ? response.data?.login : null,
        error: response.ok ? null : `HTTP ${response.status}`,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
  }

  async scanVercel() {
    if (!process.env.VERCEL_TOKEN) {
      return {
        status: 'not_configured',
        error: 'VERCEL_TOKEN not set'
      };
    }

    try {
      const response = await this.http.get('https://api.vercel.com/v2/user', {
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
        },
        timeout: 5000
      });

      return {
        status: response.ok ? 'healthy' : 'error',
        user: response.ok ? response.data?.user?.username : null,
        error: response.ok ? null : `HTTP ${response.status}`,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
  }

  async scanDomain() {
    const domain = process.env.PRIMARY_DOMAIN;
    
    if (!domain) {
      return {
        status: 'not_configured',
        error: 'PRIMARY_DOMAIN not set'
      };
    }

    try {
      // Check HTTPS first
      const httpsResponse = await this.http.get(`https://${domain}`, { timeout: 5000 });
      
      if (httpsResponse.ok) {
        return {
          status: 'healthy',
          domain,
          ssl: true,
          responseTime: 'fast',
          lastCheck: new Date().toISOString()
        };
      }
    } catch (httpsError) {
      // Try HTTP fallback
      try {
        const httpResponse = await this.http.get(`http://${domain}`, { timeout: 5000 });
        
        return {
          status: httpResponse.ok ? 'healthy' : 'error',
          domain,
          ssl: false,
          warning: 'No SSL certificate',
          lastCheck: new Date().toISOString()
        };
      } catch (httpError) {
        return {
          status: 'error',
          domain,
          error: httpError.message,
          lastCheck: new Date().toISOString()
        };
      }
    }

    return {
      status: 'error',
      domain,
      error: 'Domain not accessible',
      lastCheck: new Date().toISOString()
    };
  }
}

module.exports = IntegrationScannerAgent;