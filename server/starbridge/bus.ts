import { nanoid } from "nanoid";
import { StarbridgeEvent, StarbridgeTopic } from "./types";
import { persistEvent } from "./repository";

type Subscriber = {
  id: string;
  topics: Set<StarbridgeTopic>;
  send: (event: StarbridgeEvent) => void;
};

const subscribers = new Map<string, Subscriber>();

export async function publish(event: StarbridgeEvent) {
  await persistEvent(event);

  for (const subscriber of subscribers.values()) {
    if (subscriber.topics.has(event.topic)) {
      try {
        subscriber.send(event);
      } catch (error) {
        console.error("[StarBridge] Failed to notify subscriber", error);
      }
    }
  }
}

export function addSubscriber(topics: StarbridgeTopic[], send: (event: StarbridgeEvent) => void) {
  const subscriber: Subscriber = {
    id: nanoid(),
    topics: new Set(topics),
    send,
  };

  subscribers.set(subscriber.id, subscriber);

  return () => {
    subscribers.delete(subscriber.id);
  };
}

export function rebuildEvent<T>(
  partial: Omit<StarbridgeEvent<T>, "id" | "ts"> & { id?: string; ts?: Date | number },
): StarbridgeEvent<T> {
  return {
    id: partial.id ?? nanoid(),
    topic: partial.topic,
    source: partial.source,
    type: partial.type,
    ts: partial.ts instanceof Date ? partial.ts : partial.ts ? new Date(partial.ts) : new Date(),
    payload: partial.payload,
    replayed: partial.replayed ?? false,
  };
}
