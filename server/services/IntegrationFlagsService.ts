interface IntegrationFlag {
  enabled: boolean;
  reason?: string;
  updatedAt: string;
  brownout?: boolean;
  brownoutFallback?: string;
  owner?: string;
  description?: string;
}

interface FeatureFlagConfig {
  name: string;
  default: boolean;
  description?: string;
  owner?: string;
  brownout?: boolean;
  envVar?: string;
  brownoutFallback?: string;
}

const flags = new Map<string, IntegrationFlag>();
let emergencyMode: { active: boolean; reason?: string; activatedAt?: string } = {
  active: false,
};
let brownoutMode: { enabled: boolean; reason?: string; activatedAt?: string | null } = {
  enabled: false,
  activatedAt: null,
};

/**
 * Load feature flags from YAML file
 */
async function loadFeatureFlagsFromYAML(): Promise<void> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Try to load js-yaml, but make it optional
    let yaml: any;
    try {
      yaml = await import('js-yaml');
    } catch {
      console.warn(`⚠️  [IntegrationFlags] js-yaml not installed, skipping YAML load`);
      return;
    }
    
    const yamlPath = path.join(process.cwd(), 'server', 'config', 'feature-flags.yaml');
    const content = await fs.readFile(yamlPath, 'utf-8');
    const config = yaml.load(content) as { flags?: FeatureFlagConfig[]; brownout?: any };
    
    if (config.flags) {
      for (const flagConfig of config.flags) {
        // Check environment variable first, then use default
        let enabled = flagConfig.default;
        if (flagConfig.envVar && process.env[flagConfig.envVar]) {
          enabled = process.env[flagConfig.envVar] === 'true';
        }
        
        flags.set(flagConfig.name, {
          enabled,
          updatedAt: new Date().toISOString(),
          brownout: flagConfig.brownout || false,
          brownoutFallback: flagConfig.brownoutFallback,
          owner: flagConfig.owner,
          description: flagConfig.description,
        });
      }
    }
    
    if (config.brownout) {
      brownoutMode = {
        enabled: config.brownout.enabled || false,
        reason: config.brownout.reason,
        activatedAt: config.brownout.activatedAt,
      };
    }
    
    console.log(`✅ [IntegrationFlags] Loaded ${flags.size} feature flags from YAML`);
  } catch (error: any) {
    // YAML file not found or invalid - use defaults
    console.warn(`⚠️  [IntegrationFlags] Could not load feature flags YAML: ${error.message}`);
  }
}

// Load flags on module init
loadFeatureFlagsFromYAML().catch(() => {
  // Ignore errors, will use defaults
});

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
  /**
   * Require a feature to be enabled (throws if disabled)
   */
  async requireEnabled(name: string) {
    const flag = getFlag(name);
    
    // Check emergency mode first
    if (emergencyMode.active) {
      const reason = emergencyMode.reason || "emergency mode active";
      throw new Error(`Integration "${name}" disabled: ${reason}`);
    }
    
    // Check if flag is disabled
    if (!flag.enabled) {
      const reason = flag.reason || "disabled";
      
      // If brownout mode is enabled and flag supports brownout, allow degraded operation
      if (brownoutMode.enabled && flag.brownout) {
        console.warn(`⚠️  [IntegrationFlags] ${name} in brownout mode: ${flag.brownoutFallback || 'degraded'}`);
        return; // Allow degraded operation
      }
      
      throw new Error(`Integration "${name}" disabled: ${reason}`);
    }
  },
  
  /**
   * Check if a feature is enabled (returns boolean, doesn't throw)
   */
  async isEnabled(name: string): Promise<boolean> {
    const flag = getFlag(name);
    
    if (emergencyMode.active) {
      return false;
    }
    
    if (!flag.enabled) {
      // If brownout mode and flag supports brownout, return true (degraded)
      if (brownoutMode.enabled && flag.brownout) {
        return true;
      }
      return false;
    }
    
    return true;
  },
  
  /**
   * Check if a feature is in brownout mode (degraded but enabled)
   */
  async isBrownout(name: string): Promise<boolean> {
    const flag = getFlag(name);
    return brownoutMode.enabled && flag.brownout === true && !flag.enabled;
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
    console.warn(`🚨 [IntegrationFlags] Emergency mode ENABLED: ${reason || 'no reason provided'}`);
  },

  async disableEmergencyMode() {
    emergencyMode = { active: false };
    console.log(`✅ [IntegrationFlags] Emergency mode DISABLED`);
  },
  
  /**
   * Enable brownout mode (degrade expensive features)
   */
  async enableBrownoutMode(reason?: string) {
    brownoutMode = {
      enabled: true,
      reason,
      activatedAt: new Date().toISOString(),
    };
    console.warn(`⚠️  [IntegrationFlags] Brownout mode ENABLED: ${reason || 'degrading expensive features'}`);
  },
  
  /**
   * Disable brownout mode
   */
  async disableBrownoutMode() {
    brownoutMode = {
      enabled: false,
      activatedAt: null,
    };
    console.log(`✅ [IntegrationFlags] Brownout mode DISABLED`);
  },
  
  /**
   * Get brownout status
   */
  async getBrownoutStatus() {
    return brownoutMode;
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

