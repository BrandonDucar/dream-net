import { Dream } from '@/components/DreamNodeCard';
import mockDreams from '@/data/mockDreams';

// Database utility functions for dreams
// Note: Using mock data as fallback since database endpoint is disabled

let dreamStorage: Dream[] = [...mockDreams];

export async function getAllDreams(): Promise<Dream[]> {
  try {
    // In a real implementation, this would fetch from the API
    // const response = await fetch('/api/dreams');
    // return await response.json();
    
    // Using mock data for now
    return dreamStorage;
  } catch (error) {
    console.error('Failed to fetch dreams:', error);
    return dreamStorage; // Fallback to mock data
  }
}

export async function getDreamById(dreamId: string): Promise<Dream | null> {
  try {
    // In a real implementation:
    // const response = await fetch(`/api/dreams/${dreamId}`);
    // return await response.json();
    
    // Using mock data for now
    return dreamStorage.find(dream => dream.dreamId === dreamId) || null;
  } catch (error) {
    console.error('Failed to fetch dream:', error);
    return null;
  }
}

export async function saveDream(dream: Dream): Promise<Dream> {
  try {
    // In a real implementation:
    // const response = await fetch('/api/dreams', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dream)
    // });
    // return await response.json();
    
    // Using mock storage for now
    const existingIndex = dreamStorage.findIndex(d => d.dreamId === dream.dreamId);
    if (existingIndex >= 0) {
      dreamStorage[existingIndex] = dream;
    } else {
      dreamStorage.push(dream);
    }
    
    return dream;
  } catch (error) {
    console.error('Failed to save dream:', error);
    throw error;
  }
}

export async function createDream(dreamData: Omit<Dream, 'dreamId'>): Promise<Dream> {
  try {
    const newDream: Dream = {
      ...dreamData,
      dreamId: `dream${String(dreamStorage.length + 1).padStart(3, '0')}`
    };
    
    return await saveDream(newDream);
  } catch (error) {
    console.error('Failed to create dream:', error);
    throw error;
  }
}

export async function updateDreamMetrics(dreamId: string, metrics: Partial<Dream['metrics']>): Promise<Dream | null> {
  try {
    const dream = await getDreamById(dreamId);
    if (!dream) return null;
    
    const updatedDream: Dream = {
      ...dream,
      metrics: { ...dream.metrics, ...metrics }
    };
    
    return await saveDream(updatedDream);
  } catch (error) {
    console.error('Failed to update dream metrics:', error);
    return null;
  }
}