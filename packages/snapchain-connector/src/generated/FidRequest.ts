// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface FidRequest {
  'fid'?: (number | string | Long);
  'pageSize'?: (number);
  'pageToken'?: (Buffer | Uint8Array | string);
  'reverse'?: (boolean);
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}

export interface FidRequest__Output {
  'fid': (string);
  'pageSize'?: (number);
  'pageToken'?: (Buffer);
  'reverse'?: (boolean);
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}
