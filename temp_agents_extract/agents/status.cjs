// System status monitoring and health checking agent

class StatusAgent {
  constructor(httpClient, replitUrl) {
    this.http = httpClient;
    this.replitUrl = replitUrl;
    this.lastHealthCheck = null;
    this.systemState = {
      api: 'unknown',
      services: 'unknown', 
      database: 'unknown',
      agents: 'unknown'
    };
  }

  async checkNerves() {
    console.log('[NERVES] System health check...');
    
    const nerves = {
      api: 'red',
      services: 'red',
      database: 'red',
      agents: 'red',
      timestamp: new Date().toISOString()
    };

    try {
      // Check main API health
      const healthResponse = await this.http.get(`${this.replitUrl}/health`, {
        timeout: 5000
      });

      if (healthResponse.ok && healthResponse.data) {
        nerves.api = healthResponse.data.status === 'ok' ? 'green' : 'yellow';
        
        // Infer database health from API health
        if (nerves.api === 'green') {
          nerves.database = 'green';
        }

        console.log(`[NERVES] API: ${nerves.api}`);
      }
    } catch (error) {
      console.log(`[NERVES] API check failed: ${error.message}`);
    }

    try {
      // Check agent status
      const agentResponse = await this.http.get(`${this.replitUrl}/agents/status`, {
        timeout: 5000
      });

      if (agentResponse.ok) {
        nerves.services = 'green';
        nerves.agents = 'green';
        console.log('[NERVES] Services: green');
      }
    } catch (error) {
      console.log(`[NERVES] Services check failed: ${error.message}`);
    }

    this.systemState = nerves;
    this.lastHealthCheck = nerves.timestamp;

    // Determine if healing is needed
    const redSystems = Object.entries(nerves)
      .filter(([key, value]) => key !== 'timestamp' && value === 'red')
      .map(([key]) => key);

    nerves.needsHealing = redSystems.length > 0;
    nerves.redSystems = redSystems;

    return nerves;
  }

  async getSystemHealth() {
    if (!this.lastHealthCheck || Date.now() - new Date(this.lastHealthCheck).getTime() > 60000) {
      await this.checkNerves();
    }

    const overall = this.calculateOverallHealth();

    return {
      overall,
      ...this.systemState,
      lastCheck: this.lastHealthCheck
    };
  }

  async getFullStatus() {
    await this.checkNerves();
    
    const health = this.calculateOverallHealth();
    
    return {
      overall: health,
      api: this.systemState.api,
      services: this.systemState.services,
      database: this.systemState.database,
      agents: this.systemState.agents,
      timestamp: this.systemState.timestamp,
      details: {
        healthy: Object.entries(this.systemState)
          .filter(([key, value]) => key !== 'timestamp' && value === 'green').length,
        total: 4,
        issues: Object.entries(this.systemState)
          .filter(([key, value]) => key !== 'timestamp' && value === 'red')
          .map(([key]) => key)
      }
    };
  }

  calculateOverallHealth() {
    const healthValues = Object.entries(this.systemState)
      .filter(([key]) => key !== 'timestamp')
      .map(([, value]) => value);

    if (healthValues.includes('red')) return 'red';
    if (healthValues.includes('yellow')) return 'yellow';
    return healthValues.every(v => v === 'green') ? 'green' : 'unknown';
  }

  async triggerAutoHeal() {
    console.log('[HEAL] Auto-heal sequence initiated...');
    
    const healActions = [];
    const healResults = [];

    try {
      // If API is down, try to wake it up
      if (this.systemState.api === 'red') {
        console.log('[HEAL] API down - attempting wake');
        healActions.push('api-wake');
        
        // Simulate API wake
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // If services are down, wake agents
      if (this.systemState.services === 'red' || this.systemState.agents === 'red') {
        console.log('[HEAL] Services down - waking agents');
        healActions.push('agent-wake');
        
        const wakeResult = await this.wakeAgents();
        healResults.push(wakeResult);
      }

      // Re-check after healing attempts
      console.log('[HEAL] Re-checking system health...');
      await this.checkNerves();

      return {
        status: 'completed',
        actions: healActions,
        results: healResults,
        timestamp: new Date().toISOString(),
        postHealHealth: this.calculateOverallHealth()
      };

    } catch (error) {
      console.error('[HEAL] Auto-heal failed:', error.message);
      return {
        status: 'error',
        error: error.message,
        actions: healActions,
        timestamp: new Date().toISOString()
      };
    }
  }

  async wakeAgents() {
    console.log('[AGENTS] Waking all agents...');
    
    try {
      const response = await this.http.post(`${this.replitUrl}/agents/wake-all`, {}, {
        timeout: 10000
      });

      if (response.ok) {
        return {
          status: 'success',
          message: 'Wake signal sent to all agents',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'error',
          message: `Wake failed: ${response.status}`,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = StatusAgent;