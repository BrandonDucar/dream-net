import { storage } from './storage';

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
    console.log('Database unavailable, using fallback data for garden feed');
    
    // Fallback to sample data when database is not available
    const mockData: GardenFeedItem[] = [
      {
        id: "dream-0",
        name: "Dream 0",
        stage: undefined,
        score: 75,
        tags: ["ai"],
        contributors: []
      },
      {
        id: "dream-1", 
        name: "Dream 1",
        stage: undefined,
        score: 68,
        tags: ["crypto"],
        contributors: []
      },
      {
        id: "dream-2",
        name: "Dream 2", 
        stage: undefined,
        score: 82,
        tags: ["music"],
        contributors: []
      }
    ];

    return {
      gardenFeed: mockData,
      metadata: {
        totalItems: mockData.length,
        timestamp: new Date().toISOString(),
        dreamCount: mockData.filter(item => !item.stage).length,
        cocoonCount: mockData.filter(item => item.stage).length
      }
    };
  }
}