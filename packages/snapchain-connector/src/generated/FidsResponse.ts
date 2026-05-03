// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface FidsResponse {
  'fids'?: (number | string | Long)[];
  'nextPageToken'?: (Buffer | Uint8Array | string);
  '_nextPageToken'?: "nextPageToken";
}

export interface FidsResponse__Output {
  'fids': (string)[];
  'nextPageToken'?: (Buffer);
  '_nextPageToken'?: "nextPageToken";
}
