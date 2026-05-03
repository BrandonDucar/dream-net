// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { HubEvent as _HubEvent, HubEvent__Output as _HubEvent__Output } from './HubEvent';

export interface EventsResponse {
  'events'?: (_HubEvent)[];
  'nextPageToken'?: (Buffer | Uint8Array | string);
  '_nextPageToken'?: "nextPageToken";
}

export interface EventsResponse__Output {
  'events': (_HubEvent__Output)[];
  'nextPageToken'?: (Buffer);
  '_nextPageToken'?: "nextPageToken";
}
