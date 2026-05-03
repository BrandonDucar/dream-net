// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface ShardChunksRequest {
  'shardId'?: (number);
  'startBlockNumber'?: (number | string | Long);
  'stopBlockNumber'?: (number | string | Long);
  '_stopBlockNumber'?: "stopBlockNumber";
}

export interface ShardChunksRequest__Output {
  'shardId': (number);
  'startBlockNumber': (string);
  'stopBlockNumber'?: (string);
  '_stopBlockNumber'?: "stopBlockNumber";
}
