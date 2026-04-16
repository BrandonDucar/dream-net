export type GovernorMode = "closed" | "canary" | "open";

export const governor = {
  mode: (import.meta.env.VITE_GOVERNOR_MODE as GovernorMode) ?? "canary",
  maxQPS: Number(import.meta.env.VITE_GOVERNOR_MAX_QPS ?? 2),
  maxConcurrency: Number(import.meta.env.VITE_GOVERNOR_MAX_CONCURRENCY ?? 5),
  queueLimit: Number(import.meta.env.VITE_GOVERNOR_QUEUE_LIMIT ?? 20),
  simulation: String(import.meta.env.VITE_SIMULATION_MODE ?? "true") === "true",
  featureAgents: String(import.meta.env.VITE_FEATURE_AGENTS ?? "false") === "true",
  featurePayments: String(import.meta.env.VITE_FEATURE_PAYMENTS ?? "false") === "true"
};
