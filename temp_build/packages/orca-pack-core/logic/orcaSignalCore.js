"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSeedThemes = ensureSeedThemes;
exports.generateNewOrcaIdeas = generateNewOrcaIdeas;
exports.generateOrcaPlansFromIdeas = generateOrcaPlansFromIdeas;
const orcaStore_1 = require("../store/orcaStore");
let ideaCounter = 0;
let planCounter = 0;
function nextIdeaId() {
    ideaCounter += 1;
    return `orca:idea:${Date.now()}:${ideaCounter}`;
}
function nextPlanId() {
    planCounter += 1;
    return `orca:plan:${Date.now()}:${planCounter}`;
}
function ensureSeedThemes() {
    if (orcaStore_1.OrcaStore.listThemes().length > 0)
        return;
    const now = Date.now();
    orcaStore_1.OrcaStore.upsertTheme({
        id: "theme:dreamnet-organism",
        name: "DreamNet as a Living Organism",
        tags: ["dreamnet", "organism", "multi-agent"],
        createdAt: now,
        updatedAt: now,
    });
    orcaStore_1.OrcaStore.upsertTheme({
        id: "theme:wolf-pack",
        name: "Wolf Pack Funding Ops",
        tags: ["wolfpack", "funding", "ops"],
        createdAt: now,
        updatedAt: now,
    });
    orcaStore_1.OrcaStore.upsertTheme({
        id: "theme:whale-pack",
        name: "Whale Group TikTok Ops",
        tags: ["whale", "tiktok", "commerce"],
        createdAt: now,
        updatedAt: now,
    });
}
function generateNewOrcaIdeas(ctx, desiredCount = 5) {
    const themes = orcaStore_1.OrcaStore.listThemes();
    const existingIdeas = orcaStore_1.OrcaStore.listIdeas();
    const toGenerate = Math.max(0, desiredCount - existingIdeas.length);
    const newIdeas = [];
    const now = Date.now();
    if (themes.length === 0 || toGenerate <= 0)
        return [];
    for (let i = 0; i < toGenerate; i++) {
        const theme = themes[i % themes.length];
        const kind = theme.id === "theme:dreamnet-organism" ? "thread" :
            theme.id === "theme:wolf-pack" ? "short-text" :
                "short-text";
        const title = buildIdeaTitleForTheme(theme);
        const body = buildIdeaBodyForTheme(theme);
        const idea = {
            id: nextIdeaId(),
            kind,
            themeId: theme.id,
            title,
            body,
            tags: theme.tags,
            createdAt: now,
            updatedAt: now,
            score: 0.5,
        };
        orcaStore_1.OrcaStore.upsertIdea(idea);
        newIdeas.push(idea);
        console.log("[OrcaSignalCore] Generated idea:", {
            id: idea.id,
            theme: theme.name,
            kind: idea.kind,
        });
    }
    return newIdeas;
}
function buildIdeaTitleForTheme(theme) {
    if (theme.id === "theme:dreamnet-organism") {
        return "DreamNet isn’t an app. It’s an organism.";
    }
    if (theme.id === "theme:wolf-pack") {
        return "We built an AI wolf pack to hunt funding.";
    }
    if (theme.id === "theme:whale-pack") {
        return "Teaching an AI whale how to sell on TikTok.";
    }
    return theme.name;
}
function buildIdeaBodyForTheme(theme) {
    if (theme.id === "theme:dreamnet-organism") {
        return "Short thread explaining how DreamNet is structured like a living nervous system, with agents as cells and packs as organs.";
    }
    if (theme.id === "theme:wolf-pack") {
        return "Explain how the Wolf Pack finds investors, drafts emails, and learns who to chase.";
    }
    if (theme.id === "theme:whale-pack") {
        return "Explain how Whale Pack brainstorms TikToks for TikTok Shop, with hooks and audience-targeted plans.";
    }
    return "Narrative related to " + theme.name;
}
function generateOrcaPlansFromIdeas(ctx, perIdeaChannels = ["x", "farcaster"]) {
    const ideas = orcaStore_1.OrcaStore.listIdeas();
    const existingPlans = orcaStore_1.OrcaStore.listPlans();
    const existingPlanByIdeaChannel = new Set(existingPlans.map((p) => `${p.ideaId}:${p.channel}`));
    const now = Date.now();
    const newPlans = [];
    for (const idea of ideas) {
        for (const channel of perIdeaChannels) {
            const key = `${idea.id}:${channel}`;
            if (existingPlanByIdeaChannel.has(key))
                continue;
            const rendered = renderIdeaForChannel(idea, channel);
            const plan = {
                id: nextPlanId(),
                ideaId: idea.id,
                channel,
                status: "draft",
                scheduledAt: undefined,
                postedAt: undefined,
                failureReason: undefined,
                renderedTitle: rendered.title,
                renderedBody: rendered.body,
                renderedMeta: rendered.meta,
                createdAt: now,
                updatedAt: now,
            };
            orcaStore_1.OrcaStore.upsertPlan(plan);
            newPlans.push(plan);
            console.log("[OrcaSignalCore] Generated plan:", {
                id: plan.id,
                ideaId: plan.ideaId,
                channel,
            });
        }
    }
    return newPlans;
}
function renderIdeaForChannel(idea, channel) {
    switch (channel) {
        case "x":
            return { title: idea.title, body: idea.body, meta: { format: "thread" } };
        case "farcaster":
            return { title: idea.title, body: idea.body, meta: { format: "cast" } };
        case "instagram":
        case "threads":
        case "youtube-shorts":
        default:
            return { title: idea.title, body: idea.body, meta: { format: "short-text" } };
    }
}
