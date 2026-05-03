// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { ReactionType as _ReactionType, ReactionType__Output as _ReactionType__Output } from './ReactionType';
import type { CastId as _CastId, CastId__Output as _CastId__Output } from './CastId';

export interface ReactionBody {
  'type'?: (_ReactionType);
  'targetCastId'?: (_CastId | null);
  'targetUrl'?: (string);
  'target'?: "targetCastId"|"targetUrl";
}

export interface ReactionBody__Output {
  'type': (_ReactionType__Output);
  'targetCastId'?: (_CastId__Output | null);
  'targetUrl'?: (string);
  'target'?: "targetCastId"|"targetUrl";
}
