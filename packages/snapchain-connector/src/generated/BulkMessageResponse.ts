// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { Message as _Message, Message__Output as _Message__Output } from './Message';
import type { MessageError as _MessageError, MessageError__Output as _MessageError__Output } from './MessageError';

export interface BulkMessageResponse {
  'message'?: (_Message | null);
  'messageError'?: (_MessageError | null);
  'response'?: "message"|"messageError";
}

export interface BulkMessageResponse__Output {
  'message'?: (_Message__Output | null);
  'messageError'?: (_MessageError__Output | null);
  'response'?: "message"|"messageError";
}
