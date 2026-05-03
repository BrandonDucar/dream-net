// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Message as _Message, Message__Output as _Message__Output } from './Message';

export interface MessagesResponse {
  'messages'?: (_Message)[];
  'nextPageToken'?: (Buffer | Uint8Array | string);
  '_nextPageToken'?: "nextPageToken";
}

export interface MessagesResponse__Output {
  'messages': (_Message__Output)[];
  'nextPageToken'?: (Buffer);
  '_nextPageToken'?: "nextPageToken";
}
