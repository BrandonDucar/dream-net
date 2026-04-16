/**
 * Dreams API Helpers
 * Functions to fetch dream data from backend
 */

export interface Dream {
  id: string;
  title?: string;
  content?: string;
  dreamId?: string;
  wallet?: string;
  createdAt?: number;
  healthScore?: number;
  engagementScore?: number;
  metrics?: {
    views: number;
    likes: number;
    remixes: number;
    shares: number;
  };
  evolutionPath?: {
    generationLevel: number;
    branchingFactor: number;
    divergenceScore: number;
  };
  remixLineage?: Array<{
    id: string;
    title: string;
  }>;
}

/**
 * Get all dreams
 */
export async function getAllDreams(): Promise<Dream[]> {
  try {
    const response = await fetch('/api/dreams');
    if (!response.ok) throw new Error('Failed to fetch dreams');
    const data = await response.json();
    // Handle different response formats
    if (Array.isArray(data)) return data;
    if (data.dreams) return data.dreams;
    if (data.data) return Array.isArray(data.data) ? data.data : [];
    return [];
  } catch (error) {
    console.error('Error fetching dreams:', error);
    return [];
  }
}

/**
 * Get dreams by wallet
 */
export async function getDreamsByWallet(wallet: string): Promise<Dream[]> {
  try {
    const response = await fetch(`/api/my-dreams?wallet=${wallet}`);
    if (!response.ok) throw new Error('Failed to fetch wallet dreams');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching wallet dreams:', error);
    return [];
  }
}

/**
 * Get dream by ID
 */
export async function getDreamById(id: string): Promise<Dream | null> {
  try {
    const response = await fetch(`/api/dreams/${id}`);
    if (!response.ok) throw new Error('Failed to fetch dream');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dream:', error);
    return null;
  }
}

/**
 * Get dreams by cloud
 */
export async function getDreamsByCloud(cloudId: string): Promise<Dream[]> {
  try {
    const response = await fetch(`/api/dream-clouds/${cloudId}/dreams`);
    if (!response.ok) throw new Error('Failed to fetch cloud dreams');
    const data = await response.json();
    return data.dreams || [];
  } catch (error) {
    console.error('Error fetching cloud dreams:', error);
    return [];
  }
}

/**
 * Get all dream clouds
 */
export async function getAllDreamClouds() {
  try {
    const response = await fetch('/api/dream-clouds');
    if (!response.ok) throw new Error('Failed to fetch dream clouds');
    const data = await response.json();
    return data.clouds || [];
  } catch (error) {
    console.error('Error fetching dream clouds:', error);
    return [];
  }
}

