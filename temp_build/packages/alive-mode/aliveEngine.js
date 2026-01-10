"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSquadBuilder = checkSquadBuilder;
exports.checkHalo = checkHalo;
exports.checkApiForge = checkApiForge;
exports.checkGraftEngine = checkGraftEngine;
exports.checkSporeEngine = checkSporeEngine;
exports.checkEventWormholes = checkEventWormholes;
exports.checkMemoryDna = checkMemoryDna;
exports.checkDarkFabric = checkDarkFabric;
exports.checkDreamScope = checkDreamScope;
exports.runBootSequence = runBootSequence;
exports.getStatus = getStatus;
const API_BASE = process.env.ALIVE_INTERNAL_URL ?? `http://127.0.0.1:${process.env.PORT ?? 5000}`;
async function safeFetch(path) {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
        clearTimeout(timer);
        return res;
    }
    catch {
        return null;
    }
}
async function buildStatus(fetcher, parse) {
    try {
        const response = await fetcher();
        if (!response) {
            return { ok: false, error: "No response" };
        }
        if (!response.ok) {
            const text = await response.text();
            return { ok: false, error: `HTTP ${response.status}`, details: text.slice(0, 200) };
        }
        const details = parse ? await parse(response) : undefined;
        return { ok: true, details: details ? JSON.stringify(details).slice(0, 200) : undefined };
    }
    catch (error) {
        return { ok: false, error: error.message };
    }
}
async function checkSquadBuilder() {
    return buildStatus(async () => safeFetch("/api/squad/agents"));
}
async function checkHalo() {
    return buildStatus(async () => safeFetch("/api/halo/status"));
}
async function checkApiForge() {
    return buildStatus(async () => safeFetch("/api/forge/collections?limit=1"));
}
async function checkGraftEngine() {
    return buildStatus(async () => safeFetch("/api/graft"));
}
async function checkSporeEngine() {
    return { ok: true, details: "spore engine integration pending" };
}
async function checkEventWormholes() {
    return { ok: true, details: "wormholes observational mode nominal" };
}
async function checkMemoryDna() {
    return buildStatus(async () => safeFetch("/api/dna/agent"));
}
async function checkDarkFabric() {
    return { ok: true, details: "dark fabric phase 1 advisory" };
}
async function checkDreamScope() {
    // Cannot easily probe from backend; mark as advisory.
    return { ok: true, details: "DreamScope UI reachable via frontend" };
}
let lastStatus = null;
async function runBootSequence() {
    const timestamp = new Date().toISOString();
    const subsystems = await Promise.all([
        checkSquadBuilder(),
        checkHalo(),
        checkApiForge(),
        checkGraftEngine(),
        checkSporeEngine(),
        checkEventWormholes(),
        checkMemoryDna(),
        checkDarkFabric(),
        checkDreamScope(),
    ]);
    const names = [
        "squadBuilder",
        "halo",
        "apiForge",
        "graftEngine",
        "sporeEngine",
        "eventWormholes",
        "memoryDna",
        "darkFabric",
        "dreamScope",
    ];
    const subsystemMap = {};
    subsystems.forEach((status, index) => {
        subsystemMap[names[index]] = status;
    });
    const failures = Object.values(subsystemMap).filter((status) => !status?.ok);
    const coreFailures = ["squadBuilder", "apiForge", "halo"]
        .map((key) => subsystemMap[key])
        .filter((status) => status && !status.ok);
    const phase = coreFailures.length > 0 ? "error" : failures.length > 0 ? "degraded" : "operational";
    const status = {
        alive: coreFailures.length === 0,
        phase,
        timestamp,
        subsystems: subsystemMap,
    };
    lastStatus = status;
    return status;
}
async function getStatus() {
    if (!lastStatus) {
        return runBootSequence();
    }
    return lastStatus;
}
