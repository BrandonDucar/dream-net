// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { BlockEventType as _BlockEventType, BlockEventType__Output as _BlockEventType__Output } from './BlockEventType';
import type { HeartbeatEventBody as _HeartbeatEventBody, HeartbeatEventBody__Output as _HeartbeatEventBody__Output } from './HeartbeatEventBody';
import type { MergeMessageEventBody as _MergeMessageEventBody, MergeMessageEventBody__Output as _MergeMessageEventBody__Output } from './MergeMessageEventBody';
import type { Long } from '@grpc/proto-loader';

export interface BlockEventData {
  'seqnum'?: (number | string | Long);
  'type'?: (_BlockEventType);
  'blockNumber'?: (number | string | Long);
  'eventIndex'?: (number | string | Long);
  'blockTimestamp'?: (number | string | Long);
  'heartbeatEventBody'?: (_HeartbeatEventBody | null);
  'mergeMessageEventBody'?: (_MergeMessageEventBody | null);
  'body'?: "heartbeatEventBody"|"mergeMessageEventBody";
}

export interface BlockEventData__Output {
  'seqnum': (string);
  'type': (_BlockEventType__Output);
  'blockNumber': (string);
  'eventIndex': (string);
  'blockTimestamp': (string);
  'heartbeatEventBody'?: (_HeartbeatEventBody__Output | null);
  'mergeMessageEventBody'?: (_MergeMessageEventBody__Output | null);
  'body'?: "heartbeatEventBody"|"mergeMessageEventBody";
}
