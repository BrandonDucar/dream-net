// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Height as _Height, Height__Output as _Height__Output } from './Height';

export interface ShardChunkWitness {
  'height'?: (_Height | null);
  'shardRoot'?: (Buffer | Uint8Array | string);
  'shardHash'?: (Buffer | Uint8Array | string);
}

export interface ShardChunkWitness__Output {
  'height': (_Height__Output | null);
  'shardRoot': (Buffer);
  'shardHash': (Buffer);
}
