// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface LinksByTargetRequest {
  'targetFid'?: (number | string | Long);
  'linkType'?: (string);
  'pageSize'?: (number);
  'pageToken'?: (Buffer | Uint8Array | string);
  'reverse'?: (boolean);
  'target'?: "targetFid";
  '_linkType'?: "linkType";
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}

export interface LinksByTargetRequest__Output {
  'targetFid'?: (string);
  'linkType'?: (string);
  'pageSize'?: (number);
  'pageToken'?: (Buffer);
  'reverse'?: (boolean);
  'target'?: "targetFid";
  '_linkType'?: "linkType";
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}
