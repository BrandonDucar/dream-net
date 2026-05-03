// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { Long } from '@grpc/proto-loader';

export interface LinkBody {
  'type'?: (string);
  'displayTimestamp'?: (number);
  'targetFid'?: (number | string | Long);
  '_displayTimestamp'?: "displayTimestamp";
  'target'?: "targetFid";
}

export interface LinkBody__Output {
  'type': (string);
  'displayTimestamp'?: (number);
  'targetFid'?: (string);
  '_displayTimestamp'?: "displayTimestamp";
  'target'?: "targetFid";
}
