// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/replication.proto

import type { ShardChunk as _ShardChunk, ShardChunk__Output as _ShardChunk__Output } from './ShardChunk';
import type { Block as _Block, Block__Output as _Block__Output } from './Block';
import type { Long } from '@grpc/proto-loader';

export interface ShardSnapshotMetadata {
  'shardId'?: (number);
  'height'?: (number | string | Long);
  'timestamp'?: (number | string | Long);
  'shardChunk'?: (_ShardChunk | null);
  'block'?: (_Block | null);
  'numItems'?: (number | string | Long);
  '_shardChunk'?: "shardChunk";
  '_block'?: "block";
}

export interface ShardSnapshotMetadata__Output {
  'shardId': (number);
  'height': (string);
  'timestamp': (string);
  'shardChunk'?: (_ShardChunk__Output | null);
  'block'?: (_Block__Output | null);
  'numItems': (string);
  '_shardChunk'?: "shardChunk";
  '_block'?: "block";
}
