import { createHash } from "crypto";

export type TrailEvent = {
  commitment: string;
  nullifier?: string;
  timestamp?: number;
};

export type TrailNode = TrailEvent & {
  index: number;
  root: string;
};

class InMemoryTrail {
  #nodes: TrailNode[] = [];
  #root = createHash("sha256").update("dreamsnail:genesis").digest("hex");

  append(event: TrailEvent): TrailNode {
    const timestamp = event.timestamp ?? Date.now();
    const index = this.#nodes.length;
    const nextRoot = createHash("sha256")
      .update(this.#root + event.commitment + (event.nullifier ?? "") + timestamp.toString())
      .digest("hex");
    const node: TrailNode = {
      commitment: event.commitment,
      nullifier: event.nullifier,
      timestamp,
      index,
      root: nextRoot,
    };
    this.#nodes.push(node);
    this.#root = nextRoot;
    return node;
  }

  verify(commitment: string): boolean {
    return this.#nodes.some((node) => node.commitment === commitment);
  }

  root() {
    return this.#root;
  }

  nodes() {
    return [...this.#nodes];
  }
}

const trail = new InMemoryTrail();

export function appendTrail(event: TrailEvent) {
  return trail.append(event);
}

export function verifyTrail(commitment: string) {
  return trail.verify(commitment);
}

export function getTrailRoot() {
  return trail.root();
}

export function getTrailNodes() {
  return trail.nodes();
}
