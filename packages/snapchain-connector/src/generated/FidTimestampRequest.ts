// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface FidTimestampRequest {
  'fid'?: (number | string | Long);
  'pageSize'?: (number);
  'pageToken'?: (Buffer | Uint8Array | string);
  'reverse'?: (boolean);
  'startTimestamp'?: (number | string | Long);
  'stopTimestamp'?: (number | string | Long);
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
  '_startTimestamp'?: "startTimestamp";
  '_stopTimestamp'?: "stopTimestamp";
}

export interface FidTimestampRequest__Output {
  'fid': (string);
  'pageSize'?: (number);
  'pageToken'?: (Buffer);
  'reverse'?: (boolean);
  'startTimestamp'?: (string);
  'stopTimestamp'?: (string);
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
  '_startTimestamp'?: "startTimestamp";
  '_stopTimestamp'?: "stopTimestamp";
}
