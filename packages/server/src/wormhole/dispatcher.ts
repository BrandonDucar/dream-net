import EventEmitter from "events";
import { StarbridgeTopic, subscribeToTopics } from "../starbridge";
import type { StarbridgeEvent } from "../starbridge";

type WormholeListener = (event: StarbridgeEvent) => void;

const wormhole = new EventEmitter();

export function bootstrapWormhole() {
  const topics: StarbridgeTopic[] = [
    StarbridgeTopic.System,
    StarbridgeTopic.Governor,
    StarbridgeTopic.Deploy,
    StarbridgeTopic.Economy,
    StarbridgeTopic.Vault,
  ];

  subscribeToTopics(topics, (event) => {
    wormhole.emit("wormhole.event", event);
  });
}

export function onWormholeEvent(listener: WormholeListener) {
  wormhole.on("wormhole.event", listener);
  return () => wormhole.off("wormhole.event", listener);
}

export function forwardToWebhook(url: string, listener?: WormholeListener) {
  const handler: WormholeListener =
    listener ??
    (async (event) => {
      try {
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...event,
            ts: event.ts.toISOString(),
          }),
        });
      } catch (error) {
        console.error("[Wormhole] Failed to forward event to webhook", url, error);
      }
    });

  wormhole.on("wormhole.event", handler);
  return () => wormhole.off("wormhole.event", handler);
}
