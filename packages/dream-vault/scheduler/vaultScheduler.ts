import type { VaultContext, VaultStatus, VaultItem } from '../types.js';
import { VaultStore } from '../store/vaultStore.js';
import { rebuildVaultIndex } from '../logic/vaultIndexer.js';

let lastRunAt: number | null = null;

export function runVaultCycle(ctx: VaultContext): VaultStatus {
  // Rebuild index from current items
  rebuildVaultIndex();
  lastRunAt = Date.now();

  const status = VaultStore.status(lastRunAt);

  // Optional: write a narrative entry when vault changes
  if (ctx.narrativeField?.add && status.itemCount > 0) {
    ctx.narrativeField.add({
      id: `narrative-vault-${lastRunAt}`,
      timestamp: lastRunAt,
      title: "Dream Vault synchronized",
      summary: `Dream Vault currently tracks ${status.itemCount} items (${status.indexCount} indexed).`,
      severity: "info",
      domain: "dream",
      tags: ["vault", "library", "blueprints"],
      references: [],
    });
  }

  // Optional: store summary in NeuralMesh
  if (ctx.neuralMesh?.remember) {
    ctx.neuralMesh.remember({
      source: "DreamVault",
      status,
      timestamp: lastRunAt,
    });
  }

  return status;
}

export function vaultStatus(): VaultStatus {
  return VaultStore.status(lastRunAt);
}

