import type { FabricTask } from "./types";

export interface ValidationResult {
  passed: boolean;
  issues: string[];
  warnings: string[];
}

export function validateTask(task: FabricTask): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Validate task type
  if (!task.type) {
    issues.push("Task type is required");
  }

  // Validate target
  if (!task.target || (!task.target.filePath && !task.target.modulePath && !task.target.endpointPath && !task.target.agentId)) {
    issues.push("Task target is required");
  }

  // Validate instruction
  if (!task.instruction || task.instruction.trim().length === 0) {
    issues.push("Task instruction is required");
  }

  // Validate generated code (if present)
  if (task.generated?.code) {
    // Basic code validation
    if (task.generated.code.length > 100000) {
      issues.push("Generated code is too large (>100KB)");
    }

    // Check for dangerous patterns (Phase 1: basic checks)
    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /require\s*\(["']fs["']\)/,
      /require\s*\(["']child_process["']\)/,
      /process\.exit/,
      /__dirname/,
      /__filename/,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(task.generated.code)) {
        warnings.push(`Potentially dangerous pattern detected: ${pattern}`);
      }
    }
  }

  // Validate sandbox results (if present)
  if (task.sandbox?.testResults) {
    if (task.sandbox.testResults.failed > 0) {
      warnings.push(`Sandbox tests failed: ${task.sandbox.testResults.failed} failed, ${task.sandbox.testResults.passed} passed`);
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}

export function validateCodeSafety(code: string): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check for dangerous imports
  const dangerousImports = [
    "fs",
    "child_process",
    "os",
    "path",
    "crypto",
    "net",
    "http",
    "https",
    "dns",
    "cluster",
    "worker_threads",
  ];

  for (const imp of dangerousImports) {
    if (code.includes(`require("${imp}")`) || code.includes(`require('${imp}')`) || code.includes(`import ${imp}`)) {
      warnings.push(`Potentially dangerous import detected: ${imp}`);
    }
  }

  // Check for file system operations
  if (code.includes("writeFileSync") || code.includes("readFileSync") || code.includes("unlinkSync")) {
    warnings.push("File system operations detected");
  }

  // Check for network operations
  if (code.includes("fetch") || code.includes("axios") || code.includes("http.get") || code.includes("https.get")) {
    warnings.push("Network operations detected");
  }

  // Check for process operations
  if (code.includes("process.exit") || code.includes("process.kill")) {
    issues.push("Process termination operations detected");
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}

