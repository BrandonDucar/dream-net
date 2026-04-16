/**
 * Card Forge Pro API Client
 * Frontend helper for interacting with Card Forge Pro backend
 */

import type { CardCreationRequest, CardCreationResult } from '../../../packages/card-forge-pro/src';

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function createCard(request: CardCreationRequest): Promise<CardCreationResult> {
  try {
    const response = await fetch(`${API_BASE}/api/card-forge/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if needed
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create card');
    }

    const data = await response.json();
    return data.result || data;
  } catch (error: any) {
    console.error("Error creating card:", error);
    return { success: false, error: error.message };
  }
}

export async function updateCard(cardId: string, updates: Partial<CardCreationRequest>): Promise<CardCreationResult> {
  try {
    const response = await fetch(`${API_BASE}/api/card-forge/update/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update card');
    }
    const data = await response.json();
    return data.result || data;
  } catch (error: any) {
    console.error("Error updating card:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCard(cardId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/api/card-forge/${cardId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete card');
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error deleting card:", error);
    return { success: false, error: error.message };
  }
}

export async function listCards(): Promise<CardCreationResult[]> {
  try {
    const response = await fetch(`${API_BASE}/api/card-forge/list`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to list cards');
    }
    const data = await response.json();
    return data.cards || [];
  } catch (error: any) {
    console.error("Error listing cards:", error);
    return [];
  }
}

