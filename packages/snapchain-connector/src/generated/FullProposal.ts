// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Height as _Height, Height__Output as _Height__Output } from './Height';
import type { Block as _Block, Block__Output as _Block__Output } from './Block';
import type { ShardChunk as _ShardChunk, ShardChunk__Output as _ShardChunk__Output } from './ShardChunk';
import type { Long } from '@grpc/proto-loader';

export interface FullProposal {
  'height'?: (_Height | null);
  'round'?: (number | string | Long);
  'proposer'?: (Buffer | Uint8Array | string);
  'block'?: (_Block | null);
  'shard'?: (_ShardChunk | null);
  'proposedValue'?: "block"|"shard";
}

export interface FullProposal__Output {
  'height': (_Height__Output | null);
  'round': (string);
  'proposer': (Buffer);
  'block'?: (_Block__Output | null);
  'shard'?: (_ShardChunk__Output | null);
  'proposedValue'?: "block"|"shard";
}
