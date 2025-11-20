/**
 * DreamClouds API Helpers
 * Functions to fetch DreamCloud data from backend
 */

export interface DreamCloud {
  id: string;
  name: string;
  description?: string;
  chains?: string[];
  dreams?: number;
  status?: string;
  createdAt?: number;
}

/**
 * Get all DreamClouds
 */
export async function getAllDreamClouds(): Promise<DreamCloud[]> {
  try {
    const response = await fetch('/api/dream-clouds');
    if (!response.ok) throw new Error('Failed to fetch dream clouds');
    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data)) return data;
    if (data.clouds) return data.clouds;
    if (data.data) return Array.isArray(data.data) ? data.data : [];
    
    return [];
  } catch (error) {
    console.error('Error fetching dream clouds:', error);
    return [];
  }
}

/**
 * Get DreamCloud by ID
 */
export async function getDreamCloudById(id: string): Promise<DreamCloud | null> {
  try {
    const response = await fetch(`/api/dream-clouds/${id}`);
    if (!response.ok) throw new Error('Failed to fetch dream cloud');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dream cloud:', error);
    return null;
  }
}

