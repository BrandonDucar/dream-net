import { SpiderStore } from "../store/spiderStore";
let threadCounter = 0;
function nextThreadId() {
    threadCounter += 1;
    return `thread:${Date.now()}:${threadCounter}`;
}
function node(kind, id, label) {
    return { kind, id, label };
}
export function runHeadSpider(ctx) {
    const newThreads = [];
    const now = Date.now();
    // Example: if WolfPack has hot leads, spin a story thread to Orca/Narrative
    if (ctx.wolfPackCore?.status) {
        const wolfStatus = ctx.wolfPackCore.status();
        if (wolfStatus.hotLeadCount && wolfStatus.hotLeadCount > 0) {
            const t = {
                id: nextThreadId(),
                source: node("wolf", "wolf:funding", "Wolf Pack Funding"),
                targets: [
                    node("orca", "orca:social", "Orca Pack"),
                    node("narrative", "narrative:main", "NarrativeField"),
                ],
                kind: "wolf-win-story",
                payload: {
                    hotLeadCount: wolfStatus.hotLeadCount,
                },
                status: "pending",
                priority: "high",
                createdAt: now,
                updatedAt: now,
                executable: true,
            };
            SpiderStore.addThread(t);
            newThreads.push(t);
            console.log("[HeadSpider] Created thread: Wolf win → Orca/Narrative");
        }
    }
    // Example: if Whale has many plans, signal Orca to talk about it
    if (ctx.whalePackCore?.status) {
        const whaleStatus = ctx.whalePackCore.status();
        if (whaleStatus.planCount && whaleStatus.planCount > 0) {
            const t = {
                id: nextThreadId(),
                source: node("whale", "whale:tiktok", "Whale Pack"),
                targets: [node("orca", "orca:social", "Orca Pack")],
                kind: "whale-hook-crosspost",
                payload: {
                    planCount: whaleStatus.planCount,
                },
                status: "pending",
                priority: "medium",
                createdAt: now,
                updatedAt: now,
                executable: true,
            };
            SpiderStore.addThread(t);
            newThreads.push(t);
            console.log("[HeadSpider] Created thread: Whale plans → Orca");
        }
    }
    // Example: if DreamStateCore has any open proposals, spin a "dream-state-decision"
    if (ctx.dreamStateCore?.status) {
        const stateStatus = ctx.dreamStateCore.status();
        if (stateStatus?.openProposals && stateStatus.openProposals > 0) {
            const t = {
                id: nextThreadId(),
                source: node("dream-state", "state:core", "Dream STATE"),
                targets: [
                    node("orca", "orca:social", "Orca Pack"),
                    node("narrative", "narrative:main", "NarrativeField"),
                ],
                kind: "dream-state-decision",
                payload: {
                    openProposals: stateStatus.openProposals,
                },
                status: "pending",
                priority: "high",
                createdAt: now,
                updatedAt: now,
                executable: true,
            };
            SpiderStore.addThread(t);
            newThreads.push(t);
            console.log("[HeadSpider] Created thread: Dream STATE proposals → Orca/Narrative");
        }
    }
    return newThreads;
}
