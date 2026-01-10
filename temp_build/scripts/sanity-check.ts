/**
 * DreamNet Railway Sanity Script
 *
 * Run with:
 *   tsx scripts/sanity-check.ts
 *
 * Validates:
 *  - env vars
 *  - build
 *  - startup
 *  - health endpoint
 *  - readiness endpoint
 *  - DB connection (optional)
 *  - OpenAI API connectivity (optional)
 */

import { execSync, spawn } from "child_process";

// Node 18+ has built-in fetch, no import needed

// Utility
const log = (msg: string) => console.log(`[sanity] ${msg}`);

// ENV VALIDATION -------------------------------------------------------------
log("Checking environment variables...");

const required = ["NODE_ENV"];
const optional = ["DATABASE_URL", "OPENAI_API_KEY"];

for (const key of required) {
  if (!process.env[key]) {
    log(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
  log(`✔️  ${key} = OK`);
}

for (const key of optional) {
  log(process.env[key] ? `✔️  ${key} = present` : `⚠️  ${key} not set (optional)`);
}

// BUILD CHECK ----------------------------------------------------------------
log("Building DreamNet server (Railway-style build)...");

try {
  execSync("pnpm install --frozen-lockfile", { stdio: "inherit" });
  execSync("pnpm --filter @dreamnet/server build", { stdio: "inherit" });
  log("✔️ Build succeeded");
} catch (err) {
  log("❌ Build failed");
  process.exit(1);
}

// START SERVER ---------------------------------------------------------------
log("Starting DreamNet server on PORT=3000...");

const child = spawn("node", ["server/dist/index.js"], {
  env: { ...process.env, PORT: "3000" },
  stdio: ["ignore", "pipe", "pipe"]
});

let healthPassed = false;

child.stdout.on("data", d => log(`stdout: ${d.toString()}`));
child.stderr.on("data", d => log(`stderr: ${d.toString()}`));

// Wait for /health
const waitForHealth = async () => {
  log("Polling http://localhost:3000/health ...");
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://localhost:3000/health");
      if (res.ok) {
        log("✔️  /health OK");
        healthPassed = true;
        break;
      }
    } catch {}
    await new Promise(r => setTimeout(r, 1000));
  }
};

const waitForReady = async () => {
  log("Checking http://localhost:3000/ready ...");
  try {
    const res = await fetch("http://localhost:3000/ready");
    const json = await res.json();
    if (json.ready === true) {
      log("✔️  /ready reports fully initialized subsystems");
    } else {
      log("⚠️  /ready = false (optional subsystems disabled or still init)");
    }
  } catch {
    log("⚠️  /ready endpoint unavailable");
  }
};

// Run sanity tests
(async () => {
  await waitForHealth();
  if (!healthPassed) {
    log("❌ /health never became healthy");
    child.kill();
    process.exit(1);
  }

  // Ready endpoint
  await waitForReady();

  // Optional: DB connectivity test
  if (process.env.DATABASE_URL) {
    log("Testing DB connectivity...");
    try {
      execSync("pnpm dlx prisma db pull", { stdio: "ignore" });
      log("✔️  Database reachable");
    } catch {
      log("⚠️  DB not reachable or schema tool missing");
    }
  }

  // Optional: OpenAI connectivity
  if (process.env.OPENAI_API_KEY) {
    log("Testing OpenAI connectivity...");
    try {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });
      if (res.ok) {
        log("✔️  OpenAI API reachable");
      } else {
        log("⚠️  OpenAI returned non-200");
      }
    } catch {
      log("⚠️  Could not reach OpenAI API");
    }
  }

  log("🎉 DreamNet sanity check complete.");
  child.kill();
  process.exit(0);
})();

