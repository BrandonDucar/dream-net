import type { Squad, SquadAlchemyDecision } from "../types";

export function proposeMergeStrategy(squads: Squad[]): SquadAlchemyDecision {
  if (squads.length < 2) {
    return {
      action: "noop",
      reason: "Not enough squads to merge",
    };
  }

  // Simple heuristic: merge two smallest squads by member count
  const sorted = [...squads].sort(
    (a, b) => a.members.length - b.members.length
  );

  const [a, b] = sorted;

  const merged: Squad = {
    id: `${a.id}-${b.id}-merged-${Date.now()}`,
    role: a.role === b.role ? a.role : "generic",
    members: [...a.members, ...b.members],
    tags: Array.from(new Set([...(a.tags ?? []), ...(b.tags ?? [])])),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lineage: {
      parentIds: [a.id, b.id],
      generation: Math.max(a.lineage?.generation ?? 1, b.lineage?.generation ?? 1) + 1,
    },
  };

  return {
    action: "merge",
    reason: "Merged lowest-member squads to consolidate capacity",
    targetSquadIds: [a.id, b.id],
    newSquads: [merged],
  };
}

