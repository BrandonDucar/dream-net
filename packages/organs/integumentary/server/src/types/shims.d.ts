declare module "../services/*" {
  const service: any;
  export = service;
}

declare module "../middleware/*" {
  const middleware: any;
  export = middleware;
}

declare module "../integrations/*" {
  const integration: any;
  export = integration;
}

declare module "../automation/*" {
  const automation: any;
  export = automation;
}

declare module "../agents/*" {
  const agentModule: any;
  export = agentModule;
}

declare module "../utils/*" {
  const utilModule: any;
  export = utilModule;
}

declare module "../automation/post-launch" {
  const automation: any;
  export = automation;
}

declare module "googleapis" {
  const googleApis: any;
  export = googleApis;
}

declare module "node-cron" {
  const nodeCron: any;
  export = nodeCron;
}

