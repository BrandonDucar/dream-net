import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";
import { nanoid } from "nanoid";

import { persistEvent } from "./repository";
import {
  PublishOptions,
  StarbridgeEvent,
  StarbridgePayload,
  StarbridgeSource,
  StarbridgeTopic,
} from "./types";

type Subscriber = {
  id: string;
  topics: Set<StarbridgeTopic>;
  send: (event: StarbridgeEvent) => void;
};

const subscribers = new Map<string, Subscriber>();
const bus = new EventEmitter();

export type StarbridgeListener<T = StarbridgePayload> = (event: StarbridgeEvent<T>) => void;

export function onStarbridgeEvent<T = StarbridgePayload>(listener: StarbridgeListener<T>) {
  bus.on("event", listener as StarbridgeListener);
  return () => bus.off("event", listener as StarbridgeListener);
}

export function onceStarbridgeEvent<T = StarbridgePayload>(listener: StarbridgeListener<T>) {
  bus.once("event", listener as StarbridgeListener);
}

export function removeStarbridgeListener<T = StarbridgePayload>(listener: StarbridgeListener<T>) {
  bus.off("event", listener as StarbridgeListener);
}

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

export async function broadcastStarbridgeEvent<T extends StarbridgePayload = StarbridgePayload>(
  data: {
    topic: StarbridgeTopic;
    source: StarbridgeSource;
    type: string;
    payload?: T;
  },
  options?: PublishOptions,
) {
  const event: StarbridgeEvent<T> = {
    id: randomUUID(),
    ts: new Date(),
    replayed: false,
    ...data,
  };

  bus.emit("event", event);

  if (!options?.skipPersistence) {
    try {
      await persistEvent(event as StarbridgeEvent<StarbridgePayload>);
    } catch (error) {
      console.warn(
        `[starbridge] failed to persist event ${event.type}: ${(error as Error).message}`,
      );
    }
  }

  await Promise.allSettled(
    Array.from(subscribers.values()).map(async (subscriber) => {
      if (!subscriber.topics.has(event.topic)) {
        return;
      }

      try {
        subscriber.send(event as StarbridgeEvent<StarbridgePayload>);
      } catch (error) {
        console.error("[StarBridge] Failed to notify subscriber", error);
      }
    }),
  );

  return event;
}
