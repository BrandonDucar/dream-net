/**
 * Upstash Redis Integration Core
 * Serverless Redis for caching and rate limiting
 */

export interface UpstashRedisConfig {
  url: string;
  token: string;
}

export class UpstashRedisClient {
  private url: string;
  private token: string;

  constructor(config: UpstashRedisConfig) {
    this.url = config.url;
    this.token = config.token;
  }

  private async request(command: string, ...args: any[]): Promise<any> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([command, ...args]),
    });

    if (!response.ok) {
      throw new Error(`Upstash Redis error: ${response.statusText}`);
    }

    return response.json();
  }

  async get(key: string): Promise<string | null> {
    const result = await this.request('GET', key);
    return result.result;
  }

  async set(key: string, value: string, options?: { ex?: number }): Promise<void> {
    const args: any[] = [key, value];
    if (options?.ex) {
      args.push('EX', options.ex);
    }
    await this.request('SET', ...args);
  }

  async del(key: string): Promise<void> {
    await this.request('DEL', key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.request('EXISTS', key);
    return result.result === 1;
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.request('EXPIRE', key, seconds);
  }

  async incr(key: string): Promise<number> {
    const result = await this.request('INCR', key);
    return result.result;
  }

  async decr(key: string): Promise<number> {
    const result = await this.request('DECR', key);
    return result.result;
  }
}

export function createUpstashRedisClient(): UpstashRedisClient | null {
  const url = process.env.UPSTASH_REDIS_URL;
  const token = process.env.UPSTASH_REDIS_TOKEN;

  if (!url || !token) {
    console.warn('[Upstash Redis] ⚠️  UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN not set');
    return null;
  }

  return new UpstashRedisClient({ url, token });
}

let _upstashClient: UpstashRedisClient | null = null;

export function getUpstashRedisClient(): UpstashRedisClient | null {
  if (!_upstashClient) {
    _upstashClient = createUpstashRedisClient();
  }
  return _upstashClient;
}

