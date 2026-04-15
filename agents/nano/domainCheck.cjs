// Nano domain check agent - lightweight connectivity monitoring

class DomainCheckAgent {
  constructor(httpClient) {
    this.http = httpClient;
    this.domain = process.env.PRIMARY_DOMAIN;
  }

  async quickPing() {
    if (!this.domain) {
      return {
        status: 'not_configured',
        error: 'PRIMARY_DOMAIN not set'
      };
    }

    const startTime = Date.now();
    
    try {
      // Try HTTPS first
      const response = await this.http.get(`https://${this.domain}`, {
        timeout: 5000
      });

      const responseTime = Date.now() - startTime;
      
      return {
        status: response.ok ? 'online' : 'error',
        domain: this.domain,
        ssl: true,
        responseTime: `${responseTime}ms`,
        statusCode: response.status,
        timestamp: new Date().toISOString()
      };
    } catch (httpsError) {
      // Fallback to HTTP
      try {
        const httpResponse = await this.http.get(`http://${this.domain}`, {
          timeout: 5000
        });

        const responseTime = Date.now() - startTime;

        return {
          status: httpResponse.ok ? 'online' : 'error',
          domain: this.domain,
          ssl: false,
          responseTime: `${responseTime}ms`,
          statusCode: httpResponse.status,
          warning: 'No SSL certificate',
          timestamp: new Date().toISOString()
        };
      } catch (httpError) {
        return {
          status: 'offline',
          domain: this.domain,
          error: httpError.message,
          timestamp: new Date().toISOString()
        };
      }
    }
  }

  async checkDNS() {
    if (!this.domain) {
      return { status: 'not_configured' };
    }

    // Simple DNS resolution check using a public resolver
    try {
      const response = await this.http.get(`https://1.1.1.1/dns-query?name=${this.domain}&type=A`, {
        headers: {
          'Accept': 'application/dns-json'
        },
        timeout: 3000
      });

      if (response.ok && response.data?.Answer?.length > 0) {
        return {
          status: 'resolved',
          records: response.data.Answer.map(a => a.data),
          timestamp: new Date().toISOString()
        };
      }

      return {
        status: 'no_records',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'dns_error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async getStatus() {
    const [ping, dns] = await Promise.all([
      this.quickPing(),
      this.checkDNS()
    ]);

    return {
      connectivity: ping,
      dns,
      overall: ping.status === 'online' && dns.status === 'resolved' ? 'healthy' : 'issues'
    };
  }
}

module.exports = DomainCheckAgent;
