// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Long } from '@grpc/proto-loader';

export interface Height {
  'shardIndex'?: (number);
  'blockNumber'?: (number | string | Long);
}

export interface Height__Output {
  'shardIndex': (number);
  'blockNumber': (string);
}
