interface IntegrationFlag {
  enabled: boolean;
  reason?: string;
  updatedAt: string;
}

const flags = new Map<string, IntegrationFlag>();
let emergencyMode: { active: boolean; reason?: string; activatedAt?: string } = {
  active: false,
};

function getFlag(name: string): IntegrationFlag {
  if (!flags.has(name)) {
    flags.set(name, {
      enabled: true,
      updatedAt: new Date().toISOString(),
    });
  }
  return flags.get(name)!;
}

export const IntegrationFlagsService = {
  async requireEnabled(name: string) {
    const flag = getFlag(name);
    if (!flag.enabled || emergencyMode.active) {
      const reason = flag.reason || emergencyMode.reason || "disabled";
      throw new Error(`Integration "${name}" disabled: ${reason}`);
    }
  },

  async setIntegrationEnabled(name: string, enabled: boolean, reason?: string) {
    const flag = getFlag(name);
    flag.enabled = enabled;
    flag.reason = reason;
    flag.updatedAt = new Date().toISOString();
    flags.set(name, flag);
  },

  async enableEmergencyMode(reason?: string) {
    emergencyMode = {
      active: true,
      reason,
      activatedAt: new Date().toISOString(),
    };
  },

  async disableEmergencyMode() {
    emergencyMode = { active: false };
  },

  async getAllFlags() {
    return Array.from(flags.entries()).map(([name, flag]) => ({
      name,
      ...flag,
    }));
  },

  async getIntegrationConfig(name: string) {
    const flag = getFlag(name);
    return {
      name,
      enabled: flag.enabled && !emergencyMode.active,
      reason: emergencyMode.active ? emergencyMode.reason : flag.reason,
      emergencyMode: emergencyMode.active,
    };
  },

  async getEmergencyStatus() {
    return emergencyMode;
  },

  async validateFlags() {
    return {
      ok: true,
      issues: [],
      emergencyMode,
      totalFlags: flags.size,
    };
  },
};

