import { BaseMiniApp, MiniAppManifest } from "../types";

const miniApps: Map<string, BaseMiniApp> = new Map();
const manifests: Map<string, MiniAppManifest> = new Map();

export const MiniAppStore = {
  addMiniApp(app: BaseMiniApp): BaseMiniApp {
    miniApps.set(app.id, app);
    return app;
  },

  getMiniApp(id: string): BaseMiniApp | undefined {
    return miniApps.get(id);
  },

  listMiniApps(): BaseMiniApp[] {
    return Array.from(miniApps.values());
  },

  listActiveMiniApps(): BaseMiniApp[] {
    return Array.from(miniApps.values()).filter((a) => a.status === "active");
  },

  listByCategory(category: BaseMiniApp["category"]): BaseMiniApp[] {
    return Array.from(miniApps.values()).filter((a) => a.category === category);
  },

  updateMiniApp(id: string, updates: Partial<BaseMiniApp>): boolean {
    const app = miniApps.get(id);
    if (!app) return false;
    Object.assign(app, updates);
    app.updatedAt = Date.now();
    miniApps.set(id, app);
    return true;
  },

  // Manifests
  addManifest(appId: string, manifest: MiniAppManifest): MiniAppManifest {
    manifests.set(appId, manifest);
    return manifest;
  },

  getManifest(appId: string): MiniAppManifest | undefined {
    return manifests.get(appId);
  },
};

