// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { OnChainEventType as _OnChainEventType, OnChainEventType__Output as _OnChainEventType__Output } from './OnChainEventType';
import type { Long } from '@grpc/proto-loader';

export interface OnChainEventRequest {
  'fid'?: (number | string | Long);
  'eventType'?: (_OnChainEventType);
  'pageSize'?: (number);
  'pageToken'?: (Buffer | Uint8Array | string);
  'reverse'?: (boolean);
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}

export interface OnChainEventRequest__Output {
  'fid': (string);
  'eventType': (_OnChainEventType__Output);
  'pageSize'?: (number);
  'pageToken'?: (Buffer);
  'reverse'?: (boolean);
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}
