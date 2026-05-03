// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Height as _Height, Height__Output as _Height__Output } from './Height';
import type { Long } from '@grpc/proto-loader';

export interface ShardHeader {
  'height'?: (_Height | null);
  'timestamp'?: (number | string | Long);
  'parentHash'?: (Buffer | Uint8Array | string);
  'shardRoot'?: (Buffer | Uint8Array | string);
}

export interface ShardHeader__Output {
  'height': (_Height__Output | null);
  'timestamp': (string);
  'parentHash': (Buffer);
  'shardRoot': (Buffer);
}
