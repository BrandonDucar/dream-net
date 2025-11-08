export enum StarbridgeTopic {
  Governor = "Governor",
  Deploy = "Deploy",
  System = "System",
  Economy = "Economy",
  Vault = "Vault",
}

export enum StarbridgeSource {
  Runtime = "Runtime",
  ComputeGovernor = "ComputeGovernor",
  DeployKeeper = "DeployKeeper",
  DreamKeeper = "DreamKeeper",
  RelayBot = "RelayBot",
  External = "External",
}

export type StarbridgePayload = Record<string, unknown> | undefined;

export interface StarbridgeEvent<T = StarbridgePayload> {
  id: string;
  topic: StarbridgeTopic;
  source: StarbridgeSource;
  type: string;
  ts: Date;
  payload?: T;
  replayed?: boolean;
}

export interface PublishOptions {
  skipPersistence?: boolean;
}
