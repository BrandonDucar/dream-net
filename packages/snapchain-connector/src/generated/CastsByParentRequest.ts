// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { CastId as _CastId, CastId__Output as _CastId__Output } from './CastId';

export interface CastsByParentRequest {
  'parentCastId'?: (_CastId | null);
  'pageSize'?: (number);
  'pageToken'?: (Buffer | Uint8Array | string);
  'reverse'?: (boolean);
  'parentUrl'?: (string);
  'parent'?: "parentCastId"|"parentUrl";
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}

export interface CastsByParentRequest__Output {
  'parentCastId'?: (_CastId__Output | null);
  'pageSize'?: (number);
  'pageToken'?: (Buffer);
  'reverse'?: (boolean);
  'parentUrl'?: (string);
  'parent'?: "parentCastId"|"parentUrl";
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}
