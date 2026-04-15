import { DreamStateContext, DreamStateStatus } from "../types";
import { CitizenshipStore } from "../store/citizenshipStore";
import { ensureGovernmentDepartments } from "../logic/government";
import { ensureStateSymbols } from "../logic/government";
import { ensureDefaultDiplomaticRelations } from "../logic/diplomacy";
import { recordGovernmentAction } from "../logic/government";

/**
 * Run one Dream State cycle:
 * - Ensure government structure exists
 * - Ensure state symbols exist
 * - Ensure default diplomatic relations
 * - Record state heartbeat
 */
export function runDreamStateCycle(ctx: DreamStateContext): DreamStateStatus {
  const now = Date.now();

  console.log("[DreamState:Scheduler] Running Dream State cycle...");

  // 1. Ensure government departments exist
  const departments = ensureGovernmentDepartments();
  if (departments.length > 0) {
    console.log(`[DreamState:Scheduler] Government departments initialized: ${departments.length}`);
  }

  // 2. Ensure state symbols exist
  const symbols = ensureStateSymbols();
  if (symbols.length > 0) {
    console.log(`[DreamState:Scheduler] State symbols adopted: ${symbols.length}`);
  }

  // 3. Ensure default diplomatic relations
  const relations = ensureDefaultDiplomaticRelations(ctx);
  if (relations.length > 0) {
    console.log(`[DreamState:Scheduler] Diplomatic relations established: ${relations.length}`);
  }

  // 4. Record heartbeat action
  recordGovernmentAction(
    "administrative",
    "dept:executive",
    "Dream State heartbeat cycle completed",
    { timestamp: now, passportCount: CitizenshipStore.status().passportCount }
  );

  CitizenshipStore.setLastRunAt(now);
  console.log("[DreamState:Scheduler] Dream State cycle complete.");

  return CitizenshipStore.status();
}

