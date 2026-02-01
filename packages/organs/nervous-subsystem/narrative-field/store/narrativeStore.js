const entries = [];
const MAX_ENTRIES = 1000;
function severityRank(s) {
    switch (s) {
        case "info": return 0;
        case "notice": return 1;
        case "warning": return 2;
        case "critical": return 3;
        default: return 0;
    }
}
export const NarrativeStore = {
    add(entry) {
        entries.push(entry);
        if (entries.length > MAX_ENTRIES) {
            const overflow = entries.length - MAX_ENTRIES;
            entries.splice(0, overflow);
        }
    },
    list(filter) {
        let result = [...entries];
        if (filter?.domain) {
            result = result.filter((e) => e.domain === filter.domain);
        }
        if (filter?.severityMin) {
            const minRank = severityRank(filter.severityMin);
            result = result.filter((e) => severityRank(e.severity) >= minRank);
        }
        if (filter?.sinceTs) {
            result = result.filter((e) => e.timestamp >= filter.sinceTs);
        }
        if (filter?.tag) {
            result = result.filter((e) => e.tags?.includes(filter.tag));
        }
        return result;
    },
    status() {
        const recentEntries = entries.slice(-50);
        return {
            entryCount: entries.length,
            recentEntries,
        };
    },
};
//# sourceMappingURL=narrativeStore.js.map