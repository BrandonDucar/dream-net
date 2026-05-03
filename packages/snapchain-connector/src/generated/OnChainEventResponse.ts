// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { OnChainEvent as _OnChainEvent, OnChainEvent__Output as _OnChainEvent__Output } from './OnChainEvent';

export interface OnChainEventResponse {
  'events'?: (_OnChainEvent)[];
  'nextPageToken'?: (Buffer | Uint8Array | string);
  '_nextPageToken'?: "nextPageToken";
}

export interface OnChainEventResponse__Output {
  'events': (_OnChainEvent__Output)[];
  'nextPageToken'?: (Buffer);
  '_nextPageToken'?: "nextPageToken";
}
