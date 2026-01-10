export function proposeSplitStrategy(squad) {
    if (squad.members.length < 4) {
        return {
            action: "noop",
            reason: "Squad too small to benefit from splitting",
            targetSquadIds: [squad.id],
        };
    }
    const midpoint = Math.floor(squad.members.length / 2);
    const squadA = {
        ...squad,
        id: `${squad.id}-A-${Date.now()}`,
        members: squad.members.slice(0, midpoint),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lineage: {
            parentIds: [squad.id],
            generation: (squad.lineage?.generation ?? 1) + 1,
        },
    };
    const squadB = {
        ...squad,
        id: `${squad.id}-B-${Date.now()}`,
        members: squad.members.slice(midpoint),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lineage: {
            parentIds: [squad.id],
            generation: (squad.lineage?.generation ?? 1) + 1,
        },
    };
    return {
        action: "split",
        reason: "Split large squad into two for parallelization",
        targetSquadIds: [squad.id],
        newSquads: [squadA, squadB],
    };
}
//# sourceMappingURL=splitStrategy.js.map