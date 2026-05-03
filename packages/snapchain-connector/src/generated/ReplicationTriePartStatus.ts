// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/replication.proto

import type { Long } from '@grpc/proto-loader';

export interface ReplicationTriePartStatus {
  'shardId'?: (number);
  'height'?: (number | string | Long);
  'virtualTrieShard'?: (number);
  'nextPageToken'?: (string);
  'lastResponse'?: (number);
  'lastFid'?: (number | string | Long);
  '_nextPageToken'?: "nextPageToken";
  '_lastFid'?: "lastFid";
}

export interface ReplicationTriePartStatus__Output {
  'shardId': (number);
  'height': (string);
  'virtualTrieShard': (number);
  'nextPageToken'?: (string);
  'lastResponse': (number);
  'lastFid'?: (string);
  '_nextPageToken'?: "nextPageToken";
  '_lastFid'?: "lastFid";
}
