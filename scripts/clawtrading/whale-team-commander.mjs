/**
 * WHALE TEAM COMMANDER
 *
 * Spawns and supervises the full Whale Intelligence operation:
 *
 *   BELFORT        — Momentum + social spike trader (Wolf of Wall Street archetype)
 *   WHALE_SCRUBBER — Tracks & logs the biggest traders across every market
 *   GENIE          — Interprets sim outputs as wishes, grants them autonomously
 *   STITCH         — Playground experimenter, amplifies signals, goes buck wild
 *
 * Simulation engines (run inside GENIE, called on-demand):
 *   MIROFISH       — Behavioral pattern fingerprinting & sequence prediction
 *   TARTARIAN      — Civilizational long-wave analysis & hidden pattern detection
 *
 * Usage:
 *   node whale-team-commander.mjs
 *   node whale-team-commander.mjs --agent BELFORT
 *   node whale-team-commander.mjs --agent STITCH
 */
import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const AGENTS = [
  {
    name: "WHALE_SCRUBBER",
    file: "agents/whale-scrubber.mjs",
    color: "\x1b[34m",  // Blue
    role: "Leviathan Intelligence — tracks all big traders on-chain + off-chain",
    motto: "Clean the ocean. Log every whale. Know before they know.",
    startDelayMs: 0,
  },
  {
    name: "BELFORT",
    file: "agents/belfort-agent.mjs",
    color: "\x1b[35m",  // Magenta
    role: "Momentum Evangelist — social heat + price action, sizes in fast",
    motto: "Act as if. The market owes you money. It does.",
    startDelayMs: 5_000,
  },
  {
    name: "GENIE",
    file: "agents/genie-agent.mjs",
    color: "\x1b[33m",  // Yellow
    role: "Wish Granter — runs Mirofish + Tartarian, converts outputs to orders",
    motto: "You have three wishes. I found three hundred.",
    startDelayMs: 15_000, // needs whale DB seeded first
  },
  {
    name: "STITCH",
    file: "agents/stitch-agent.mjs",
    color: "\x1b[32m",  // Green
    role: "Experiment Monster — Playground experimenter, amplifies team signals",
    motto: "Small. Broken. Lost. Still good. Still experimenting.",
    startDelayMs: 25_000, // needs signals to experiment on
  },
];

const RESET = "\x1b[0m";
const BOLD  = "\x1b[1m";
const CYAN  = "\x1b[36m";
const RED   = "\x1b[31m";

function banner() {
  console.log(`
${CYAN}${BOLD}
╔══════════════════════════════════════════════════════════════════════╗
║          🐋  WHALE INTELLIGENCE TEAM — DREAMNET OPERATIONS          ║
╠══════════════════════════════════════════════════════════════════════╣
║  WHALE_SCRUBBER  │  Leviathan Intel       │ Ocean floor scans       ║
║  BELFORT         │  Wolf of Wall Street   │ Momentum evangelist     ║
║  GENIE           │  Wish Granting AI      │ Mirofish + Tartarian    ║
║  STITCH          │  Experiment Monster    │ Buck wild at 10 wins    ║
╠══════════════════════════════════════════════════════════════════════╣
║  Sims: MIROFISH (pattern) + TARTARIAN (civilizational long-wave)    ║
║  Data: On-chain Polygon | Social spikes | Financial spikes          ║
║  DB:   Neon PostgreSQL (whale_traders, whale_trades, whale_signals) ║
╚══════════════════════════════════════════════════════════════════════╝
${RESET}`);
}

const processes = new Map();

function spawnAgent(agent) {
  const agentPath = resolve(__dirname, agent.file);
  const color = agent.color;

  console.log(`${color}${BOLD}[CMD]${RESET} Spawning ${color}${agent.name}${RESET} — ${agent.role}`);
  console.log(`${color}      "${agent.motto}"${RESET}\n`);

  const proc = spawn("node", [agentPath], {
    env: { ...process.env },
    stdio: ["ignore", "pipe", "pipe"],
  });

  proc.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    for (const line of lines) {
      console.log(`${color}[${agent.name}]${RESET} ${line}`);
    }
  });

  proc.stderr.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    for (const line of lines) {
      console.error(`${RED}[${agent.name}:ERR]${RESET} ${line}`);
    }
  });

  proc.on("exit", (code, signal) => {
    console.log(`${RED}${BOLD}[CMD] ${agent.name} exited (code=${code} signal=${signal})${RESET}`);
    processes.delete(agent.name);

    if (signal !== "SIGTERM" && signal !== "SIGINT" && code !== 0) {
      const delay = 10_000;
      console.log(`${color}[CMD] Restarting ${agent.name} in ${delay / 1000}s…${RESET}`);
      setTimeout(() => spawnAgent(agent), delay);
    }
  });

  processes.set(agent.name, proc);
  return proc;
}

async function main() {
  banner();

  // Check if a specific agent was requested
  const agentArg = process.argv.find(a => a.startsWith("--agent="))?.replace("--agent=", "")
    || (process.argv.includes("--agent") ? process.argv[process.argv.indexOf("--agent") + 1] : null);

  const toRun = agentArg
    ? AGENTS.filter(a => a.name.toUpperCase() === agentArg.toUpperCase())
    : AGENTS;

  if (toRun.length === 0) {
    console.error(`${RED}Unknown agent: ${agentArg}${RESET}`);
    console.log(`Available: ${AGENTS.map(a => a.name).join(", ")}`);
    process.exit(1);
  }

  // Staggered start
  for (const agent of toRun) {
    if (agent.startDelayMs > 0) {
      console.log(`${CYAN}[CMD] ${agent.name} starting in ${agent.startDelayMs / 1000}s…${RESET}`);
      setTimeout(() => spawnAgent(agent), agent.startDelayMs);
    } else {
      spawnAgent(agent);
    }
  }

  // Graceful shutdown
  const shutdown = (sig) => {
    console.log(`\n${BOLD}[CMD] ${sig} received — shutting down whale team${RESET}`);
    for (const [name, proc] of processes) {
      console.log(`[CMD] Stopping ${name}…`);
      proc.kill("SIGTERM");
    }
    setTimeout(() => process.exit(0), 3000);
  };

  process.on("SIGINT",  () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  // Status heartbeat
  setInterval(() => {
    const alive = [...processes.keys()].join(", ");
    console.log(`${CYAN}[CMD] 💓 Alive: ${alive || "none"}${RESET}`);
  }, 5 * 60 * 1000);
}

main().catch(err => {
  console.error("[WHALE COMMANDER FATAL]", err);
  process.exit(1);
});
