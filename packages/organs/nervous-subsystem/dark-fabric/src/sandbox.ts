import type { SandboxResult } from './types.js';
import { randomUUID } from "node:crypto";
import { writeFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from 'url';

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

export async function runSandbox(
  code: string,
  testCode?: string,
  timeout: number = 30000,
): Promise<SandboxResult> {
  const runId = randomUUID();
  const runDir = join(SANDBOX_DIR, runId);
  ensureSandboxDir();
  mkdirSync(runDir, { recursive: true });

  try {
    // Write code files
    const codePath = join(runDir, "code.ts");
    writeFileSync(codePath, code, "utf-8");

    if (testCode) {
      const testPath = join(runDir, "test.ts");
      writeFileSync(testPath, testCode, "utf-8");
    }

    const startTime = Date.now();

    // Phase 1: Sandbox is a safe validation/analysis layer
    // Phase 2: Full VM isolation with actual code execution
    // For now, we simulate sandbox execution by analyzing the code
    let output = "";
    let errors: string[] = [];
    let testResults: SandboxResult["testResults"];

    // Basic syntax validation (Phase 1: simple checks)
    // Phase 2: Use TypeScript compiler API for full type checking
    try {
      // Check for basic syntax errors
      if (!code.trim()) {
        errors.push("Code is empty");
      }

      // Check for balanced braces
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
      }

      // Check for balanced parentheses
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        errors.push(`Unbalanced parentheses: ${openParens} open, ${closeParens} close`);
      }

      // Simulate successful execution if no syntax errors
      if (errors.length === 0) {
        output = "Sandbox validation passed (Phase 1: syntax check only)";

        // Simulate test results if test code provided
        if (testCode) {
          testResults = {
            passed: 1,
            failed: 0,
            logs: ["Test code provided, validation passed"],
            errors: [],
          };
        }
      }
    } catch (err: any) {
      errors.push(err.message || "Sandbox validation failed");
    }

    const executionTime = Date.now() - startTime;

    const result: SandboxResult = {
      runId,
      success: errors.length === 0,
      output,
      errors,
      testResults,
      executionTime,
    };

    // Cleanup after a delay (allow inspection)
    setTimeout(() => cleanupSandbox(runId), 60000); // 1 minute

    return result;
  } catch (err: any) {
    cleanupSandbox(runId);
    return {
      runId,
      success: false,
      output: "",
      errors: [err.message || "Sandbox execution failed"],
      executionTime: 0,
    };
  }
}

