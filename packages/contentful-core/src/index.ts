/**
 * Contentful Integration Core
 * Headless CMS integration for DreamNet
 */

export interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  environment?: string;
  previewToken?: string;
}

export class ContentfulClient {
  private spaceId: string;
  private accessToken: string;
  private environment: string;
  private baseUrl: string;
  private previewUrl: string;

  constructor(config: ContentfulConfig) {
    this.spaceId = config.spaceId;
    this.accessToken = config.accessToken;
    this.environment = config.environment || 'master';
    this.baseUrl = `https://cdn.contentful.com/spaces/${this.spaceId}/environments/${this.environment}`;
    this.previewUrl = `https://preview.contentful.com/spaces/${this.spaceId}/environments/${this.environment}`;
  }

  /**
   * Fetch entries from Contentful
   */
  async getEntries(contentType?: string, query?: Record<string, any>) {
    const params = new URLSearchParams();
    
    if (contentType) {
      params.append('content_type', contentType);
    }
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }

    const url = `${this.baseUrl}/entries?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a specific entry by ID
   */
  async getEntry(entryId: string) {
    const url = `${this.baseUrl}/entries/${entryId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get assets from Contentful
   */
  async getAssets(query?: Record<string, any>) {
    const params = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }

    const url = `${this.baseUrl}/assets?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a specific asset by ID
   */
  async getAsset(assetId: string) {
    const url = `${this.baseUrl}/assets/${assetId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Preview API (uses preview token if available)
   */
  async previewEntry(entryId: string) {
    if (!this.previewUrl) {
      throw new Error('Preview token not configured');
    }

    const url = `${this.previewUrl}/entries/${entryId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Contentful Preview API error: ${response.statusText}`);
    }

    return response.json();
  }
}

/**
 * Create Contentful client from environment variables
 */
export function createContentfulClient(): ContentfulClient | null {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT;
  const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

  if (!spaceId || !accessToken) {
    console.warn('[Contentful] ⚠️  CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN not set');
    return null;
  }

  return new ContentfulClient({
    spaceId,
    accessToken,
    environment,
    previewToken,
  });
}

/**
 * Singleton instance
 */
let _contentfulClient: ContentfulClient | null = null;

export function getContentfulClient(): ContentfulClient | null {
  if (!_contentfulClient) {
    _contentfulClient = createContentfulClient();
  }
  return _contentfulClient;
}

