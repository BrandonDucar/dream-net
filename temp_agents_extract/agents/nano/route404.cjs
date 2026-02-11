// Nano 404 route agent - lightweight endpoint testing

class Route404Agent {
  constructor(httpClient, replitUrl) {
    this.http = httpClient;
    this.replitUrl = replitUrl;
    this.testRoutes = [
      '/',
      '/health', 
      '/agents/status',
      '/monetize/status',
      '/connector/scan',
      '/nonexistent-route-test'
    ];
  }

  async testRoute(route) {
    try {
      const response = await this.http.get(`${this.replitUrl}${route}`, {
        timeout: 3000
      });

      return {
        route,
        status: response.status,
        ok: response.ok,
        exists: response.status !== 404,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        route,
        status: 'error',
        ok: false,
        exists: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async scanRoutes() {
    console.log('[ROUTES] Scanning endpoint availability...');
    
    const results = [];
    
    for (const route of this.testRoutes) {
      const result = await this.testRoute(route);
      results.push(result);
      
      const status = result.ok ? '✓' : result.status === 404 ? '✗' : '!';
      console.log(`[ROUTES] ${status} ${route} (${result.status})`);
    }

    const summary = {
      total: results.length,
      available: results.filter(r => r.ok).length,
      missing: results.filter(r => r.status === 404).length,
      errors: results.filter(r => r.status === 'error').length
    };

    return {
      summary,
      routes: results,
      timestamp: new Date().toISOString()
    };
  }

  async quickHealthCheck() {
    const healthResult = await this.testRoute('/health');
    const rootResult = await this.testRoute('/');
    
    return {
      healthy: healthResult.ok && rootResult.ok,
      health: healthResult,
      root: rootResult,
      timestamp: new Date().toISOString()
    };
  }

  async testCustomRoute(route) {
    if (!route.startsWith('/')) {
      route = '/' + route;
    }
    
    return await this.testRoute(route);
  }
}

module.exports = Route404Agent;