import {
  BaseMiniApp,
  MiniAppManifest,
  MiniAppCategory,
} from './types.js';
import { MiniAppStore } from './store/miniAppStore.js';
import { createMiniApp, deployMiniApp, createDefaultMiniApps } from './logic/miniAppFactory.js';

export const BaseMiniApps = {
  // Factory
  createMiniApp(
    name: string,
    description: string,
    category: MiniAppCategory,
    options?: {
      features?: string[];
      requiresPassport?: boolean;
      passportTier?: string[];
      integratesWith?: string[];
      iconUrl?: string;
      colorScheme?: { primary: string; secondary: string };
    }
  ): BaseMiniApp {
    return createMiniApp(name, description, category, options);
  },

  createDefaultMiniApps(): BaseMiniApp[] {
    return createDefaultMiniApps();
  },

  deployMiniApp(
    appId: string,
    contractAddress: string,
    deploymentTx: string
  ): boolean {
    return deployMiniApp(appId, contractAddress, deploymentTx);
  },

  // Queries
  getMiniApp(id: string): BaseMiniApp | undefined {
    return MiniAppStore.getMiniApp(id);
  },

  listMiniApps(): BaseMiniApp[] {
    return MiniAppStore.listMiniApps();
  },

  listActiveMiniApps(): BaseMiniApp[] {
    return MiniAppStore.listActiveMiniApps();
  },

  listByCategory(category: MiniAppCategory): BaseMiniApp[] {
    return MiniAppStore.listByCategory(category);
  },

  updateMiniApp(id: string, updates: Partial<BaseMiniApp>): boolean {
    return MiniAppStore.updateMiniApp(id, updates);
  },

  // Manifests
  addManifest(appId: string, manifest: MiniAppManifest): MiniAppManifest {
    return MiniAppStore.addManifest(appId, manifest);
  },

  getManifest(appId: string): MiniAppManifest | undefined {
    return MiniAppStore.getManifest(appId);
  },
};

export * from './types.js';
export default BaseMiniApps;

