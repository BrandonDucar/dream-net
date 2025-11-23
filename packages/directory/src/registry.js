/**
 * Directory Registry
 * Central registry for all DreamNet entities (citizens, agents, dreams, nodes, ports, conduits)
 */
const DIRECTORY = new Map();
function nowIso() {
    return new Date().toISOString();
}
export function registerEntry(entry) {
    const existing = DIRECTORY.get(entry.id);
    const timestamp = nowIso();
    const withTimestamps = {
        ...entry,
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
    };
    DIRECTORY.set(entry.id, withTimestamps);
    return withTimestamps;
}
export function getEntry(id) {
    return DIRECTORY.get(id);
}
export function listEntriesByType(type) {
    return Array.from(DIRECTORY.values()).filter((e) => e.type === type);
}
export function listAllEntries() {
    return Array.from(DIRECTORY.values());
}
export function searchEntries(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(DIRECTORY.values()).filter((e) => e.label.toLowerCase().includes(lowerQuery) ||
        e.id.toLowerCase().includes(lowerQuery) ||
        e.description?.toLowerCase().includes(lowerQuery));
}
// Helper creators for each entity type:
export function registerCitizen(props) {
    const id = props.citizenId; // use citizenId as directory id for now
    const base = {
        id,
        type: "citizen",
        label: props.label,
        description: props.description,
        createdAt: "",
        updatedAt: "",
    };
    return registerEntry({
        ...base,
        citizenId: props.citizenId,
    });
}
export function registerAgent(props) {
    const id = `AGENT-${props.agentId}`;
    const base = {
        id,
        type: "agent",
        label: props.label,
        description: props.description,
        createdAt: "",
        updatedAt: "",
    };
    return registerEntry({
        ...base,
        agentId: props.agentId,
        clusterId: props.clusterId,
        kind: props.kind,
    });
}
export function registerDream(props) {
    const id = props.dreamId;
    const base = {
        id,
        type: "dream",
        label: props.label,
        description: props.description,
        createdAt: "",
        updatedAt: "",
    };
    return registerEntry({
        ...base,
        dreamId: props.dreamId,
        founderCitizenId: props.founderCitizenId,
        status: props.status,
    });
}
export function registerNode(props) {
    const id = props.nodeId;
    const base = {
        id,
        type: "node",
        label: props.label,
        description: props.description,
        createdAt: "",
        updatedAt: "",
    };
    return registerEntry({
        ...base,
        nodeId: props.nodeId,
        clusterId: props.clusterId,
    });
}
export function registerPort(props) {
    const id = `PORT-${props.portId}`;
    const base = {
        id,
        type: "port",
        label: props.label,
        description: props.description,
        createdAt: "",
        updatedAt: "",
    };
    return registerEntry({
        ...base,
        portId: props.portId,
    });
}
export function registerConduit(props) {
    const id = `CONDUIT-${props.conduitId}`;
    const base = {
        id,
        type: "conduit",
        label: props.label,
        description: props.description,
        createdAt: "",
        updatedAt: "",
    };
    return registerEntry({
        ...base,
        conduitId: props.conduitId,
        portId: props.portId,
        clusterId: props.clusterId,
        toolId: props.toolId,
    });
}
