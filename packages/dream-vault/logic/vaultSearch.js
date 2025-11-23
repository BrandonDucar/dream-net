import { VaultStore } from "../store/vaultStore";
export function searchVault(query) {
    const index = VaultStore.getIndex();
    const entries = Array.from(index.values());
    const filtered = entries.filter((entry) => {
        if (query.kind && entry.kind !== query.kind)
            return false;
        if (query.state && entry.state !== query.state)
            return false;
        if (query.tag && !entry.tags.includes(query.tag))
            return false;
        if (query.text) {
            const t = query.text.toLowerCase();
            const titleMatch = entry.title.toLowerCase().includes(t);
            const tagMatch = entry.tags.some((tag) => tag.toLowerCase().includes(t));
            if (!titleMatch && !tagMatch)
                return false;
        }
        return true;
    });
    let items = filtered.map((e) => VaultStore.get(e.id)).filter(Boolean);
    if (query.refId) {
        items = items.filter((item) => (item.refs ?? []).some((r) => r.id === query.refId));
    }
    const limit = query.limit ?? 50;
    return items.slice(0, limit);
}
