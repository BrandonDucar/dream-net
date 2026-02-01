/**
 * Immune System Logic
 * Pattern recognition, threat detection, and automatic defense
 */

import type {
  WebhookAntigen,
  WebhookAntibody,
  WebhookMemoryCell,
  WebhookEvent,
} from '../types.js';

let antigens: Map<string, WebhookAntigen> = new Map();
let antibodies: Map<string, WebhookAntibody> = new Map();
let memoryCells: Map<string, WebhookMemoryCell> = new Map();

let antigenCounter = 0;
let antibodyCounter = 0;
let memoryCellCounter = 0;

function nextAntigenId(): string {
  antigenCounter += 1;
  return `antigen:${Date.now()}:${antigenCounter}`;
}

function nextAntibodyId(): string {
  antibodyCounter += 1;
  return `antibody:${Date.now()}:${antibodyCounter}`;
}

function nextMemoryCellId(): string {
  memoryCellCounter += 1;
  return `memory:${Date.now()}:${memoryCellCounter}`;
}

/**
 * Create an antibody (webhook validator/security rule)
 */
export function createAntibody(
  name: string,
  pattern: string,
  action: WebhookAntibody["action"],
  options?: {
    memory?: boolean;
    effectiveness?: number;
  }
): WebhookAntibody {
  const antibody: WebhookAntibody = {
    id: nextAntibodyId(),
    name,
    pattern,
    action,
    effectiveness: options?.effectiveness || 1.0,
    memory: options?.memory ?? true,
    createdAt: Date.now(),
  };

  antibodies.set(antibody.id, antibody);
  return antibody;
}

/**
 * Detect antigens (threats) in webhook event
 */
export function detectAntigens(event: WebhookEvent): WebhookAntigen[] {
  const detected: WebhookAntigen[] = [];
  const payloadStr = JSON.stringify(event.payload);

  // Check against known antibodies
  for (const antibody of antibodies.values()) {
    try {
      const regex = new RegExp(antibody.pattern, "i");
      if (regex.test(payloadStr)) {
        const antigen: WebhookAntigen = {
          id: nextAntigenId(),
          type: determineAntigenType(antibody.pattern),
          pattern: antibody.pattern,
          severity: determineSeverity(antibody.pattern),
          detectedAt: Date.now(),
          neutralized: false,
        };

        antigens.set(antigen.id, antigen);
        detected.push(antigen);

        // Create memory cell if antibody has memory
        if (antibody.memory) {
          createMemoryCell(antigen, antibody);
        }

        // Take action
        executeAntibodyAction(antibody, event, antigen);
      }
    } catch (error) {
      // Invalid regex, skip
    }
  }

  // Check memory cells (faster pattern matching)
  for (const memoryCell of memoryCells.values()) {
    if (memoryCell.strength > 0.5 && payloadStr.includes(memoryCell.pattern)) {
      const antigen: WebhookAntigen = {
        id: nextAntigenId(),
        type: determineAntigenType(memoryCell.pattern),
        pattern: memoryCell.pattern,
        severity: "medium",
        detectedAt: Date.now(),
        neutralized: false,
      };

      antigens.set(antigen.id, antigen);
      detected.push(antigen);
      memoryCell.lastActivated = Date.now();
      memoryCell.strength = Math.min(1.0, memoryCell.strength + 0.1); // Strengthen memory
    }
  }

  return detected;
}

/**
 * Create memory cell (learned pattern)
 */
function createMemoryCell(antigen: WebhookAntigen, antibody: WebhookAntibody): void {
  const memoryCell: WebhookMemoryCell = {
    id: nextMemoryCellId(),
    antigenId: antigen.id,
    pattern: antigen.pattern,
    response: antibody.action,
    strength: 1.0,
    createdAt: Date.now(),
    lastActivated: Date.now(),
  };

  memoryCells.set(memoryCell.id, memoryCell);
}

/**
 * Execute antibody action
 */
function executeAntibodyAction(
  antibody: WebhookAntibody,
  event: WebhookEvent,
  antigen: WebhookAntigen
): void {
  switch (antibody.action) {
    case "block":
      event.status = "blocked";
      event.error = `Blocked by antibody: ${antibody.name}`;
      antigen.neutralized = true;
      antigen.neutralizedAt = Date.now();
      break;

    case "quarantine":
      // Mark for review
      event.status = "blocked";
      event.error = `Quarantined by antibody: ${antibody.name}`;
      break;

    case "transform":
      // Transform payload (would need transform function)
      console.log(`[ImmuneSystem] Transforming payload via ${antibody.name}`);
      break;

    case "alert":
      console.log(`🚨 [ImmuneSystem] Alert: ${antibody.name} detected threat`);
      // Would trigger notification
      break;
  }
}

/**
 * Determine antigen type from pattern
 */
function determineAntigenType(pattern: string): WebhookAntigen["type"] {
  const lower = pattern.toLowerCase();
  
  if (lower.includes("sql") || lower.includes("script") || lower.includes("eval")) {
    return "malicious";
  }
  if (lower.includes("timeout") || lower.includes("slow")) {
    return "timeout";
  }
  if (lower.includes("rate") || lower.includes("limit")) {
    return "rate_limit";
  }
  if (lower.includes("error") || lower.includes("fail")) {
    return "error";
  }
  
  return "malformed";
}

/**
 * Determine severity from pattern
 */
function determineSeverity(pattern: string): WebhookAntigen["severity"] {
  const lower = pattern.toLowerCase();
  
  if (lower.includes("sql") || lower.includes("xss") || lower.includes("inject")) {
    return "critical";
  }
  if (lower.includes("error") || lower.includes("fail")) {
    return "high";
  }
  if (lower.includes("timeout") || lower.includes("slow")) {
    return "medium";
  }
  
  return "low";
}

/**
 * Neutralize antigen (mark as handled)
 */
export function neutralizeAntigen(antigenId: string): boolean {
  const antigen = antigens.get(antigenId);
  if (antigen) {
    antigen.neutralized = true;
    antigen.neutralizedAt = Date.now();
    return true;
  }
  return false;
}

/**
 * Get all antigens
 */
export function getAntigens(): WebhookAntigen[] {
  return Array.from(antigens.values());
}

/**
 * Get all antibodies
 */
export function getAntibodies(): WebhookAntibody[] {
  return Array.from(antibodies.values());
}

/**
 * Get all memory cells
 */
export function getMemoryCells(): WebhookMemoryCell[] {
  return Array.from(memoryCells.values());
}

/**
 * Decay memory cells (forget old patterns)
 */
export function decayMemoryCells() {
  const now = Date.now();
  for (const memoryCell of memoryCells.values()) {
    const age = now - memoryCell.lastActivated;
    const decayRate = 0.00001; // Decay per ms
    memoryCell.strength = Math.max(0, memoryCell.strength - age * decayRate);
    
    // Remove very weak memories
    if (memoryCell.strength < 0.1) {
      memoryCells.delete(memoryCell.id);
    }
  }
}

