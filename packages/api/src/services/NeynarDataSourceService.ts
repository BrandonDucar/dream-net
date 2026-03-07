import axios from 'axios';

/**
 * 🔮 NeynarDataSourceService
 * 
 * Enhanced Neynar integration with:
 * - Multiple builder-focused channels for rich content
 * - Fallback graceful handling when trending is limited
 * - Cross-channel content aggregation
 * - Builder community sentiment tracking
 */

interface NeynarFeed {
  channel_id: string;
  channel_name: string;
  displayName: string;
  follower_count: number;
  icon?: string;
}

interface NeynarCast {
  hash: string;
  text: string;
  author: {
    username: string;
    display_name: string;
    pfp_url?: string;
  };
  timestamp: string;
  likes: number;
  replies: number;
  recasts: number;
  parent_url?: string;
}

interface NeynarTrendingResponse {
  trending: NeynarCast[];
  channel: string;
  total_signals: number;
  timestamp: number;
}

export class NeynarDataSourceService {
  private static instance: NeynarDataSourceService;
  private apiKey: string;
  private readonly NEYNAR_BASE_URL = 'https://api.neynar.com/v2';
  
  // Builder-focused channels (fallback sources when primary trending is limited)
  private readonly BUILDER_CHANNELS = [
    'onchain',           // Primary: onchain builders
    'development',       // Secondary: dev discussions
    'ai-agents',         // AI & autonomous agent builders
    'solana',            // Solana builders
    'ethereum',          // Ethereum builders
    'llm',               // LLM applications
    'protocol-labs',     // Protocol developers
    'tools',             // Dev tools & infrastructure
    'security',          // Security-focused builders
    'payments',          // Payment tech builders
  ];

  private constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEYNAR_API_KEY || '';
  }

  public static getInstance(apiKey?: string): NeynarDataSourceService {
    if (!NeynarDataSourceService.instance) {
      NeynarDataSourceService.instance = new NeynarDataSourceService(apiKey);
    }
    return NeynarDataSourceService.instance;
  }

  /**
   * Get trending casts from primary channel with fallback to builder channels
   */
  public async getTrending(primaryChannel: string = 'trending'): Promise<NeynarTrendingResponse> {
    if (!this.apiKey) {
      return this.getEmptyResponse(primaryChannel);
    }

    try {
      // Try primary channel first
      const response = await this.fetchChannelCasts(primaryChannel, 10);
      if (response.trending.length > 3) {
        return response;
      }

      console.log(`🔮 [Neynar] Low activity on ${primaryChannel}, checking builder channels...`);
      
      // If trending is limited, aggregate from builder channels
      return await this.aggregateBuilderChannels();
    } catch (error: any) {
      console.error(`🔮 [Neynar] Error fetching trending: ${error.message}`);
      return this.getEmptyResponse(primaryChannel);
    }
  }

  /**
   * Fetch casts from a specific channel
   */
  private async fetchChannelCasts(
    channelId: string,
    limit: number = 10
  ): Promise<NeynarTrendingResponse> {
    try {
      const response = await axios.post(
        `${this.NEYNAR_BASE_URL}/farcaster/feed/trending`,
        {
          channel_id: channelId,
          limit,
          sort: 'recent'
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          },
          timeout: 8000
        }
      );

      const casts = (response.data?.casts || []).map((c: any) => ({
        hash: c.hash,
        text: c.text,
        author: {
          username: c.author?.username,
          display_name: c.author?.display_name,
          pfp_url: c.author?.pfp_url
        },
        timestamp: c.timestamp,
        likes: c.reactions?.likes_count || 0,
        replies: c.replies_count || 0,
        recasts: c.reactions?.recasts_count || 0
      }));

      return {
        trending: casts,
        channel: channelId,
        total_signals: response.data?.count || casts.length,
        timestamp: Date.now()
      };
    } catch (error: any) {
      console.error(`🔮 [Neynar] Error fetching ${channelId}: ${error.message}`);
      return {
        trending: [],
        channel: channelId,
        total_signals: 0,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Aggregate trending casts from multiple builder channels
   * Returns best content from all channels combined
   */
  private async aggregateBuilderChannels(): Promise<NeynarTrendingResponse> {
    const allCasts: NeynarCast[] = [];
    const channelResults: { [key: string]: number } = {};

    // Fetch from builder channels in parallel
    const promises = this.BUILDER_CHANNELS.map(channelId =>
      this.fetchChannelCasts(channelId, 5)
        .then(result => {
          channelResults[channelId] = result.trending.length;
          return result.trending;
        })
        .catch(() => [])
    );

    const results = await Promise.all(promises);
    
    // Combine and deduplicate
    for (const channelCasts of results) {
      allCasts.push(...channelCasts);
    }

    // Sort by engagement (likes + recasts + replies)
    const sorted = allCasts
      .sort((a, b) => {
        const scoreA = a.likes + a.recasts * 2 + a.replies;
        const scoreB = b.likes + b.recasts * 2 + b.replies;
        return scoreB - scoreA;
      })
      .slice(0, 15)  // Top 15 across all channels
      .filter((c, i, arr) => arr.findIndex(x => x.hash === c.hash) === i); // Dedupe by hash

    return {
      trending: sorted,
      channel: 'builder-aggregate',
      total_signals: sorted.length,
      timestamp: Date.now()
    };
  }

  /**
   * Get trending builder sentiment (high-signal source)
   */
  public async getBuilderSentiment(): Promise<{
    sentiment: 'positive' | 'mixed' | 'neutral';
    confidence: number;
    keywords: string[];
    builder_channels_active: number;
    top_topics: string[];
  }> {
    try {
      const response = await this.getTrending('onchain');
      
      if (response.trending.length === 0) {
        return {
          sentiment: 'neutral',
          confidence: 0.3,
          keywords: [],
          builder_channels_active: 0,
          top_topics: []
        };
      }

      const keywords: string[] = [];
      const topics: string[] = [];
      let positiveCount = 0;
      let negativeCount = 0;

      for (const cast of response.trending) {
        const text = cast.text.toLowerCase();
        
        // Sentiment keywords
        if (/(build|launch|ship|dev|protocol|smart contract|dao)/i.test(text)) {
          positiveCount++;
          keywords.push(...text.match(/(build|launch|ship|dev|protocol|smart contract|dao)/gi) || []);
        }
        if (/(bug|issue|hack|exploit|fail|error|security)/i.test(text)) {
          negativeCount++;
        }

        // Extract topics (crude but fast)
        const matches = text.match(/\b[a-z0-9]+\b/g) || [];
        topics.push(...matches.filter(m => m.length > 4 && !['that', 'this', 'have', 'from', 'with'].includes(m)));
      }

      const sentiment = positiveCount > negativeCount ? 'positive' : negativeCount > positiveCount ? 'mixed' : 'neutral';
      const confidence = Math.min(0.95, 0.5 + response.trending.length / 50);

      // Get top topics by frequency
      const topicFreq = topics.reduce((acc, t) => {
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topTopics = Object.entries(topicFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([topic]) => topic);

      return {
        sentiment,
        confidence,
        keywords: [...new Set(keywords)].slice(0, 10),
        builder_channels_active: this.BUILDER_CHANNELS.length,
        top_topics: topTopics
      };
    } catch (error: any) {
      console.error(`🔮 [Neynar] Sentiment analysis error: ${error.message}`);
      return {
        sentiment: 'neutral',
        confidence: 0,
        keywords: [],
        builder_channels_active: 0,
        top_topics: []
      };
    }
  }

  /**
   * Get Neynar channel metadata for discovery
   */
  public async getChannelInfo(channelId: string): Promise<NeynarFeed | null> {
    if (!this.apiKey) return null;

    try {
      const response = await axios.get(
        `${this.NEYNAR_BASE_URL}/farcaster/channel`,
        {
          params: { channel_id: channelId },
          headers: { 'X-API-Key': this.apiKey },
          timeout: 8000
        }
      );

      const channel = response.data?.channel;
      if (!channel) return null;

      return {
        channel_id: channel.id,
        channel_name: channel.name,
        displayName: channel.display_name,
        follower_count: channel.follower_count || 0,
        icon: channel.image_url
      };
    } catch (error: any) {
      console.error(`🔮 [Neynar] Channel info error: ${error.message}`);
      return null;
    }
  }

  /**
   * Search casts by query (for targeted builder content)
   */
  public async searchBuilderContent(query: string, limit: number = 10): Promise<NeynarCast[]> {
    if (!this.apiKey) return [];

    try {
      const response = await axios.get(
        `${this.NEYNAR_BASE_URL}/farcaster/cast/search`,
        {
          params: {
            q: query,
            limit,
            mode: 'recent'
          },
          headers: { 'X-API-Key': this.apiKey },
          timeout: 8000
        }
      );

      return (response.data?.casts || []).map((c: any) => ({
        hash: c.hash,
        text: c.text,
        author: {
          username: c.author?.username,
          display_name: c.author?.display_name,
          pfp_url: c.author?.pfp_url
        },
        timestamp: c.timestamp,
        likes: c.reactions?.likes_count || 0,
        replies: c.replies_count || 0,
        recasts: c.reactions?.recasts_count || 0
      }));
    } catch (error: any) {
      console.error(`🔮 [Neynar] Search error: ${error.message}`);
      return [];
    }
  }

  private getEmptyResponse(channel: string): NeynarTrendingResponse {
    return {
      trending: [],
      channel,
      total_signals: 0,
      timestamp: Date.now()
    };
  }
}

export const neynarDataSource = NeynarDataSourceService.getInstance();
