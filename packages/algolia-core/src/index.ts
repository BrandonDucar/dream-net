/**
 * Algolia Search Integration Core
 * Fast, relevant search for DreamNet content
 */

export interface AlgoliaConfig {
  appId: string;
  apiKey: string;
  indexName?: string;
}

export interface AlgoliaSearchOptions {
  query: string;
  filters?: string;
  hitsPerPage?: number;
  page?: number;
  attributesToRetrieve?: string[];
  attributesToHighlight?: string[];
}

export interface AlgoliaSearchResponse<T = any> {
  hits: T[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
}

export class AlgoliaClient {
  private appId: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(config: AlgoliaConfig) {
    this.appId = config.appId;
    this.apiKey = config.apiKey;
    this.baseUrl = `https://${config.appId}-dsn.algolia.net`;
  }

  async search<T = any>(indexName: string, options: AlgoliaSearchOptions): Promise<AlgoliaSearchResponse<T>> {
    const params = new URLSearchParams();
    params.append('query', options.query);
    
    if (options.filters) params.append('filters', options.filters);
    if (options.hitsPerPage) params.append('hitsPerPage', String(options.hitsPerPage));
    if (options.page) params.append('page', String(options.page));
    if (options.attributesToRetrieve) {
      options.attributesToRetrieve.forEach(attr => params.append('attributesToRetrieve[]', attr));
    }
    if (options.attributesToHighlight) {
      options.attributesToHighlight.forEach(attr => params.append('attributesToHighlight[]', attr));
    }

    const response = await fetch(`${this.baseUrl}/1/indexes/${indexName}/query`, {
      method: 'POST',
      headers: {
        'X-Algolia-Application-Id': this.appId,
        'X-Algolia-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        params: params.toString(),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Algolia API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  async addObject<T = any>(indexName: string, object: T, objectID?: string): Promise<{ objectID: string }> {
    const url = objectID 
      ? `${this.baseUrl}/1/indexes/${indexName}/${objectID}`
      : `${this.baseUrl}/1/indexes/${indexName}`;
    
    const response = await fetch(url, {
      method: objectID ? 'PUT' : 'POST',
      headers: {
        'X-Algolia-Application-Id': this.appId,
        'X-Algolia-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(object),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Algolia API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  async deleteObject(indexName: string, objectID: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/1/indexes/${indexName}/${objectID}`, {
      method: 'DELETE',
      headers: {
        'X-Algolia-Application-Id': this.appId,
        'X-Algolia-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Algolia API error: ${response.status} ${error}`);
    }
  }
}

export function createAlgoliaClient(): AlgoliaClient | null {
  const appId = process.env.ALGOLIA_APP_ID;
  const apiKey = process.env.ALGOLIA_API_KEY;

  if (!appId || !apiKey) {
    console.warn('[Algolia] ⚠️  ALGOLIA_APP_ID or ALGOLIA_API_KEY not set');
    return null;
  }

  return new AlgoliaClient({ appId, apiKey });
}

let _algoliaClient: AlgoliaClient | null = null;

export function getAlgoliaClient(): AlgoliaClient | null {
  if (!_algoliaClient) {
    _algoliaClient = createAlgoliaClient();
  }
  return _algoliaClient;
}

