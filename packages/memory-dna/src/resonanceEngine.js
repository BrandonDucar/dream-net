import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listAllRecords } from './dnaEngine.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const insightsStore = path.resolve(__dirname, "store/resonanceInsights.json");
async function readInsights() {
    try {
        const data = await fs.readFile(insightsStore, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await fs.mkdir(path.dirname(insightsStore), { recursive: true });
            await fs.writeFile(insightsStore, "[]", "utf8");
            return [];
        }
        throw error;
    }
}
async function writeInsights(entries) {
    await fs.writeFile(insightsStore, JSON.stringify(entries, null, 2), "utf8");
}
function findTrait(record, key, fallback = 0.5) {
    return record.traits.find((trait) => trait.key === key)?.value ?? fallback;
}
function createInsight(pattern, description, options = {}) {
    return {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        pattern,
        description,
        suggestedActions: options.suggestedActions ?? [],
        entityType: options.entityType,
        entityIds: options.entityIds,
        severity: options.severity ?? "medium",
    };
}
export async function computeResonanceSnapshot() {
    const collections = await listAllRecords();
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
export async function saveResonanceInsights(insights) {
    const trimmed = insights.slice(0, 100);
    await writeInsights(trimmed);
}
export async function getRecentInsights(limit = 20) {
    const insights = await readInsights();
    return insights.slice(0, limit);
}
