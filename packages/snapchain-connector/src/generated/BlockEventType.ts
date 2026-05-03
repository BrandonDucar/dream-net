// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

export const BlockEventType = {
  BLOCK_EVENT_TYPE_HEARTBEAT: 'BLOCK_EVENT_TYPE_HEARTBEAT',
  BLOCK_EVENT_TYPE_MERGE_MESSAGE: 'BLOCK_EVENT_TYPE_MERGE_MESSAGE',
} as const;

export type BlockEventType =
  | 'BLOCK_EVENT_TYPE_HEARTBEAT'
  | 0
  | 'BLOCK_EVENT_TYPE_MERGE_MESSAGE'
  | 1

export type BlockEventType__Output = typeof BlockEventType[keyof typeof BlockEventType]
