import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  BlockConfirmedBody: MessageTypeDefinition
  CastAddBody: MessageTypeDefinition
  CastId: MessageTypeDefinition
  CastRemoveBody: MessageTypeDefinition
  CastType: EnumTypeDefinition
  Embed: MessageTypeDefinition
  FarcasterNetwork: EnumTypeDefinition
  FrameActionBody: MessageTypeDefinition
  HashScheme: EnumTypeDefinition
  HubEvent: MessageTypeDefinition
  HubEventType: EnumTypeDefinition
  IdRegisterEventBody: MessageTypeDefinition
  IdRegisterEventType: EnumTypeDefinition
  KeyAddBody: MessageTypeDefinition
  KeyRemoveBody: MessageTypeDefinition
  LendStorageBody: MessageTypeDefinition
  LinkBody: MessageTypeDefinition
  LinkCompactStateBody: MessageTypeDefinition
  MergeFailureBody: MessageTypeDefinition
  MergeMessageBody: MessageTypeDefinition
  MergeOnChainEventBody: MessageTypeDefinition
  MergeUserNameProofBody: MessageTypeDefinition
  Message: MessageTypeDefinition
  MessageData: MessageTypeDefinition
  MessageType: EnumTypeDefinition
  OnChainEvent: MessageTypeDefinition
  OnChainEventType: EnumTypeDefinition
  Protocol: EnumTypeDefinition
  PruneMessageBody: MessageTypeDefinition
  ReactionBody: MessageTypeDefinition
  ReactionType: EnumTypeDefinition
  RevokeMessageBody: MessageTypeDefinition
  SignatureScheme: EnumTypeDefinition
  SignerEventBody: MessageTypeDefinition
  SignerEventType: EnumTypeDefinition
  SignerMigratedEventBody: MessageTypeDefinition
  StorageRentEventBody: MessageTypeDefinition
  StorageUnitType: EnumTypeDefinition
  TierPurchaseBody: MessageTypeDefinition
  TierType: EnumTypeDefinition
  UserDataBody: MessageTypeDefinition
  UserDataType: EnumTypeDefinition
  UserNameProof: MessageTypeDefinition
  UserNameType: EnumTypeDefinition
  VerificationAddAddressBody: MessageTypeDefinition
  VerificationRemoveBody: MessageTypeDefinition
}

