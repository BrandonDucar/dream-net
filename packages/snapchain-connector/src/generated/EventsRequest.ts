// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface EventsRequest {
  'startId'?: (number | string | Long);
  'shardIndex'?: (number);
  'stopId'?: (number | string | Long);
  'pageSize'?: (number);
  'pageToken'?: (Buffer | Uint8Array | string);
  'reverse'?: (boolean);
  '_shardIndex'?: "shardIndex";
  '_stopId'?: "stopId";
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}

export interface EventsRequest__Output {
  'startId': (string);
  'shardIndex'?: (number);
  'stopId'?: (string);
  'pageSize'?: (number);
  'pageToken'?: (Buffer);
  'reverse'?: (boolean);
  '_shardIndex'?: "shardIndex";
  '_stopId'?: "stopId";
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}
