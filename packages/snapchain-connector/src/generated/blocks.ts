import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Block: MessageTypeDefinition
  BlockEvent: MessageTypeDefinition
  BlockEventData: MessageTypeDefinition
  BlockEventType: EnumTypeDefinition
  BlockHeader: MessageTypeDefinition
  CastAddBody: MessageTypeDefinition
  CastId: MessageTypeDefinition
  CastRemoveBody: MessageTypeDefinition
  CastType: EnumTypeDefinition
  CommitSignature: MessageTypeDefinition
  Commits: MessageTypeDefinition
  ConsensusMessage: MessageTypeDefinition
  DecidedValue: MessageTypeDefinition
  Embed: MessageTypeDefinition
  FarcasterNetwork: EnumTypeDefinition
  FnameTransfer: MessageTypeDefinition
  FrameActionBody: MessageTypeDefinition
  FullProposal: MessageTypeDefinition
  HashScheme: EnumTypeDefinition
  HeartbeatEventBody: MessageTypeDefinition
  Height: MessageTypeDefinition
  IdRegisterEventBody: MessageTypeDefinition
  IdRegisterEventType: EnumTypeDefinition
  KeyAddBody: MessageTypeDefinition
  KeyRemoveBody: MessageTypeDefinition
  LendStorageBody: MessageTypeDefinition
  LinkBody: MessageTypeDefinition
  LinkCompactStateBody: MessageTypeDefinition
  MempoolMessage: MessageTypeDefinition
  MergeMessageEventBody: MessageTypeDefinition
  Message: MessageTypeDefinition
  MessageData: MessageTypeDefinition
  MessageType: EnumTypeDefinition
  OnChainEvent: MessageTypeDefinition
  OnChainEventType: EnumTypeDefinition
  Proposal: MessageTypeDefinition
  Protocol: EnumTypeDefinition
  ReactionBody: MessageTypeDefinition
  ReactionType: EnumTypeDefinition
  ReadNodeMessage: MessageTypeDefinition
  ShardChunk: MessageTypeDefinition
  ShardChunkWitness: MessageTypeDefinition
  ShardHash: MessageTypeDefinition
  ShardHeader: MessageTypeDefinition
  ShardWitness: MessageTypeDefinition
  SignatureScheme: EnumTypeDefinition
  SignerEventBody: MessageTypeDefinition
  SignerEventType: EnumTypeDefinition
  SignerMigratedEventBody: MessageTypeDefinition
  StatusMessage: MessageTypeDefinition
  StorageRentEventBody: MessageTypeDefinition
  StorageUnitType: EnumTypeDefinition
  SyncRequest: MessageTypeDefinition
  SyncResponse: MessageTypeDefinition
  SyncValueRequest: MessageTypeDefinition
  SyncValueResponse: MessageTypeDefinition
  SyncVoteSetRequest: MessageTypeDefinition
  SyncVoteSetResponse: MessageTypeDefinition
  TierPurchaseBody: MessageTypeDefinition
  TierType: EnumTypeDefinition
  Transaction: MessageTypeDefinition
  UserDataBody: MessageTypeDefinition
  UserDataType: EnumTypeDefinition
  UserNameProof: MessageTypeDefinition
  UserNameType: EnumTypeDefinition
  Validator: MessageTypeDefinition
  ValidatorMessage: MessageTypeDefinition
  ValidatorSet: MessageTypeDefinition
  VerificationAddAddressBody: MessageTypeDefinition
  VerificationRemoveBody: MessageTypeDefinition
  Vote: MessageTypeDefinition
  VoteType: EnumTypeDefinition
}

