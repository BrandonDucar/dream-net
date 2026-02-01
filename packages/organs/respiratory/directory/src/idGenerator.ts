/**
 * Directory ID Generator
 * Generates unique IDs for directory entities
 */

const counters: Record<string, number> = {
  citizen: 0,
  dream: 0,
};

function nextSequence(prefix: string): string {
  const count = (counters[prefix] = (counters[prefix] ?? 0) + 1);
  return count.toString().padStart(6, "0");
}

export function generateCitizenId(customLabel?: string): string {
  if (customLabel) return `CIT-${customLabel.toUpperCase()}`;
  return `CIT-${nextSequence("citizen")}`;
}

export function generateDreamId(): string {
  return `DREAM-${nextSequence("dream")}`;
}

// Node/agent/port/conduit can use existing IDs as-is
export function wrapNodeId(clusterId: string): string {
  return `NODE-${clusterId}`;
}

