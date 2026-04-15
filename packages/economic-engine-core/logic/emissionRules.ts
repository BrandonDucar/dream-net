import type {
  EconTokenConfig,
  EconTokenSymbol,
  EmissionRule,
} from "../types";
import { EconStore } from "../store/econStore";

let initialized = false;

/**
 * Seed default token configs and emission rules if they don't exist yet.
 */
export function ensureDefaultEconomicConfigSeeded() {
  if (initialized) return;

  // Token configs
  const tokenConfigs: EconTokenConfig[] = [
    {
      symbol: "SHEEP",
      label: "$SHEEP",
      decimals: 18,
      description: "Primary DreamNet ecosystem token (simulated here).",
    },
    {
      symbol: "DREAM",
      label: "$DREAM",
      decimals: 18,
      description: "Governance / meta token (simulated here).",
    },
    {
      symbol: "FLBY",
      label: "$FLBY",
      decimals: 9,
      description: "Flutterbye ecosystem token (simulated here).",
    },
    {
      symbol: "ZEN_POINTS",
      label: "Zen Points",
      decimals: 0,
      description: "Off-chain points for Zen Garden activities.",
    },
    {
      symbol: "VAULT_CREDITS",
      label: "Vault Credits",
      decimals: 0,
      description: "Credits for DreamVault blueprints/templates.",
    },
    {
      symbol: "PLAY_TOKENS",
      label: "Play Tokens",
      decimals: 0,
      description: "Internal tokens for DreamBet demo / games.",
    },
  ];

  tokenConfigs.forEach((cfg) => EconStore.upsertTokenConfig(cfg));

  // Emission rules
  const rules: EmissionRule[] = [
    // Zen Garden → ZEN_POINTS + SHEEP hints
    {
      id: "rule:zen-activity-points",
      source: "zen-garden",
      kind: "activity",
      token: "ZEN_POINTS",
      multiplier: 1,  // baseValue directly mapped to points
      label: "Zen activity → Zen points",
    },
    {
      id: "rule:zen-highscore-sheep",
      source: "zen-garden",
      kind: "bonus",
      token: "SHEEP",
      multiplier: 0.01,  // small SHEEP hint per baseValue
      label: "High-quality zen bonuses → SHEEP",
    },

    // DreamBet → PLAY_TOKENS
    {
      id: "rule:dreambet-participation",
      source: "dreambet",
      kind: "participation",
      token: "PLAY_TOKENS",
      multiplier: 5,
      label: "DreamBet participation → Play Tokens",
    },
    {
      id: "rule:dreambet-win",
      source: "dreambet",
      kind: "win",
      token: "SHEEP",
      multiplier: 0.02,
      label: "Winning DreamBet rounds → SHEEP",
    },

    // SocialHub → ZEN_POINTS, VAULT_CREDITS
    {
      id: "rule:social-contribution",
      source: "socialhub",
      kind: "contribution",
      token: "ZEN_POINTS",
      multiplier: 0.5,
      label: "Posting & contributing → Zen Points",
    },

    // DreamVault → VAULT_CREDITS
    {
      id: "rule:vault-contribution",
      source: "dreamvault",
      kind: "contribution",
      token: "VAULT_CREDITS",
      multiplier: 1,
      label: "Adding/upgrading blueprints → Vault Credits",
    },

    // DreamTank milestones → DREAM
    {
      id: "rule:dreamtank-milestone",
      source: "dreamtank",
      kind: "milestone",
      token: "DREAM",
      multiplier: 0.05,
      label: "Hitting incubator milestones → DREAM",
    },

    // Init & Ritual → ZEN_POINTS
    {
      id: "rule:init-completion",
      source: "init-ritual",
      kind: "milestone",
      token: "ZEN_POINTS",
      multiplier: 10,
      label: "Completing onboarding → Zen Points",
    },
  ];

  rules.forEach((r) => EconStore.addEmissionRule(r));

  initialized = true;
}

