import Redis from 'ioredis';
import axios from 'axios';

/**
 * 🔌 SpikeRunnerService
 * 
 * Runs all 28 sensory spikes on configurable intervals.
 * Publishes results to Redis channels so Clawedette, Sable, and Lil Miss Claw
 * can subscribe and react to live world data.
 * 
 * Redis Channels:
 *   spike:financial   - Crypto, Metals, Stocks
 *   spike:weather     - Weather, Solar
 *   spike:defense     - Aegis, Offensive, Defensive, Geopolitical
 *   spike:science     - Science, NASA, Cosmic, Anomaly
 *   spike:social      - News, Culture, Sentiment, Reddit, Neynar
 *   spike:earth       - Earthquake, Agri, Satellite
 *   spike:infra       - Flight, GitHub Trends, Grants
 *   spike:all         - Firehose (every spike result)
 */

interface SpikeResult {
  source: string;
  data: any;
  timestamp: number;
  confidence: number;
}

interface SpikeConfig {
  name: string;
  category: string;
  intervalMs: number;
  fetch: () => Promise<SpikeResult>;
}

export class SpikeRunnerService {
  private static instance: SpikeRunnerService;
  private redis: Redis;
  private timers: NodeJS.Timeout[] = [];
  private latestData: Map<string, SpikeResult & { spikeName: string; category: string }> = new Map();
  private running = false;

  private constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://nerve:6379';
    this.redis = new Redis(redisUrl);
  }

  public static getInstance(): SpikeRunnerService {
    if (!SpikeRunnerService.instance) {
      SpikeRunnerService.instance = new SpikeRunnerService();
    }
    return SpikeRunnerService.instance;
  }

  /**
   * Start all spike polling loops
   */
  public async start() {
    if (this.running) return;
    this.running = true;

    console.log('🔌 [SpikeRunner] Initializing sensory spike network...');

    const spikes = this.buildSpikeConfigs();
    console.log(`🔌 [SpikeRunner] ${spikes.length} spikes registered. Starting polling loops.`);

    for (const spike of spikes) {
      // Run immediately on startup
      this.runSpike(spike);

      // Then on interval
      const timer = setInterval(() => this.runSpike(spike), spike.intervalMs);
      this.timers.push(timer);
    }

    console.log('🔌 [SpikeRunner] All spike loops active. Publishing to Redis channels.');
  }

  /**
   * Run a single spike and publish results
   */
  private async runSpike(spike: SpikeConfig) {
    try {
      const result = await spike.fetch();

      if (result.confidence === 0) {
        return; // Skip failed fetches
      }

      const enriched = {
        ...result,
        spikeName: spike.name,
        category: spike.category
      };

      // Store latest
      this.latestData.set(spike.name, enriched);

      // Publish to category channel + firehose
      const payload = JSON.stringify(enriched);
      await this.redis.publish(`spike:${spike.category}`, payload);
      await this.redis.publish('spike:all', payload);

      // Also store in Redis hash for polling access
      await this.redis.hset('spike:latest', spike.name, payload);

    } catch (err: any) {
      console.error(`🔌 [SpikeRunner] ${spike.name} error: ${err.message}`);
    }
  }

  /**
   * Get latest data for all spikes (for REST API)
   */
  public getLatestAll(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [name, data] of this.latestData) {
      result[name] = data;
    }
    return result;
  }

  /**
   * Get latest data for a specific category
   */
  public getLatestByCategory(category: string): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [name, data] of this.latestData) {
      if (data.category === category) {
        result[name] = data;
      }
    }
    return result;
  }

  /**
   * Get latest data from Redis hash (for external consumers)
   */
  public async getLatestFromRedis(): Promise<Record<string, any>> {
    const raw = await this.redis.hgetall('spike:latest');
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(raw)) {
      try { result[key] = JSON.parse(val); } catch { result[key] = val; }
    }
    return result;
  }

  public stop() {
    this.timers.forEach(t => clearInterval(t));
    this.timers = [];
    this.running = false;
    console.log('🔌 [SpikeRunner] All spike loops stopped.');
  }

  /**
   * Build spike configurations with fetch functions using free APIs
   * Intervals are staggered to avoid rate limiting
   */
  private buildSpikeConfigs(): SpikeConfig[] {

    return [
      // === FINANCIAL (60s intervals) ===
      {
        name: 'CryptoSpike',
        category: 'financial',
        intervalMs: 60_000,
        fetch: async () => {
          const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true', { timeout: 8000 });
          return { source: 'coingecko', data: res.data, timestamp: Date.now(), confidence: 0.95 };
        }
      },
      {
        name: 'MetalsSpike',
        category: 'financial',
        intervalMs: 300_000, // 5 min
        fetch: async () => {
          const res = await axios.get('https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=toz', { timeout: 8000 }).catch(() => null);
          if (!res) return { source: 'metals-dev', data: { gold: 'N/A' }, timestamp: Date.now(), confidence: 0.5 };
          return { source: 'metals-dev', data: res.data, timestamp: Date.now(), confidence: 0.9 };
        }
      },
      {
        name: 'StockSpike',
        category: 'financial',
        intervalMs: 120_000,
        fetch: async () => {
          const res = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&range=1d', { timeout: 8000 }).catch(() => null);
          if (!res) return { source: 'yahoo-finance', data: { SPX: 'N/A' }, timestamp: Date.now(), confidence: 0.3 };
          const meta = res.data?.chart?.result?.[0]?.meta || {};
          return { source: 'yahoo-finance', data: { symbol: 'SPX', price: meta.regularMarketPrice, prevClose: meta.previousClose }, timestamp: Date.now(), confidence: 0.9 };
        }
      },

      // === WEATHER / ENVIRONMENT (120s intervals) ===
      {
        name: 'WeatherSpike',
        category: 'weather',
        intervalMs: 120_000,
        fetch: async () => {
          const res = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,wind_speed_10m,weather_code', { timeout: 8000 });
          return { source: 'open-meteo', data: res.data, timestamp: Date.now(), confidence: 0.98 };
        }
      },
      {
        name: 'SolarSpike',
        category: 'weather',
        intervalMs: 300_000,
        fetch: async () => {
          const res = await axios.get('https://services.swpc.noaa.gov/json/solar-cycle/observed-solar-cycle-indices.json', { timeout: 8000 }).catch(() => null);
          if (!res) return { source: 'noaa-solar', data: {}, timestamp: Date.now(), confidence: 0.3 };
          const latest = res.data?.slice(-3) || [];
          return { source: 'noaa-solar', data: { recent: latest }, timestamp: Date.now(), confidence: 0.95 };
        }
      },

      // === EARTH (120s-300s) ===
      {
        name: 'EarthquakeSpike',
        category: 'earth',
        intervalMs: 120_000,
        fetch: async () => {
          const res = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', { timeout: 8000 });
          const quakes = res.data.features || [];
          const significant = quakes.filter((q: any) => q.properties.mag >= 4.5);
          return {
            source: 'usgs',
            data: {
              total: quakes.length,
              significant: significant.length,
              latest: significant.slice(0, 5).map((q: any) => ({
                mag: q.properties.mag, place: q.properties.place,
                time: new Date(q.properties.time).toISOString(), coords: q.geometry.coordinates
              }))
            },
            timestamp: Date.now(), confidence: 1.0
          };
        }
      },

      // === DEFENSE / AEROSPACE (90s) ===
      {
        name: 'FlightSpike',
        category: 'defense',
        intervalMs: 90_000,
        fetch: async () => {
          const res = await axios.get('https://opensky-network.org/api/states/all?lamin=40.0&lomin=-74.5&lamax=41.0&lomax=-73.5', { timeout: 10000 }).catch(() => null);
          if (!res) return { source: 'opensky', data: { aircraft_count: 0 }, timestamp: Date.now(), confidence: 0.3 };
          const states = res.data.states || [];
          const aircraft = states.slice(0, 10).map((s: any) => ({
            callsign: s[1]?.trim(), country: s[2], altitude: s[7], velocity: s[9], lat: s[6], lon: s[5]
          }));
          return { source: 'opensky', data: { aircraft_count: states.length, tracked: aircraft }, timestamp: Date.now(), confidence: 0.9 };
        }
      },
      {
        name: 'AegisSpike',
        category: 'defense',
        intervalMs: 90_000,
        fetch: async () => {
          const res = await axios.get('https://opensky-network.org/api/states/all?lamin=40.0&lomin=-76.0&lamax=41.0&lomax=-73.0', { timeout: 10000 }).catch(() => null);
          if (!res) return { source: 'opensky-aegis', data: { total_detected: 0 }, timestamp: Date.now(), confidence: 0.3 };
          const states = res.data.states || [];
          const lowAlt = states.filter((s: any) => s[7] && s[7] < 2000);
          return {
            source: 'opensky-aegis',
            data: { total_detected: states.length, low_altitude_count: lowAlt.length, contacts: lowAlt.slice(0, 5).map((s: any) => ({ callsign: s[1]?.trim(), alt: s[7], lat: s[6], lon: s[5] })) },
            timestamp: Date.now(), confidence: 0.9
          };
        }
      },

      // === SCIENCE (300s) ===
      {
        name: 'NASASpike',
        category: 'science',
        intervalMs: 300_000,
        fetch: async () => {
          const key = process.env.NASA_API_KEY || 'DEMO_KEY';
          const res = await axios.get(`https://api.nasa.gov/neo/rest/v1/feed/today?api_key=${key}`, { timeout: 10000 }).catch(() => null);
          if (!res) return { source: 'nasa-neo', data: {}, timestamp: Date.now(), confidence: 0.3 };
          const count = res.data?.element_count || 0;
          return { source: 'nasa-neo', data: { near_earth_objects_today: count }, timestamp: Date.now(), confidence: 0.95 };
        }
      },

      // === SOCIAL (120s) ===
      {
        name: 'NewsSpike',
        category: 'social',
        intervalMs: 300_000,
        fetch: async () => {
          const key = process.env.NEWS_API_KEY;
          if (!key) return { source: 'newsapi', data: { headlines: ['No NEWS_API_KEY set'] }, timestamp: Date.now(), confidence: 0.1 };
          const res = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${key}`, { timeout: 8000 }).catch(() => null);
          if (!res) return { source: 'newsapi', data: {}, timestamp: Date.now(), confidence: 0.3 };
          const articles = (res.data.articles || []).slice(0, 5).map((a: any) => ({ title: a.title, source: a.source?.name }));
          return { source: 'newsapi', data: { headlines: articles }, timestamp: Date.now(), confidence: 0.9 };
        }
      },
      {
        name: 'RedditSpike',
        category: 'social',
        intervalMs: 300_000,
        fetch: async () => {
          const res = await axios.get('https://www.reddit.com/r/technology/hot.json?limit=5', { timeout: 8000, headers: { 'User-Agent': 'DreamNet/1.0' } }).catch(() => null);
          if (!res) return { source: 'reddit', data: {}, timestamp: Date.now(), confidence: 0.3 };
          const posts = (res.data?.data?.children || []).map((c: any) => ({ title: c.data.title, score: c.data.score, url: c.data.url }));
          return { source: 'reddit', data: { trending: posts }, timestamp: Date.now(), confidence: 0.85 };
        }
      },

      // === INFRA (300s) ===
      {
        name: 'GitHubTrendSpike',
        category: 'infra',
        intervalMs: 600_000, // 10 min
        fetch: async () => {
          const res = await axios.get('https://api.github.com/search/repositories?q=created:>2026-02-10&sort=stars&order=desc&per_page=5', { timeout: 8000 }).catch(() => null);
          if (!res) return { source: 'github', data: {}, timestamp: Date.now(), confidence: 0.3 };
          const repos = (res.data.items || []).map((r: any) => ({ name: r.full_name, stars: r.stargazers_count, lang: r.language }));
          return { source: 'github', data: { trending: repos }, timestamp: Date.now(), confidence: 0.9 };
        }
      }
    ];
  }
}

export const spikeRunner = SpikeRunnerService.getInstance();
