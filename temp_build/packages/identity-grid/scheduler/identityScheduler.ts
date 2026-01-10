import type { IdentityContext, IdentityStatus } from "../types";
import { IdentityStore } from "../store/identityStore";
import { syncIdentitiesFromContext } from "../logic/identityLinker";

let lastRunAt: number | null = null;

export function runIdentityCycle(ctx: IdentityContext): IdentityStatus {
  syncIdentitiesFromContext(ctx);
  lastRunAt = Date.now();

  const baseStatus = IdentityStore.status();

  const status: IdentityStatus = {
    ...baseStatus,
    lastRunAt,
  };

  // Optional: push into Neural Mesh
  if (ctx.neuralMesh?.remember) {
    ctx.neuralMesh.remember({
      source: "IdentityGrid",
      nodeCount: status.nodeCount,
      edgeCount: status.edgeCount,
      timestamp: lastRunAt,
    });
  }

  return status;
}

export function identityStatus(): IdentityStatus {
  const baseStatus = IdentityStore.status();

  return {
    ...baseStatus,
    lastRunAt,
  };
}

