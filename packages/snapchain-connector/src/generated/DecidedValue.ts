// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Block as _Block, Block__Output as _Block__Output } from './Block';
import type { ShardChunk as _ShardChunk, ShardChunk__Output as _ShardChunk__Output } from './ShardChunk';

export interface DecidedValue {
  'block'?: (_Block | null);
  'shard'?: (_ShardChunk | null);
  'value'?: "block"|"shard";
}

export interface DecidedValue__Output {
  'block'?: (_Block__Output | null);
  'shard'?: (_ShardChunk__Output | null);
  'value'?: "block"|"shard";
}
