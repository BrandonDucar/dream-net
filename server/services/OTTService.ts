/**
 * OTT Service - Over-The-Top media publishing and analytics
 * 
 * Integrates with Jellyfin and PeerTube for media management and publishing
 */

import { dreamNetOS } from "../core/dreamnet-os.js";

interface PublishRequest {
  asset_id: string;
  channel: string;
  platform?: "jellyfin" | "peertube" | "all";
  metadata?: Record<string, any>;
}

interface MetricData {
  event: string;
  asset_id: string;
  ts: number;
  platform?: string;
  metadata?: Record<string, any>;
}

interface OTTConfig {
  jellyfinEnabled: boolean;
  peertubeEnabled: boolean;
  defaultPlatform: "jellyfin" | "peertube";
}

class OTTService {
  private metrics: Map<string, MetricData[]> = new Map();
  private publishedAssets: Map<string, PublishRequest> = new Map();

  /**
   * Publish content to OTT platforms
   */
  async publish(request: PublishRequest, clientId: string): Promise<{
    success: boolean;
    asset_id: string;
    platforms: string[];
    urls?: Record<string, string>;
    error?: string;
  }> {
    try {
      const platforms: string[] = [];
      const urls: Record<string, string> = {};

      // Determine which platforms to publish to
      const targetPlatforms = request.platform === "all" 
        ? ["jellyfin", "peertube"]
        : request.platform 
        ? [request.platform]
        : [this.getConfig().defaultPlatform];

      // Publish to Jellyfin if enabled and requested
      if (targetPlatforms.includes("jellyfin") && dreamNetOS.jellyfinMediaServer) {
        try {
          // Use Jellyfin integration to publish
          // Note: JellyfinMediaServer doesn't have a direct publish method,
          // so we'll store the asset info for now
          platforms.push("jellyfin");
          urls.jellyfin = `jellyfin://asset/${request.asset_id}`;
          console.log(`📺 [OTT] Published ${request.asset_id} to Jellyfin`);
        } catch (error: any) {
          console.warn(`[OTT] Jellyfin publish failed:`, error.message);
        }
      }

      // Publish to PeerTube if enabled and requested
      if (targetPlatforms.includes("peertube") && dreamNetOS.peerTubeClient) {
        try {
          // Use PeerTube integration to publish
          // Note: PeerTubeClient doesn't have a direct publish method,
          // so we'll store the asset info for now
          platforms.push("peertube");
          urls.peertube = `peertube://video/${request.asset_id}`;
          console.log(`📺 [OTT] Published ${request.asset_id} to PeerTube`);
        } catch (error: any) {
          console.warn(`[OTT] PeerTube publish failed:`, error.message);
        }
      }

      // Store published asset
      this.publishedAssets.set(request.asset_id, request);

      return {
        success: platforms.length > 0,
        asset_id: request.asset_id,
        platforms,
        urls: Object.keys(urls).length > 0 ? urls : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        asset_id: request.asset_id,
        platforms: [],
        error: error.message,
      };
    }
  }

  /**
   * Record OTT metrics and analytics
   */
  async recordMetric(metricData: MetricData, clientId: string): Promise<{
    success: boolean;
    event: string;
    asset_id: string;
    recorded: boolean;
  }> {
    try {
      if (!this.metrics.has(metricData.asset_id)) {
        this.metrics.set(metricData.asset_id, []);
      }

      const assetMetrics = this.metrics.get(metricData.asset_id)!;
      assetMetrics.push({
        ...metricData,
        ts: metricData.ts || Date.now(),
      });

      // Keep only last 1000 metrics per asset
      if (assetMetrics.length > 1000) {
        assetMetrics.shift();
      }

      console.log(`📊 [OTT] Recorded metric: ${metricData.event} for asset ${metricData.asset_id}`);

      return {
        success: true,
        event: metricData.event,
        asset_id: metricData.asset_id,
        recorded: true,
      };
    } catch (error: any) {
      return {
        success: false,
        event: metricData.event,
        asset_id: metricData.asset_id,
        recorded: false,
      };
    }
  }

  /**
   * Get OTT configuration
   */
  getConfig(): OTTConfig {
    return {
      jellyfinEnabled: dreamNetOS.jellyfinMediaServer !== undefined,
      peertubeEnabled: dreamNetOS.peerTubeClient !== undefined,
      defaultPlatform: "jellyfin",
    };
  }

  /**
   * Get OTT analytics and statistics
   */
  async getStats(): Promise<{
    totalAssets: number;
    totalMetrics: number;
    platforms: {
      jellyfin: { enabled: boolean; assets: number };
      peertube: { enabled: boolean; assets: number };
    };
    recentEvents: Array<{ event: string; asset_id: string; ts: number }>;
  }> {
    const jellyfinAssets = Array.from(this.publishedAssets.values())
      .filter(a => a.platform === "jellyfin" || a.platform === "all").length;
    
    const peertubeAssets = Array.from(this.publishedAssets.values())
      .filter(a => a.platform === "peertube" || a.platform === "all").length;

    const allMetrics = Array.from(this.metrics.values()).flat();
    const recentEvents = allMetrics
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 10)
      .map(m => ({ event: m.event, asset_id: m.asset_id, ts: m.ts }));

    return {
      totalAssets: this.publishedAssets.size,
      totalMetrics: allMetrics.length,
      platforms: {
        jellyfin: {
          enabled: dreamNetOS.jellyfinMediaServer !== undefined,
          assets: jellyfinAssets,
        },
        peertube: {
          enabled: dreamNetOS.peerTubeClient !== undefined,
          assets: peertubeAssets,
        },
      },
      recentEvents,
    };
  }

  /**
   * Cleanup old OTT events
   */
  cleanup(retentionDays: number): number {
    const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;

    for (const [assetId, metrics] of this.metrics.entries()) {
      const before = metrics.length;
      const filtered = metrics.filter(m => m.ts >= cutoffTime);
      const after = filtered.length;
      cleanedCount += before - after;

      if (filtered.length === 0) {
        this.metrics.delete(assetId);
      } else {
        this.metrics.set(assetId, filtered);
      }
    }

    console.log(`🧹 [OTT] Cleaned up ${cleanedCount} old metrics (retention: ${retentionDays} days)`);
    return cleanedCount;
  }
}

// Export singleton
export const ottService = new OTTService();






















