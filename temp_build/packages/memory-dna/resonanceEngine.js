"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeResonanceSnapshot = computeResonanceSnapshot;
exports.saveResonanceInsights = saveResonanceInsights;
exports.getRecentInsights = getRecentInsights;
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const dnaEngine_1 = require("./dnaEngine");
const __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
const __dirname = node_path_1.default.dirname(__filename);
const insightsStore = node_path_1.default.resolve(__dirname, "store/resonanceInsights.json");
async function readInsights() {
    try {
        const data = await node_fs_1.promises.readFile(insightsStore, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await node_fs_1.promises.mkdir(node_path_1.default.dirname(insightsStore), { recursive: true });
            await node_fs_1.promises.writeFile(insightsStore, "[]", "utf8");
            return [];
        }
        throw error;
    }
}
async function writeInsights(entries) {
    await node_fs_1.promises.writeFile(insightsStore, JSON.stringify(entries, null, 2), "utf8");
}
function findTrait(record, key, fallback = 0.5) {
    return record.traits.find((trait) => trait.key === key)?.value ?? fallback;
}
function createInsight(pattern, description, options = {}) {
    return {
        id: (0, node_crypto_1.randomUUID)(),
        createdAt: new Date().toISOString(),
        pattern,
        description,
        suggestedActions: options.suggestedActions ?? [],
        entityType: options.entityType,
        entityIds: options.entityIds,
        severity: options.severity ?? "medium",
    };
}
async function computeResonanceSnapshot() {
    const collections = await (0, dnaEngine_1.listAllRecords)();
    const insights = [];
    const endpointRecords = collections.endpoint;
    const failingEndpoints = endpointRecords.filter((record) => findTrait(record, "reliability", 0.5) < 0.4);
    if (failingEndpoints.length >= 2) {
        insights.push(createInsight("endpoints.cluster-failing", "Multiple endpoints show sustained failures.", {
            entityType: "endpoint",
            entityIds: failingEndpoints.map((record) => record.entityId),
            severity: "high",
            suggestedActions: [
                "Prioritize HALO reruns focusing on failing endpoints.",
                "Schedule DeployKeeper checks for affected endpoints.",
            ],
        }));
    }
    const agentRecords = collections.agent;
    const strugglingAgents = agentRecords.filter((record) => findTrait(record, "reliability", 0.5) < 0.45);
    if (strugglingAgents.length) {
        insights.push(createInsight("agents.needing-support", "Some agents demonstrate low reliability scores.", {
            entityType: "agent",
            entityIds: strugglingAgents.map((record) => record.entityId),
            severity: "medium",
            suggestedActions: ["Review task assignments for these agents.", "Consider pairing with high-performing squads."],
        }));
    }
    const squadRecords = collections.squad;
    const eliteSquads = squadRecords.filter((record) => findTrait(record, "reliability", 0.5) > 0.75);
    if (eliteSquads.length) {
        insights.push(createInsight("squads.high-performing", "High-performing squads identified.", {
            entityType: "squad",
            entityIds: eliteSquads.map((record) => record.entityId),
            severity: "low",
            suggestedActions: ["Use these squads as templates for new missions.", "Capture playbook traits for inheritance."],
        }));
    }
    const sporeRecords = collections.spore;
    const popularSpores = sporeRecords.filter((record) => findTrait(record, "popularity", 0.5) > 0.7);
    if (popularSpores.length) {
        insights.push(createInsight("spores.high-demand", "Spores with high adoption detected.", {
            entityType: "spore",
            entityIds: popularSpores.map((record) => record.entityId),
            severity: "medium",
            suggestedActions: ["Promote these spores in DreamScope.", "Consider graft templates based on them."],
        }));
    }
    return insights;
}
async function saveResonanceInsights(insights) {
    const trimmed = insights.slice(0, 100);
    await writeInsights(trimmed);
}
async function getRecentInsights(limit = 20) {
    const insights = await readInsights();
    return insights.slice(0, limit);
}
