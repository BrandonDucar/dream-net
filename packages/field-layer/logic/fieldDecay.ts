import { FieldStore } from "../store/fieldStore";

export function applyFieldDecay(now: number) {
  const config = FieldStore.getConfig();
  const halfLife = config.decayHalfLifeMs;
  if (!halfLife || halfLife <= 0) return;

  const all = FieldStore.getAllSamples();

  for (const sample of all) {
    const ageMs = now - sample.updatedAt;
    if (ageMs <= 0) continue;

    const decayFactor = Math.pow(0.5, ageMs / halfLife);
    const decayedValue = sample.value * decayFactor;

    // We treat values below small epsilon as effectively zero, but keep them in the map for now
    sample.value = decayedValue;
  }
}

