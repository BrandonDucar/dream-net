import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  IdRegisterEventBody: MessageTypeDefinition
  IdRegisterEventType: EnumTypeDefinition
  OnChainEvent: MessageTypeDefinition
  OnChainEventType: EnumTypeDefinition
  SignerEventBody: MessageTypeDefinition
  SignerEventType: EnumTypeDefinition
  SignerMigratedEventBody: MessageTypeDefinition
  StorageRentEventBody: MessageTypeDefinition
  TierPurchaseBody: MessageTypeDefinition
  TierType: EnumTypeDefinition
}

