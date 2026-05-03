// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { CastId as _CastId, CastId__Output as _CastId__Output } from './CastId';

export interface Embed {
  'url'?: (string);
  'castId'?: (_CastId | null);
  'embed'?: "url"|"castId";
}

export interface Embed__Output {
  'url'?: (string);
  'castId'?: (_CastId__Output | null);
  'embed'?: "url"|"castId";
}
