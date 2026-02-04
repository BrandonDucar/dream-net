import type { SandboxResult } from './types.js';
import { randomUUID } from "node:crypto";
import { writeFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from 'url';
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SANDBOX_DIR = join(__dirname, "../sandbox");

function ensureSandboxDir(): void {
  if (!existsSync(SANDBOX_DIR)) {
    mkdirSync(SANDBOX_DIR, { recursive: true });
  }
}

function cleanupSandbox(runId: string): void {
  const runDir = join(SANDBOX_DIR, runId);
  if (existsSync(runDir)) {
    try {
      rmSync(runDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Executes code in a "fissioned" process for safety.
 * Phase 2 Level: tsx execution with timeout and output capture.
 */
export async function runSandbox(
  code: string,
  testCode?: string,
  timeout: number = 30000,
): Promise<SandboxResult> {
  const runId = randomUUID();
  const runDir = join(SANDBOX_DIR, runId);
  ensureSandboxDir();
  mkdirSync(runDir, { recursive: true });

  const codePath = join(runDir, "code.ts");
  writeFileSync(codePath, code, "utf-8");

  if (testCode) {
    const testPath = join(runDir, "test.ts");
    writeFileSync(testPath, testCode, "utf-8");
  }

  const startTime = Date.now();
  let stdout = "";
  let stderr = "";
  let success = false;
  let errorMessages: string[] = [];

  return new Promise((resolve) => {
    // Phase 2: Trial by Execution
    // We run the code using npx tsx. 
    // In a real production environment, we'd use isolated-vm or a Docker runner.
    const child = spawn("npx", ["tsx", codePath], {
      timeout,
      env: { ...process.env, DARK_FABRIC_SANDBOX: "true" },
      shell: true // Required for npx on Windows
    });

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      const executionTime = Date.now() - startTime;
      success = code === 0;

      if (!success) {
        errorMessages.push(`Process exited with code ${code}`);
        if (stderr) errorMessages.push(stderr);
      }

      const result: SandboxResult = {
        runId,
        success,
        output: stdout,
        errors: errorMessages,
        testResults: {
          passed: success ? 1 : 0,
          failed: success ? 0 : 1,
          logs: stdout.split("\n").filter(Boolean),
          errors: stderr.split("\n").filter(Boolean)
        },
        executionTime,
      };

      // Cleanup after a delay
      setTimeout(() => cleanupSandbox(runId), 60000);
      resolve(result);
    });

    child.on("error", (err) => {
      resolve({
        runId,
        success: false,
        output: stdout,
        errors: [err.message, stderr],
        executionTime: Date.now() - startTime,
      });
      cleanupSandbox(runId);
    });
  });
}

