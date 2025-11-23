import { InitStore } from "../store/initStore";
let templateInitialized = false;
/**
 * Seed a default init flow template if none exist.
 */
export function ensureDefaultTemplateSeeded() {
    if (templateInitialized)
        return;
    const existing = InitStore.listTemplates();
    if (existing.length > 0) {
        templateInitialized = true;
        return;
    }
    const defaultTemplate = {
        id: "default-user-init",
        label: "Default DreamNet Onboarding",
        description: "Intro → choose dream seed → link ritual → first action.",
        steps: [
            {
                id: "step:welcome",
                type: "show-message",
                title: "Welcome to DreamNet",
                description: "Explain DreamNet as a living digital organism on Base.",
                order: 1,
            },
            {
                id: "step:choose-dream-seed",
                type: "attach-dream",
                title: "Choose Your First Dream Seed",
                description: "Attach the identity to a core dream (e.g. DreamNet Core Stability).",
                dreamId: "dreamnet-core-stability",
                order: 2,
            },
            {
                id: "step:link-ritual",
                type: "attach-ritual",
                title: "Link a Zen Ritual",
                description: "Connect a simple ritual from DreamVault (e.g. Zen Garden onboarding).",
                vaultItemId: "template:zen-garden-ritual",
                order: 3,
            },
            {
                id: "step:first-action",
                type: "create-social-post",
                title: "Make Your First Post",
                description: "Create an intro post in the Social Hub to mark your arrival.",
                suggestedAction: "post-intro",
                order: 4,
            },
        ],
    };
    InitStore.upsertTemplate(defaultTemplate);
    templateInitialized = true;
}
/**
 * Advance a given identity one step through its initialization flow.
 * This does not perform side effects (like actually creating posts),
 * but it returns hints about what should be done.
 */
export function advanceIdentityInit(ctx, identityId, templateId = "default-user-init") {
    ensureDefaultTemplateSeeded();
    const template = InitStore.getTemplate(templateId);
    if (!template) {
        throw new Error(`Init template not found: ${templateId}`);
    }
    const state = InitStore.getOrCreateIdentityState(identityId, templateId);
    const steps = [...template.steps].sort((a, b) => a.order - b.order);
    // If already completed, nothing to do.
    if (state.stage === "completed") {
        return { state, nextStep: undefined };
    }
    const completedSet = new Set(state.completedStepIds);
    const next = steps.find((s) => !completedSet.has(s.id));
    if (!next) {
        // All steps completed
        state.stage = "completed";
        InitStore.updateIdentityState(state);
        return { state, nextStep: undefined };
    }
    // Determine new stage
    let newStage = state.stage;
    if (state.stage === "not-started")
        newStage = "welcome";
    else if (state.stage === "welcome")
        newStage = "choose-dream-seed";
    else if (state.stage === "choose-dream-seed")
        newStage = "link-ritual";
    else if (state.stage === "link-ritual")
        newStage = "first-action";
    else if (state.stage === "first-action")
        newStage = "completed";
    state.stage = newStage;
    // We do NOT mark the step as completed yet here — that should happen after the client executes the step.
    InitStore.updateIdentityState(state);
    // We return the next step so the caller knows what should be done.
    return { state, nextStep: next };
}
/**
 * Mark a specific step as completed for an identity.
 */
export function completeInitStepForIdentity(identityId, stepId) {
    const state = InitStore.getIdentityState(identityId);
    if (!state) {
        throw new Error(`No init state found for identity: ${identityId}`);
    }
    if (!state.completedStepIds.includes(stepId)) {
        state.completedStepIds.push(stepId);
    }
    // If all steps completed, set stage to completed.
    const template = InitStore.getTemplate(state.templateId);
    if (template) {
        const totalSteps = template.steps.length;
        if (state.completedStepIds.length >= totalSteps) {
            state.stage = "completed";
        }
    }
    return InitStore.updateIdentityState(state);
}
