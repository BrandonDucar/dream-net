// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { HubEventType as _HubEventType, HubEventType__Output as _HubEventType__Output } from './HubEventType';
import type { Long } from '@grpc/proto-loader';

export interface SubscribeRequest {
  'eventTypes'?: (_HubEventType)[];
  'fromId'?: (number | string | Long);
  'shardIndex'?: (number);
  '_fromId'?: "fromId";
  '_shardIndex'?: "shardIndex";
}

export interface SubscribeRequest__Output {
  'eventTypes': (_HubEventType__Output)[];
  'fromId'?: (string);
  'shardIndex'?: (number);
  '_fromId'?: "fromId";
  '_shardIndex'?: "shardIndex";
}
