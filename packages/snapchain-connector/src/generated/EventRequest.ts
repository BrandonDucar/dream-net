// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface EventRequest {
  'id'?: (number | string | Long);
  'shardIndex'?: (number);
}

export interface EventRequest__Output {
  'id': (string);
  'shardIndex': (number);
}
