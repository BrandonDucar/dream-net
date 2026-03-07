import axios from 'axios';
import { neynarDataSource, NeynarDataSourceService } from './NeynarDataSourceService';

/**
 * 🌉 TunnelHealthCheckService
 * 
 * Monitors and manages data ingestion from multiple sources:
 * 1. Hawk tunnel (primary) - high bandwidth, native protocol
 * 2. Cloudflare tunnel (secondary) - redundant path
 * 3. Neynar (fallback) - always available, builder-focused
 * 
 * Implements circuit breaker pattern with automatic failover
 */

interface TunnelStatus {
  name: string;
  url: string;
  healthy: boolean;
  lastCheck: number;
  latency: number;
  failureCount: number;
  failureThreshold: number;
}

interface DataSource {
  source: string;
  data: any;
  timestamp: number;
  confidence: number;
  tunnel: string;
}

export class TunnelHealthCheckService {
  private static instance: TunnelHealthCheckService;
  
  private tunnelStatuses: Map<string, TunnelStatus> = new Map();
  private checkIntervalMs = 30_000; // 30 seconds
  private checkTimer?: NodeJS.Timeout;
  private readonly FAILURE_THRESHOLD = 3;

  // Tunnel endpoints - Neynar miniapp infrastructure
  private readonly HAWK_URL = process.env.HAWK_TUNNEL_URL || 'https://miniapp-generator-fid-1477142-260218210354436.neynar.app/api/signal';
  private readonly CLOUDFLARE_URL = process.env.CLOUDFLARE_TUNNEL_URL || 'https://server-f9f443f3932a503b.dev-studio.neynar.com/api/signal';
  private readonly NEYNAR_FALLBACK = true;

  private constructor() {
    this.initializeTunnels();
  }

  public static getInstance(): TunnelHealthCheckService {
    if (!TunnelHealthCheckService.instance) {
      TunnelHealthCheckService.instance = new TunnelHealthCheckService();
    }
    return TunnelHealthCheckService.instance;
  }

  /**
   * Initialize tunnel status tracking
   */
  private initializeTunnels() {
    this.tunnelStatuses.set('hawk', {
      name: 'Hawk Tunnel',
      url: this.HAWK_URL,
      healthy: false,
      lastCheck: 0,
      latency: 0,
      failureCount: 0,
      failureThreshold: this.FAILURE_THRESHOLD
    });

    this.tunnelStatuses.set('cloudflare', {
      name: 'Cloudflare Tunnel',
      url: this.CLOUDFLARE_URL,
      healthy: false,
      lastCheck: 0,
      latency: 0,
      failureCount: 0,
      failureThreshold: this.FAILURE_THRESHOLD
    });
  }

  /**
   * Start periodic health checks
   */
  public startHealthChecks() {
    console.log('🌉 [TunnelHealthCheck] Starting tunnel monitoring...');
    
    // Check immediately
    this.checkAllTunnels();

    // Then check on interval
    this.checkTimer = setInterval(() => {
      this.checkAllTunnels();
    }, this.checkIntervalMs);
  }

  /**
   * Stop health checks
   */
  public stopHealthChecks() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = undefined;
    }
    console.log('🌉 [TunnelHealthCheck] Tunnel monitoring stopped.');
  }

  /**
   * Check all tunnels and update their status
   */
  private async checkAllTunnels() {
    const checks = Array.from(this.tunnelStatuses.entries()).map(([key, status]) =>
      this.checkTunnel(key, status)
    );

    await Promise.allSettled(checks);

    // Log summary
    const healthy = Array.from(this.tunnelStatuses.values()).filter(s => s.healthy).length;
    const total = this.tunnelStatuses.size;
    console.log(`🌉 [TunnelHealthCheck] Status: ${healthy}/${total} tunnels healthy`);
  }

  /**
   * Check a single tunnel's health
   */
  private async checkTunnel(key: string, status: TunnelStatus) {
    const start = Date.now();

    try {
      const response = await axios.get(`${status.url}/status`, {
        timeout: 5000,
        validateStatus: (code) => code < 500
      });

      const latency = Date.now() - start;
      const isHealthy = response.status === 200 && latency < 2000;

      status.latency = latency;
      status.lastCheck = Date.now();

      if (isHealthy) {
        status.healthy = true;
        status.failureCount = 0;
        console.log(`🌉 [${status.name}] ✅ Healthy (${latency}ms)`);
      } else {
        status.failureCount++;
        if (status.failureCount >= status.failureThreshold) {
          status.healthy = false;
          console.log(`🌉 [${status.name}] ❌ Unhealthy (failures: ${status.failureCount}/${status.failureThreshold})`);
        }
      }
    } catch (error: any) {
      status.failureCount++;
      status.lastCheck = Date.now();

      if (status.failureCount >= status.failureThreshold) {
        status.healthy = false;
        console.log(`🌉 [${status.name}] ❌ Error: ${error.message} (failures: ${status.failureCount}/${status.failureThreshold})`);
      }
    }
  }

  /**
   * Get data from best available tunnel with fallback chain
   * Priority: Hawk → Cloudflare → Neynar
   */
  public async fetchSignalData(signalType: string = 'trending'): Promise<DataSource> {
    // Try Hawk first
    const hawkStatus = this.tunnelStatuses.get('hawk');
    if (hawkStatus?.healthy) {
      try {
        const data = await this.fetchFromTunnel('hawk', signalType);
        if (data) {
          return {
            source: 'hawk',
            data,
            timestamp: Date.now(),
            confidence: 0.95,
            tunnel: 'hawk'
          };
        }
      } catch (error) {
        console.log(`🌉 [Hawk] Fetch failed, trying next...`);
      }
    }

    // Try Cloudflare
    const cfStatus = this.tunnelStatuses.get('cloudflare');
    if (cfStatus?.healthy) {
      try {
        const data = await this.fetchFromTunnel('cloudflare', signalType);
        if (data) {
          return {
            source: 'cloudflare',
            data,
            timestamp: Date.now(),
            confidence: 0.90,
            tunnel: 'cloudflare'
          };
        }
      } catch (error) {
        console.log(`🌉 [Cloudflare] Fetch failed, falling back to Neynar...`);
      }
    }

    // Fallback to Neynar
    console.log(`🌉 [Tunnels] All primary tunnels down or unhealthy, using Neynar fallback...`);
    return await this.fetchFromNeynarFallback(signalType);
  }

  /**
   * Fetch from a specific tunnel
   */
  private async fetchFromTunnel(tunnelKey: string, signalType: string): Promise<any> {
    const status = this.tunnelStatuses.get(tunnelKey);
    if (!status) throw new Error(`Unknown tunnel: ${tunnelKey}`);

    try {
      const response = await axios.get(
        `${status.url}?type=${signalType}&limit=20`,
        { timeout: 5000 }
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Fallback to Neynar when tunnels are unavailable
   */
  private async fetchFromNeynarFallback(signalType: string): Promise<DataSource> {
    try {
      let data;

      if (signalType === 'trending' || signalType === 'all') {
        data = await neynarDataSource.getTrending('onchain');
      } else if (signalType === 'sentiment') {
        data = await neynarDataSource.getBuilderSentiment();
      } else if (signalType.startsWith('search:')) {
        const query = signalType.substring(7);
        data = await neynarDataSource.searchBuilderContent(query, 10);
      } else {
        data = await neynarDataSource.getTrending();
      }

      return {
        source: 'neynar-fallback',
        data,
        timestamp: Date.now(),
        confidence: 0.75,
        tunnel: 'neynar'
      };
    } catch (error: any) {
      console.error(`🌉 [Neynar Fallback] Error: ${error.message}`);
      return {
        source: 'error',
        data: { error: 'All data sources unavailable' },
        timestamp: Date.now(),
        confidence: 0,
        tunnel: 'none'
      };
    }
  }

  /**
   * Get tunnel status report
   */
  public getStatusReport(): {
    hawk: TunnelStatus;
    cloudflare: TunnelStatus;
    neynar_fallback_enabled: boolean;
    primary_source: string;
    last_updated: number;
  } {
    const hawk = this.tunnelStatuses.get('hawk')!;
    const cloudflare = this.tunnelStatuses.get('cloudflare')!;

    let primarySource = 'unavailable';
    if (hawk.healthy) primarySource = 'hawk';
    else if (cloudflare.healthy) primarySource = 'cloudflare';
    else if (this.NEYNAR_FALLBACK) primarySource = 'neynar-fallback';

    return {
      hawk,
      cloudflare,
      neynar_fallback_enabled: this.NEYNAR_FALLBACK,
      primary_source: primarySource,
      last_updated: Date.now()
    };
  }

  /**
   * Force reset a tunnel (after manual intervention)
   */
  public resetTunnel(tunnelKey: string) {
    const status = this.tunnelStatuses.get(tunnelKey);
    if (status) {
      status.failureCount = 0;
      status.healthy = false;
      console.log(`🌉 [${status.name}] Reset - will be rechecked on next interval`);
    }
  }

  /**
   * Get all tunnel URLs for documentation
   */
  public getTunnelEndpoints() {
    return {
      hawk: this.HAWK_URL,
      cloudflare: this.CLOUDFLARE_URL,
      neynar_fallback_enabled: this.NEYNAR_FALLBACK
    };
  }
}

export const tunnelHealthCheck = TunnelHealthCheckService.getInstance();
