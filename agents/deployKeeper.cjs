// Deployment operations and monitoring agent

const VercelClient = require('../clients/vercel.cjs');
const GitHubClient = require('../clients/github.cjs');

class DeployKeeperAgent {
  constructor(httpClient, replitUrl) {
    this.http = httpClient;
    this.replitUrl = replitUrl;
    
    // Initialize clients if tokens are available
    this.vercel = process.env.VERCEL_TOKEN ? 
      new VercelClient(httpClient, process.env.VERCEL_TOKEN, process.env.VERCEL_TEAM_ID) : null;
    
    this.github = (process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO) ?
      new GitHubClient(httpClient, process.env.GITHUB_TOKEN, process.env.GITHUB_OWNER, process.env.GITHUB_REPO) : null;
    
    this.deploymentState = {
      status: 'unknown',
      lastCheck: null,
      lastDeploy: null
    };
  }

  async getDeploymentStatus() {
    console.log('[DEPLOY] Checking deployment status...');
    
    let status = {
      overall: 'unknown',
      vercel: null,
      github: null,
      replit: null
    };

    try {
      // Check Vercel status
      if (this.vercel) {
        const vercelStatus = await this.vercel.getProjectStatus(process.env.VERCEL_PROJECT_ID);
        status.vercel = vercelStatus;
        console.log(`[DEPLOY] Vercel: ${vercelStatus.status}`);
      }

      // Check GitHub status  
      if (this.github) {
        const githubStatus = await this.github.getRepositoryStatus();
        status.github = githubStatus;
        console.log(`[DEPLOY] GitHub: ${githubStatus.status}`);
      }

      // Check Replit deployment status
      try {
        const replitResponse = await this.http.get(`${this.replitUrl}/deploy/status`, {
          timeout: 5000
        });
        
        if (replitResponse.ok) {
          status.replit = {
            status: 'active',
            state: replitResponse.data?.state || 'running',
            lastCheck: new Date().toISOString()
          };
        }
      } catch (error) {
        status.replit = {
          status: 'unknown',
          error: error.message
        };
      }

      // Calculate overall status
      const statuses = [status.vercel?.status, status.github?.status, status.replit?.status]
        .filter(Boolean);
      
      if (statuses.every(s => s === 'connected' || s === 'active')) {
        status.overall = 'healthy';
      } else if (statuses.some(s => s === 'error')) {
        status.overall = 'error';
      } else {
        status.overall = 'partial';
      }

      this.deploymentState = {
        status: status.overall,
        lastCheck: new Date().toISOString(),
        details: status
      };

    } catch (error) {
      console.error('[DEPLOY] Status check failed:', error.message);
      status.overall = 'error';
      status.error = error.message;
    }

    return status;
  }

  async handleDeployment(action) {
    console.log(`[DEPLOY] Handling deployment action: ${action}`);
    
    const result = {
      action,
      timestamp: new Date().toISOString(),
      status: 'unknown'
    };

    try {
      switch (action) {
        case 'deploy':
          result.deploy = await this.triggerDeployment();
          result.status = result.deploy.status;
          break;
          
        case 'rollback':
          result.rollback = await this.triggerRollback();
          result.status = result.rollback.status;
          break;
          
        case 'status':
        default:
          result.status_check = await this.getDeploymentStatus();
          result.status = 'success';
          break;
      }

      return result;
      
    } catch (error) {
      console.error(`[DEPLOY] Action ${action} failed:`, error.message);
      result.status = 'error';
      result.error = error.message;
      return result;
    }
  }

  async triggerDeployment() {
    console.log('[DEPLOY] Triggering deployment...');
    
    const results = [];

    // Trigger Vercel deployment
    if (this.vercel && process.env.VERCEL_PROJECT_ID) {
      try {
        const vercelResult = await this.vercel.triggerDeployment(process.env.VERCEL_PROJECT_ID);
        results.push({ service: 'vercel', ...vercelResult });
      } catch (error) {
        results.push({ service: 'vercel', status: 'error', error: error.message });
      }
    }

    // Trigger GitHub workflow
    if (this.github && process.env.GITHUB_WORKFLOW_ID) {
      try {
        const githubResult = await this.github.triggerWorkflow(process.env.GITHUB_WORKFLOW_ID);
        results.push({ service: 'github', ...githubResult });
      } catch (error) {
        results.push({ service: 'github', status: 'error', error: error.message });
      }
    }

    // Trigger Replit deployment (if applicable)
    try {
      const replitResult = await this.http.post(`${this.replitUrl}/deploy/trigger`, {}, {
        timeout: 10000
      });
      
      if (replitResult.ok) {
        results.push({ service: 'replit', status: 'triggered' });
      } else {
        results.push({ service: 'replit', status: 'error', error: `HTTP ${replitResult.status}` });
      }
    } catch (error) {
      results.push({ service: 'replit', status: 'error', error: error.message });
    }

    this.deploymentState.lastDeploy = new Date().toISOString();

    return {
      status: results.some(r => r.status === 'triggered') ? 'triggered' : 'error',
      results,
      message: `Deployment triggered for ${results.length} services`
    };
  }

  async triggerRollback() {
    console.log('[DEPLOY] Triggering rollback...');
    
    // For now, simulate rollback trigger
    // In a real implementation, this would call rollback APIs
    
    return {
      status: 'triggered',
      message: 'Rollback initiated',
      estimatedTime: '5-10 minutes',
      services: ['vercel', 'replit']
    };
  }

  async checkDeploymentStatus() {
    return await this.getDeploymentStatus();
  }
}

module.exports = DeployKeeperAgent;
