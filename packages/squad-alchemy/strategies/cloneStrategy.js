export function proposeCloneStrategy(squad) {
    if (!squad.members.length) {
        return {
            action: "noop",
            reason: "Cannot clone an empty squad",
            targetSquadIds: [squad.id],
        };
    }
    const clone = {
        ...squad,
        id: `${squad.id}-clone-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lineage: {
            parentIds: [squad.id],
            generation: (squad.lineage?.generation ?? 1) + 1,
        },
    };
    return {
        action: "clone",
        reason: "Cloned squad to increase coverage on critical tasks",
        targetSquadIds: [squad.id],
        newSquads: [clone],
    };
}
