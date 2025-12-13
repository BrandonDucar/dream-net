/**
 * Nervous System Core Types
 * Modular architecture connecting Citadel, Drone Dome, Shared Memory, and Message Bus
 */

export type Role = 'sensor' | 'orchestrator' | 'worker' | 'system';

export type Topic = 
  | 'intel.snapshot' 
  | 'task.plan' 
  | 'task.exec' 
  | 'alert' 
  | 'telemetry' 
  | 'state.delta';

export interface NervousMessage<T = unknown> {
  id: string;        // ULID
  ts: number;        // epoch ms
  role: Role;
  topic: Topic;
  key?: string;      // routing key (wallet, appId)
  corr?: string;     // correlation id
  ttlMs?: number;    // optional expiry
  priority?: 1|2|3;  // 1=high, 2=medium, 3=low
  payload: T;
  sig?: string;      // optional signed envelope
}

export interface SharedMemoryKV {
  get<T>(key: string): Promise<T|null>;
  put<T>(key: string, value: T, ttlSec?: number): Promise<void>;
  del(key: string): Promise<void>;
}

export interface SharedMemoryDoc {
  read(id: string): Promise<Record<string,any>|null>;
  upsert(id: string, doc: Record<string,any>): Promise<void>;
  query(q: Record<string,any>): Promise<Record<string,any>[]>;
}

export interface SharedMemoryVec {
  upsert(id: string, embedding: number[], meta?: Record<string,any>): Promise<void>;
  search(embedding: number[], k: number, filter?: Record<string,any>): Promise<Array<{id:string,score:number,meta:any}>>;
}

export interface SharedMemory {
  kv: SharedMemoryKV;
  doc: SharedMemoryDoc;
  vec: SharedMemoryVec;
}

export interface NervousSystemStatus {
  messageBus: {
    published: number;
    subscribers: number;
    topics: Topic[];
  };
  sharedMemory: {
    kvSize: number;
    docSize: number;
    vecSize: number;
  };
  lastRunAt: number | null;
}

