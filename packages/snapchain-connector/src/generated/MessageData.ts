// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { MessageType as _MessageType, MessageType__Output as _MessageType__Output } from './MessageType';
import type { FarcasterNetwork as _FarcasterNetwork, FarcasterNetwork__Output as _FarcasterNetwork__Output } from './FarcasterNetwork';
import type { CastAddBody as _CastAddBody, CastAddBody__Output as _CastAddBody__Output } from './CastAddBody';
import type { CastRemoveBody as _CastRemoveBody, CastRemoveBody__Output as _CastRemoveBody__Output } from './CastRemoveBody';
import type { ReactionBody as _ReactionBody, ReactionBody__Output as _ReactionBody__Output } from './ReactionBody';
import type { VerificationAddAddressBody as _VerificationAddAddressBody, VerificationAddAddressBody__Output as _VerificationAddAddressBody__Output } from './VerificationAddAddressBody';
import type { VerificationRemoveBody as _VerificationRemoveBody, VerificationRemoveBody__Output as _VerificationRemoveBody__Output } from './VerificationRemoveBody';
import type { UserDataBody as _UserDataBody, UserDataBody__Output as _UserDataBody__Output } from './UserDataBody';
import type { LinkBody as _LinkBody, LinkBody__Output as _LinkBody__Output } from './LinkBody';
import type { UserNameProof as _UserNameProof, UserNameProof__Output as _UserNameProof__Output } from './UserNameProof';
import type { FrameActionBody as _FrameActionBody, FrameActionBody__Output as _FrameActionBody__Output } from './FrameActionBody';
import type { LinkCompactStateBody as _LinkCompactStateBody, LinkCompactStateBody__Output as _LinkCompactStateBody__Output } from './LinkCompactStateBody';
import type { LendStorageBody as _LendStorageBody, LendStorageBody__Output as _LendStorageBody__Output } from './LendStorageBody';
import type { KeyAddBody as _KeyAddBody, KeyAddBody__Output as _KeyAddBody__Output } from './KeyAddBody';
import type { KeyRemoveBody as _KeyRemoveBody, KeyRemoveBody__Output as _KeyRemoveBody__Output } from './KeyRemoveBody';
import type { Long } from '@grpc/proto-loader';

export interface MessageData {
  'type'?: (_MessageType);
  'fid'?: (number | string | Long);
  'timestamp'?: (number);
  'network'?: (_FarcasterNetwork);
  'castAddBody'?: (_CastAddBody | null);
  'castRemoveBody'?: (_CastRemoveBody | null);
  'reactionBody'?: (_ReactionBody | null);
  'verificationAddAddressBody'?: (_VerificationAddAddressBody | null);
  'verificationRemoveBody'?: (_VerificationRemoveBody | null);
  'userDataBody'?: (_UserDataBody | null);
  'linkBody'?: (_LinkBody | null);
  'usernameProofBody'?: (_UserNameProof | null);
  'frameActionBody'?: (_FrameActionBody | null);
  'linkCompactStateBody'?: (_LinkCompactStateBody | null);
  'lendStorageBody'?: (_LendStorageBody | null);
  'keyAddBody'?: (_KeyAddBody | null);
  'keyRemoveBody'?: (_KeyRemoveBody | null);
  'body'?: "castAddBody"|"castRemoveBody"|"reactionBody"|"verificationAddAddressBody"|"verificationRemoveBody"|"userDataBody"|"linkBody"|"usernameProofBody"|"frameActionBody"|"linkCompactStateBody"|"lendStorageBody"|"keyAddBody"|"keyRemoveBody";
}

export interface MessageData__Output {
  'type': (_MessageType__Output);
  'fid': (string);
  'timestamp': (number);
  'network': (_FarcasterNetwork__Output);
  'castAddBody'?: (_CastAddBody__Output | null);
  'castRemoveBody'?: (_CastRemoveBody__Output | null);
  'reactionBody'?: (_ReactionBody__Output | null);
  'verificationAddAddressBody'?: (_VerificationAddAddressBody__Output | null);
  'verificationRemoveBody'?: (_VerificationRemoveBody__Output | null);
  'userDataBody'?: (_UserDataBody__Output | null);
  'linkBody'?: (_LinkBody__Output | null);
  'usernameProofBody'?: (_UserNameProof__Output | null);
  'frameActionBody'?: (_FrameActionBody__Output | null);
  'linkCompactStateBody'?: (_LinkCompactStateBody__Output | null);
  'lendStorageBody'?: (_LendStorageBody__Output | null);
  'keyAddBody'?: (_KeyAddBody__Output | null);
  'keyRemoveBody'?: (_KeyRemoveBody__Output | null);
  'body'?: "castAddBody"|"castRemoveBody"|"reactionBody"|"verificationAddAddressBody"|"verificationRemoveBody"|"userDataBody"|"linkBody"|"usernameProofBody"|"frameActionBody"|"linkCompactStateBody"|"lendStorageBody"|"keyAddBody"|"keyRemoveBody";
}
