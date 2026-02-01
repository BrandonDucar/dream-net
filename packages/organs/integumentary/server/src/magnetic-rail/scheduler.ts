import cron from "node-cron";
import EventEmitter from "events";
import { StarbridgeEvent, StarbridgeTopic, subscribeToTopics } from "../starbridge";
import { publishInternalEvent } from "../starbridge";
import { StarbridgeSource } from "../starbridge";

type RailJob = {
  id: string;
  name: string;
  cronExpression: string;
  handler: () => Promise<void> | void;
  active: boolean;
};

const jobs = new Map<string, RailJob>();
const railEvents = new EventEmitter();

export function registerRailJob(job: RailJob) {
  if (jobs.has(job.id)) {
    throw new Error(`Rail job with id ${job.id} already registered`);
  }

  jobs.set(job.id, job);

  const task = cron.schedule(job.cronExpression, async () => {
    if (!job.active) return;
    const start = Date.now();

    railEvents.emit("magnetic-rail.job.start", job);
    await publishInternalEvent({
      topic: StarbridgeTopic.System,
      source: StarbridgeSource.Runtime,
      type: "rail.job.start",
      payload: { jobId: job.id, name: job.name, ts: Date.now() },
    });

    try {
      await job.handler();
      const durationMs = Date.now() - start;
      railEvents.emit("magnetic-rail.job.complete", job, durationMs);
      await publishInternalEvent({
        topic: StarbridgeTopic.System,
        source: StarbridgeSource.Runtime,
        type: "rail.job.complete",
        payload: { jobId: job.id, name: job.name, durationMs },
      });
    } catch (error: any) {
      railEvents.emit("magnetic-rail.job.error", job, error);
      await publishInternalEvent({
        topic: StarbridgeTopic.System,
        source: StarbridgeSource.Runtime,
        type: "rail.job.error",
        payload: { jobId: job.id, name: job.name, error: error?.message ?? "unknown" },
      });
    }
  });

  task.start();
}

export function onRailEvent(event: string, handler: (...args: any[]) => void) {
  railEvents.on(event, handler);
  return () => railEvents.off(event, handler);
}

export function bootstrapRail() {
  subscribeToTopics([StarbridgeTopic.Governor], (event: StarbridgeEvent) => {
    railEvents.emit("magnetic-rail.governor", event);
  });

  subscribeToTopics([StarbridgeTopic.System], (event: StarbridgeEvent) => {
    if (event.type === "rail.job.activate") {
      const job = jobs.get(event.payload?.jobId as string);
      if (job) {
        job.active = true;
      }
    }

    if (event.type === "rail.job.pause") {
      const job = jobs.get(event.payload?.jobId as string);
      if (job) {
        job.active = false;
      }
    }
  });
}
