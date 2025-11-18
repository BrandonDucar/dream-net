declare module "@dreamnet/agents/registry" {
  export const agents: Array<{
    id: string;
    name: string;
    role: string;
    isOnline?: boolean;
    lastSeen?: string;
  }>;
}

