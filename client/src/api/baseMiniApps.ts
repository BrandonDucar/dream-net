/**
 * API client for Base Mini-Apps
 * Fetches real mini-app data from the Base mini-apps registry
 */

import { MINI_APPS } from '@dreamnet/base-mini-apps/frontend/index.tsx';

export interface BaseMiniAppInfo {
  component: string;
  name: string;
  category: string;
  requiresPassport: boolean;
  minTier?: string;
}

export function getAllBaseMiniApps(): Record<string, BaseMiniAppInfo> {
  return MINI_APPS;
}

export function getBaseMiniAppById(id: string): BaseMiniAppInfo | undefined {
  return MINI_APPS[id];
}

export function getBaseMiniAppsByCategory(category: string): Array<{ id: string; info: BaseMiniAppInfo }> {
  return Object.entries(MINI_APPS)
    .filter(([_, info]) => info.category === category)
    .map(([id, info]) => ({ id, info }));
}

