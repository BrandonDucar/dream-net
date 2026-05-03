// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/replication.proto

import type { Long } from '@grpc/proto-loader';

export interface GetShardTransactionsRequest {
  'shardId'?: (number);
  'height'?: (number | string | Long);
  'trieVirtualShard'?: (number);
  'pageToken'?: (string);
  '_pageToken'?: "pageToken";
}

export interface GetShardTransactionsRequest__Output {
  'shardId': (number);
  'height': (string);
  'trieVirtualShard': (number);
  'pageToken'?: (string);
  '_pageToken'?: "pageToken";
}
