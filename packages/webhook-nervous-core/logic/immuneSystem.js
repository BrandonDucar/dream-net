/**
 * Immune System Logic
 * Pattern recognition, threat detection, and automatic defense
 */
let antigens = new Map();
let antibodies = new Map();
let memoryCells = new Map();
let antigenCounter = 0;
let antibodyCounter = 0;
let memoryCellCounter = 0;
function nextAntigenId() {
    antigenCounter += 1;
    return `antigen:${Date.now()}:${antigenCounter}`;
}
function nextAntibodyId() {
    antibodyCounter += 1;
    return `antibody:${Date.now()}:${antibodyCounter}`;
}
function nextMemoryCellId() {
    memoryCellCounter += 1;
    return `memory:${Date.now()}:${memoryCellCounter}`;
}
/**
 * Create an antibody (webhook validator/security rule)
 */
export function createAntibody(name, pattern, action, options) {
    const antibody = {
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
export function detectAntigens(event) {
    const detected = [];
    const payloadStr = JSON.stringify(event.payload);
    // Check against known antibodies
    for (const antibody of antibodies.values()) {
        try {
            const regex = new RegExp(antibody.pattern, "i");
            if (regex.test(payloadStr)) {
                const antigen = {
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
        }
        catch (error) {
            // Invalid regex, skip
        }
    }
    // Check memory cells (faster pattern matching)
    for (const memoryCell of memoryCells.values()) {
        if (memoryCell.strength > 0.5 && payloadStr.includes(memoryCell.pattern)) {
            const antigen = {
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
function createMemoryCell(antigen, antibody) {
    const memoryCell = {
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
function executeAntibodyAction(antibody, event, antigen) {
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
function determineAntigenType(pattern) {
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
function determineSeverity(pattern) {
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
export function neutralizeAntigen(antigenId) {
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
export function getAntigens() {
    return Array.from(antigens.values());
}
/**
 * Get all antibodies
 */
export function getAntibodies() {
    return Array.from(antibodies.values());
}
/**
 * Get all memory cells
 */
export function getMemoryCells() {
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
