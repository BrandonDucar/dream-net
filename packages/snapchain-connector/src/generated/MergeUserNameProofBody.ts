// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/hub_event.proto

import type { UserNameProof as _UserNameProof, UserNameProof__Output as _UserNameProof__Output } from './UserNameProof';
import type { Message as _Message, Message__Output as _Message__Output } from './Message';

export interface MergeUserNameProofBody {
  'usernameProof'?: (_UserNameProof | null);
  'deletedUsernameProof'?: (_UserNameProof | null);
  'usernameProofMessage'?: (_Message | null);
  'deletedUsernameProofMessage'?: (_Message | null);
}

export interface MergeUserNameProofBody__Output {
  'usernameProof': (_UserNameProof__Output | null);
  'deletedUsernameProof': (_UserNameProof__Output | null);
  'usernameProofMessage': (_Message__Output | null);
  'deletedUsernameProofMessage': (_Message__Output | null);
}
