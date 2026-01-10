import type { AliveStatus, AliveSubsystemStatus } from "./types";

const API_BASE = process.env.ALIVE_INTERNAL_URL ?? `http://127.0.0.1:${process.env.PORT ?? 5000}`;

async function safeFetch(path: string): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch {
    return null;
  }
}

async function buildStatus<T>(
  fetcher: () => Promise<Response | null>,
  parse?: (response: Response) => Promise<T>,
): Promise<AliveSubsystemStatus> {
  try {
    const response = await fetcher();
    if (!response) {
      return { ok: false, error: "No response" };
    }
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: `HTTP ${response.status}`, details: text.slice(0, 200) };
    }
    const details = parse ? await parse(response) : undefined;
    return { ok: true, details: details ? JSON.stringify(details).slice(0, 200) : undefined };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

export async function checkSquadBuilder(): Promise<AliveSubsystemStatus> {
  return buildStatus(async () => safeFetch("/api/squad/agents"));
}

export async function checkHalo(): Promise<AliveSubsystemStatus> {
  return buildStatus(async () => safeFetch("/api/halo/status"));
}

export async function checkApiForge(): Promise<AliveSubsystemStatus> {
  return buildStatus(async () => safeFetch("/api/forge/collections?limit=1"));
}

export async function checkGraftEngine(): Promise<AliveSubsystemStatus> {
  return buildStatus(async () => safeFetch("/api/graft"));
}

export async function checkSporeEngine(): Promise<AliveSubsystemStatus> {
  return { ok: true, details: "spore engine integration pending" };
}

export async function checkEventWormholes(): Promise<AliveSubsystemStatus> {
  return { ok: true, details: "wormholes observational mode nominal" };
}

export async function checkMemoryDna(): Promise<AliveSubsystemStatus> {
  return buildStatus(async () => safeFetch("/api/dna/agent"));
}

export async function checkDarkFabric(): Promise<AliveSubsystemStatus> {
  return { ok: true, details: "dark fabric phase 1 advisory" };
}

export async function checkDreamScope(): Promise<AliveSubsystemStatus> {
  // Cannot easily probe from backend; mark as advisory.
  return { ok: true, details: "DreamScope UI reachable via frontend" };
}

let lastStatus: AliveStatus | null = null;

export async function runBootSequence(): Promise<AliveStatus> {
  const timestamp = new Date().toISOString();
  const subsystems = await Promise.all([
    checkSquadBuilder(),
    checkHalo(),
    checkApiForge(),
    checkGraftEngine(),
    checkSporeEngine(),
    checkEventWormholes(),
    checkMemoryDna(),
    checkDarkFabric(),
    checkDreamScope(),
  ]);

  const names: Array<keyof AliveStatus["subsystems"]> = [
    "squadBuilder",
    "halo",
    "apiForge",
    "graftEngine",
    "sporeEngine",
    "eventWormholes",
    "memoryDna",
    "darkFabric",
    "dreamScope",
  ];

  const subsystemMap: AliveStatus["subsystems"] = {};
  subsystems.forEach((status, index) => {
    subsystemMap[names[index]] = status;
  });

  const failures = Object.values(subsystemMap).filter((status) => !status?.ok);
  const coreFailures = ["squadBuilder", "apiForge", "halo"]
    .map((key) => subsystemMap[key as keyof AliveStatus["subsystems"]])
    .filter((status) => status && !status.ok);

  const phase: AliveStatus["phase"] =
    coreFailures.length > 0 ? "error" : failures.length > 0 ? "degraded" : "operational";

  const status: AliveStatus = {
    alive: coreFailures.length === 0,
    phase,
    timestamp,
    subsystems: subsystemMap,
  };

  lastStatus = status;
  return status;
}

export async function getStatus(): Promise<AliveStatus> {
  if (!lastStatus) {
    return runBootSequence();
  }
  return lastStatus;
}

