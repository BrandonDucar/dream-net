// Nano heartbeat agent - lightweight system pulse monitoring

class HeartbeatAgent {
  constructor(httpClient, replitUrl) {
    this.http = httpClient;
    this.replitUrl = replitUrl;
    this.lastHeartbeat = null;
    this.heartbeatInterval = 30000; // 30 seconds
    this.isRunning = false;
  }

  async sendHeartbeat() {
    try {
      const response = await this.http.get(`${this.replitUrl}/health`, {
        timeout: 3000
      });

      const heartbeat = {
        timestamp: new Date().toISOString(),
        status: response.ok ? 'alive' : 'degraded',
        responseTime: Date.now() - this.lastPing,
        statusCode: response.status
      };

      this.lastHeartbeat = heartbeat;
      console.log(`[HEARTBEAT] ${heartbeat.status} (${heartbeat.responseTime}ms)`);
      
      return heartbeat;
    } catch (error) {
      const heartbeat = {
        timestamp: new Date().toISOString(),
        status: 'dead',
        error: error.message,
        responseTime: null
      };

      this.lastHeartbeat = heartbeat;
      console.log(`[HEARTBEAT] ${heartbeat.status} - ${heartbeat.error}`);
      
      return heartbeat;
    }
  }

  async checkPulse() {
    this.lastPing = Date.now();
    return await this.sendHeartbeat();
  }

  startMonitoring() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('[HEARTBEAT] Starting continuous monitoring...');
    
    this.intervalId = setInterval(async () => {
      await this.checkPulse();
    }, this.heartbeatInterval);
    
    // Send initial heartbeat
    this.checkPulse();
  }

  stopMonitoring() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('[HEARTBEAT] Monitoring stopped');
  }

  getLastHeartbeat() {
    return this.lastHeartbeat;
  }

  isAlive() {
    if (!this.lastHeartbeat) return false;
    
    const age = Date.now() - new Date(this.lastHeartbeat.timestamp).getTime();
    return this.lastHeartbeat.status === 'alive' && age < this.heartbeatInterval * 2;
  }
}

module.exports = HeartbeatAgent;