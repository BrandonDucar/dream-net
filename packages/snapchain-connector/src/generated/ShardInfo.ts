// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface ShardInfo {
  'shardId'?: (number);
  'maxHeight'?: (number | string | Long);
  'numMessages'?: (number | string | Long);
  'numFidRegistrations'?: (number | string | Long);
  'approxSize'?: (number | string | Long);
  'blockDelay'?: (number | string | Long);
  'mempoolSize'?: (number | string | Long);
  'numOnchainEvents'?: (number | string | Long);
}

export interface ShardInfo__Output {
  'shardId': (number);
  'maxHeight': (string);
  'numMessages': (string);
  'numFidRegistrations': (string);
  'approxSize': (string);
  'blockDelay': (string);
  'mempoolSize': (string);
  'numOnchainEvents': (string);
}
