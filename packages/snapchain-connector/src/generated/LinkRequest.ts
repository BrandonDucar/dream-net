// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Long } from '@grpc/proto-loader';

export interface LinkRequest {
  'fid'?: (number | string | Long);
  'linkType'?: (string);
  'targetFid'?: (number | string | Long);
  'target'?: "targetFid";
}

export interface LinkRequest__Output {
  'fid': (string);
  'linkType': (string);
  'targetFid'?: (string);
  'target'?: "targetFid";
}
