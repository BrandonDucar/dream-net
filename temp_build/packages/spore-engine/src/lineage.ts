import type { SporeModel, SporeLineage } from "./types";
import { listSpores, getSporeById, createSpore, updateSpore } from "./registry";

export function getSporeLineage(sporeId: string): SporeLineage | null {
  const spore = getSporeById(sporeId);
  if (!spore) return null;

  const allSpores = listSpores();
  const parentId = spore.metadata?.parentId;
  const branchId = spore.metadata?.branchId;

  const children = allSpores.filter((s) => s.metadata?.parentId === sporeId).map((s) => s.id);
  const siblings = allSpores.filter((s) => s.metadata?.parentId === parentId && s.id !== sporeId).map((s) => s.id);

  // Build ancestors (parent, grandparent, etc.)
  const ancestors: string[] = [];
  let current = parentId ? getSporeById(parentId) : null;
  while (current) {
    ancestors.push(current.id);
    current = current.metadata?.parentId ? getSporeById(current.metadata.parentId) : null;
  }

  // Build descendants (children, grandchildren, etc.)
  const descendants: string[] = [];
  function collectDescendants(id: string): void {
    const children = allSpores.filter((s) => s.metadata?.parentId === id);
    for (const child of children) {
      descendants.push(child.id);
      collectDescendants(child.id);
    }
  }
  collectDescendants(sporeId);

  return {
    sporeId,
    parentId,
    branchId,
    children,
    siblings,
    ancestors,
    descendants,
  };
}

export function forkSpore(sporeId: string, newName: string, branchId?: string): SporeModel | null {
  const parent = getSporeById(sporeId);
  if (!parent) return null;

  const lineage = parent.metadata?.lineage ?? [];
  const newSpore = createSpore({
    name: newName,
    description: parent.description,
    type: parent.type,
    status: "draft",
    content: parent.content,
    metadata: {
      ...parent.metadata,
      parentId: sporeId,
      branchId: branchId ?? `branch-${Date.now()}`,
      lineage: [...lineage, sporeId],
      version: "1.0.0",
    },
    distribution: parent.distribution,
  });

  return newSpore;
}

export function mergeSpore(sourceId: string, targetId: string): SporeModel | null {
  const source = getSporeById(sourceId);
  const target = getSporeById(targetId);
  if (!source || !target) return null;

  // Merge content (simple string merge for now)
  const mergedContent = typeof source.content === "string" && typeof target.content === "string"
    ? `${target.content}\n\n--- Merged from ${source.name} ---\n\n${source.content}`
    : { ...(typeof target.content === "object" ? target.content : {}), ...(typeof source.content === "object" ? source.content : {}) };

  const updated = updateSpore(targetId, {
    content: mergedContent,
    metadata: {
      ...target.metadata,
      lineage: [...(target.metadata?.lineage ?? []), sourceId],
    },
  });

  return updated;
}

