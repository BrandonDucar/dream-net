import { storage } from './storage.js';

export interface GardenFeedItem {
  id: string;
  name: string;
  stage?: string;
  score: number;
  tags: string[];
  contributors: Array<{
    wallet: string;
    role: string;
    addedAt?: Date;
  }>;
  lastUpdated?: Date;
  creatorWallet?: string;
}

export interface GardenFeedResponse {
  gardenFeed: GardenFeedItem[];
  metadata: {
    totalItems: number;
    timestamp: string;
    dreamCount: number;
    cocoonCount: number;
  };
}

/**
 * Get the garden feed data with dreams and cocoons
 * Falls back to mock data if database is unavailable
 */
export async function getGardenFeed(): Promise<GardenFeedResponse> {
  try {
    // Try to get data from storage (database)
    const feedData = await storage.getSimpleGardenFeed();

    return {
      gardenFeed: feedData.map(item => ({
        id: item.id,
        name: item.name,
        stage: item.stage,
        score: item.score,
        tags: item.tags,
        contributors: item.contributors
      })),
      metadata: {
        totalItems: feedData.length,
        timestamp: new Date().toISOString(),
        dreamCount: feedData.filter(item => !item.stage).length,
        cocoonCount: feedData.filter(item => item.stage).length
      }
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ [GARDEN] Database unavailable in production:', error);
      throw new Error('Database unavailable');
    }

    console.log('⚠️ [GARDEN] Database unavailable, using fallback data for local development');

    // Fallback only for development
    const mockData: GardenFeedItem[] = [
      {
        id: "dev-mock-0",
        name: "Development Dream (Mock)",
        score: 99,
        tags: ["dev"],
        contributors: []
      }
    ];

    return {
      gardenFeed: mockData,
      metadata: {
        totalItems: mockData.length,
        timestamp: new Date().toISOString(),
        dreamCount: 1,
        cocoonCount: 0
      }
    };
  }
}