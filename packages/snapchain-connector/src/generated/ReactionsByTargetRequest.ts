// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { CastId as _CastId, CastId__Output as _CastId__Output } from './CastId';
import type { ReactionType as _ReactionType, ReactionType__Output as _ReactionType__Output } from './ReactionType';

export interface ReactionsByTargetRequest {
  'targetCastId'?: (_CastId | null);
  'reactionType'?: (_ReactionType);
  'pageSize'?: (number);
  'pageToken'?: (Buffer | Uint8Array | string);
  'reverse'?: (boolean);
  'targetUrl'?: (string);
  'target'?: "targetCastId"|"targetUrl";
  '_reactionType'?: "reactionType";
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}

export interface ReactionsByTargetRequest__Output {
  'targetCastId'?: (_CastId__Output | null);
  'reactionType'?: (_ReactionType__Output);
  'pageSize'?: (number);
  'pageToken'?: (Buffer);
  'reverse'?: (boolean);
  'targetUrl'?: (string);
  'target'?: "targetCastId"|"targetUrl";
  '_reactionType'?: "reactionType";
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}
