import { nanoid } from "nanoid";
import { fetchEvents, markEventReplayed, persistEvent } from "./repository";
import { addSubscriber, publish, rebuildEvent } from "./bus";
import { starbridgeEventSchema } from "./schemas";
import type { StarbridgeEvent, StarbridgePayload } from "./types";
import { StarbridgeSource, StarbridgeTopic } from "./types";

export { StarbridgeTopic, StarbridgeSource } from "./types";
export type { StarbridgeEvent } from "./types";
export { fetchEvents, markEventReplayed };

export async function publishInternalEvent<T extends StarbridgePayload>(
  partial: Omit<StarbridgeEvent<T>, "id" | "ts"> & { id?: string; ts?: Date | number },
) {
  const event = rebuildEvent(partial);
  const parsed = starbridgeEventSchema.parse({
    ...event,
    ts: event.ts.getTime(),
  });

  await publish({
    id: parsed.id ?? nanoid(),
    topic: parsed.topic,
    source: parsed.source,
    type: parsed.type,
    ts: new Date(parsed.ts ?? Date.now()),
    payload: parsed.payload as T,
    replayed: false,
  });
}

export async function publishExternalEvent(payload: unknown) {
  const parsed = starbridgeEventSchema.parse(payload);
  const event: StarbridgeEvent = {
    id: parsed.id ?? nanoid(),
    topic: parsed.topic,
    source: parsed.source,
    type: parsed.type,
    ts: new Date(parsed.ts ?? Date.now()),
    payload: parsed.payload as StarbridgePayload,
    replayed: false,
  };

  await publish(event);
}

export function subscribeToTopics(topics: StarbridgeTopic[], handler: (event: StarbridgeEvent) => void) {
  return addSubscriber(topics, handler);
}

export async function seedSystemHeartbeat() {
  await persistEvent({
    id: nanoid(),
    topic: StarbridgeTopic.System,
    source: StarbridgeSource.Runtime,
    type: "system.startup",
    ts: new Date(),
    payload: { boot: "StarBridge online" },
  });
}
