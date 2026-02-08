// Nano Vercel status agent - lightweight deployment monitoring

class VercelStatusAgent {
  constructor(httpClient) {
    this.http = httpClient;
    this.token = process.env.VERCEL_TOKEN;
    this.teamId = process.env.VERCEL_TEAM_ID;
    this.projectId = process.env.VERCEL_PROJECT_ID;
  }

  async quickCheck() {
    if (!this.token) {
      return {
        status: 'not_configured',
        error: 'VERCEL_TOKEN not set'
      };
    }

    try {
      // Quick user check
      const response = await this.http.get('https://api.vercel.com/v2/user', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        timeout: 3000
      });

      if (response.ok) {
        return {
          status: 'connected',
          user: response.data?.user?.username,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'error',
          error: `HTTP ${response.status}`,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async getLatestDeployment() {
    if (!this.token || !this.projectId) {
      return null;
    }

    try {
      const url = `https://api.vercel.com/v6/deployments?projectId=${this.projectId}&limit=1${this.teamId ? `&teamId=${this.teamId}` : ''}`;
      
      const response = await this.http.get(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        timeout: 5000
      });

      if (response.ok && response.data?.deployments?.length > 0) {
        const deployment = response.data.deployments[0];
        return {
          id: deployment.id,
          state: deployment.state,
          url: deployment.url,
          createdAt: deployment.createdAt,
          ready: deployment.ready
        };
      }

      return null;
    } catch (error) {
      console.error('[VERCEL] Get latest deployment failed:', error.message);
      return null;
    }
  }

  async getStatus() {
    const check = await this.quickCheck();
    
    if (check.status === 'connected') {
      const deployment = await this.getLatestDeployment();
      check.latestDeployment = deployment;
    }

    return check;
  }
}

module.exports = VercelStatusAgent;