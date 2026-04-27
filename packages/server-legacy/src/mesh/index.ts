import type { StarbridgeEvent } from "../starbridge/types";
import { legacyImport } from "../legacy/loader";
import { BudgetControlService } from "../services/BudgetControlService";
import { broadcastStarbridgeEvent, onStarbridgeEvent } from "../starbridge/bus";
import { StarbridgeSource, StarbridgeTopic } from "../starbridge/types";

type IntervalHandle = ReturnType<typeof setInterval>;

interface MeshHandles {
  started: boolean;
  intervals: IntervalHandle[];
  unsubscribeEvents: (() => void) | null;
  components: {
    dreamKeeper: boolean;
    defenseNet: boolean;
    surgeonAgent: boolean;
    deployKeeper: boolean;
    magneticRail: boolean;
  };
}

const EVENT_BUFFER_LIMIT = parseInt(process.env.MESH_EVENT_BUFFER ?? "200", 10);
const LOG_EVENTS = process.env.MESH_EVENT_LOG === "true";

const recentEvents: StarbridgeEvent[] = [];

const handles: MeshHandles = {
  started: false,
  intervals: [],
  unsubscribeEvents: null,
  components: {
    dreamKeeper: false,
    defenseNet: false,
    surgeonAgent: false,
    deployKeeper: false,
    magneticRail: false,
  },
};

function recordEvent(event: StarbridgeEvent) {
  recentEvents.push(event);
  if (recentEvents.length > EVENT_BUFFER_LIMIT) {
    recentEvents.shift();
  }
  if (LOG_EVENTS) {
    console.debug(
      `[starbridge] ${event.topic}.${event.type} (${event.source})`,
      event.payload ?? {},
    );
  }
}

async function startDreamKeeper() {
  if (handles.components.dreamKeeper) return;

  const module = await legacyImport<{ DREAMKEEPER_CORE?: any }>("../lib/dreamkeeperCore");
  const dreamkeeper = module?.DREAMKEEPER_CORE;
  if (!dreamkeeper) {
    console.warn("[mesh] DREAMKEEPER_CORE not available");
    return;
  }

  if (typeof dreamkeeper.init === "function") {
    dreamkeeper.init();
  }

  const interval = setInterval(() => {
    try {
      const status = dreamkeeper.getStatus?.();
      if (!status) return;

      void broadcastStarbridgeEvent(
        {
          topic: StarbridgeTopic.System,
          source: StarbridgeSource.DreamKeeper,
          type: "dreamkeeper.status",
          payload: status,
        },
        { skipPersistence: false },
      );
    } catch (error) {
      console.warn(
        `[mesh] failed to publish DreamKeeper status: ${(error as Error).message}`,
      );
    }
  }, 30_000);

  handles.intervals.push(interval);
  handles.components.dreamKeeper = true;
}

async function startDefenseNet() {
  if (handles.components.defenseNet) return;

  const module = await legacyImport<{ DreamDefenseNet?: any }>("../lib/defenseBots");
  const defenseNet = module?.DreamDefenseNet;
  if (!defenseNet) {
    console.warn("[mesh] DreamDefenseNet not available");
    return;
  }

  if (typeof defenseNet.init === "function") {
    defenseNet.init();
  }

  const interval = setInterval(() => {
    try {
      const status = defenseNet.getStatus?.();
      if (!status) return;

      void broadcastStarbridgeEvent(
        {
          topic: StarbridgeTopic.System,
          source: StarbridgeSource.Runtime,
          type: "defense.status",
          payload: status,
        },
        { skipPersistence: false },
      );
    } catch (error) {
      console.warn(
        `[mesh] failed to publish DefenseNet status: ${(error as Error).message}`,
      );
    }
  }, 15_000);

  handles.intervals.push(interval);
  handles.components.defenseNet = true;
}

async function startSurgeonAgent() {
  if (handles.components.surgeonAgent) return;

  const module = await legacyImport<{ SurgeonAgent?: any }>("../lib/aiSurgeonAgents");
  const surgeon = module?.SurgeonAgent;
  if (!surgeon) {
    console.warn("[mesh] SurgeonAgent not available");
    return;
  }

  if (typeof surgeon.init === "function") {
    surgeon.init();
  }

  handles.components.surgeonAgent = true;
}

async function startDeployKeeper() {
  if (handles.components.deployKeeper) return;

  const deployInterval = setInterval(() => {
    try {
      const budgets = BudgetControlService.getAllBudgets();

      void broadcastStarbridgeEvent(
        {
          topic: StarbridgeTopic.Governor,
          source: StarbridgeSource.DeployKeeper,
          type: "deploykeeper.status",
          payload: {
            budgets,
            timestamp: new Date().toISOString(),
          },
        },
        { skipPersistence: false },
      );
    } catch (error) {
      console.warn(
        `[mesh] failed to publish DeployKeeper status: ${(error as Error).message}`,
      );
    }
  }, 60_000);

  handles.intervals.push(deployInterval);
  handles.components.deployKeeper = true;

  await broadcastStarbridgeEvent(
    {
      topic: StarbridgeTopic.Governor,
      source: StarbridgeSource.DeployKeeper,
      type: "deploykeeper.started",
    },
    { skipPersistence: false },
  );
}

async function startMagneticRail() {
  if (handles.components.magneticRail) return;

  try {
    const schedulerModule = await legacyImport<{
      bootstrapRail?: () => void;
    }>("./magnetic-rail/scheduler");

    schedulerModule?.bootstrapRail?.();

    // Register jobs (these modules self-register when loaded)
    await Promise.allSettled([
      legacyImport("./jobs/reputation"),
      legacyImport("./jobs/vectorRollup"),
      legacyImport("./jobs/watchdog"),
    ]);

    handles.components.magneticRail = true;

    await broadcastStarbridgeEvent(
      {
        topic: StarbridgeTopic.System,
        source: StarbridgeSource.Runtime,
        type: "rail.started",
      },
      { skipPersistence: false },
    );
  } catch (error) {
    console.warn(`[mesh] failed to bootstrap Magnetic Rail: ${(error as Error).message}`);
  }
}

export async function startMesh() {
  if (handles.started) {
    return;
  }

  if (!handles.unsubscribeEvents) {
    handles.unsubscribeEvents = onStarbridgeEvent(recordEvent);
  }

  await Promise.all([
    startDreamKeeper(),
    startDefenseNet(),
    startSurgeonAgent(),
    startDeployKeeper(),
    startMagneticRail(),
  ]);

  handles.started = true;

  await broadcastStarbridgeEvent(
    {
      topic: StarbridgeTopic.System,
      source: StarbridgeSource.Runtime,
      type: "mesh.started",
    },
    { skipPersistence: false },
  );
}

export async function stopMesh() {
  handles.intervals.forEach((interval) => clearInterval(interval));
  handles.intervals.length = 0;

  if (handles.unsubscribeEvents) {
    handles.unsubscribeEvents();
    handles.unsubscribeEvents = null;
  }

  handles.components = {
    dreamKeeper: false,
    defenseNet: false,
    surgeonAgent: false,
    deployKeeper: false,
    magneticRail: false,
  };

  handles.started = false;

  await broadcastStarbridgeEvent(
    {
      topic: StarbridgeTopic.System,
      source: StarbridgeSource.Runtime,
      type: "mesh.stopped",
    },
    { skipPersistence: false },
  );
}

export function meshStatus() {
  return {
    started: handles.started,
    intervalCount: handles.intervals.length,
    components: { ...handles.components },
    recentEventCount: recentEvents.length,
  };
}

export function meshEvents(limit = 50) {
  const safeLimit = Math.max(1, Math.min(limit, EVENT_BUFFER_LIMIT));
  return recentEvents.slice(-safeLimit).reverse();
}
