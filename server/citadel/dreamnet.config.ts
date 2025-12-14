/**
 * DreamNet Configuration
 * 
 * Core config for The Citadel (DreamNet strategic command center).
 * Used by Agent 1 (Snapshot Engine) as primary source of truth.
 */

export const dreamnetConfig = {
  meta: {
    name: "DreamNet",
    owner: "Brandon Ducar",
    version: "0.1.0",
    environment: process.env.NODE_ENV || "development",
    notes: [
      "Core config for The Citadel (DreamNet strategic command center).",
      "Used by Agent 1 (Snapshot Engine) as primary source of truth.",
    ],
  },

  // Core codebases / repos DreamNet is aware of
  codebases: {
    primary: {
      id: "dreamnet_main",
      repo: "BrandonDucar/dream-net",
      role: "core_hub",
      status: "active",
    },
    dreamnetV2: {
      id: "dreamnet_v2",
      repo: "BrandonDucar/DreamnetV2",
      role: "next_gen",
      status: "planning",
    },
    dreamnetLegacy: {
      id: "dreamnet_legacy",
      repo: "BrandonDucar/BrandonDucar-dream-net",
      role: "legacy",
      status: "archived",
    },
    tagTiny: {
      id: "tag_tiny",
      repo: "BrandonDucar/tag-tiny",
      role: "utility",
      status: "experimental",
    },
  },

  services: {
    // Frontend hub (what users eventually see as dreamnet.ink)
    client: {
      id: "dreamnet_client",
      type: "frontend",
      framework: "Next.js",
      status: "active",
      hostingTargets: ["Netlify", "Vercel"],
      urls: {
        prod: null, // fill when live
        staging: null,
        local: "http://localhost:3000",
      },
      repoRef: "dreamnet_main",
      notes: ["Main public interface and DreamScope UI will live here."],
    },

    // API / backend (if separate)
    api: {
      id: "dreamnet_api",
      type: "backend",
      framework: "Node/TypeScript",
      status: "planning",
      hostingTargets: ["Google Cloud", "Render", "Replit"],
      urls: {
        prod: null,
        staging: null,
        local: "http://localhost:4000",
      },
      repoRef: "dreamnet_main",
      notes: ["Planned REST/GraphQL/event endpoints for agents and apps."],
    },

    // Citadel core (agent orchestrator)
    citadel: {
      id: "citadel_core",
      type: "internal",
      role: "strategic_command_center",
      status: "active",
      hostingTargets: ["local_dev", "Google Cloud", "Replit"],
      urls: {
        prod: null,
        local: "internal://citadel",
      },
      notes: [
        "Runs Agents 1–8 each orchestrator cycle.",
        "Provides snapshots, dome reports, blueprints, and health intelligence.",
      ],
    },
  },

  agents: {
    // Strategic Citadel chain
    citadelChain: {
      enabled: true,
      agents: [
        {
          id: "vertex_core_1",
          name: "VERTEX CORE // Snapshot Engine",
          role: "snapshot",
          status: "active",
          priority: 1,
        },
        {
          id: "drone_dome_2",
          name: "DRONE DOME SKY SCANNER",
          role: "dome_analysis",
          status: "active",
          priority: 2,
        },
        {
          id: "event_monitor_3",
          name: "Event & Monitoring Blueprint Builder",
          role: "event_fabric",
          status: "active",
          priority: 3,
        },
        {
          id: "dreamkeeper_4",
          name: "DreamKeeper Health & Diagnostic Architect",
          role: "health_system",
          status: "active",
          priority: 4,
        },
        {
          id: "deploykeeper_5",
          name: "DeployKeeper Infra & Deploy Architect",
          role: "deployment_governance",
          status: "active",
          priority: 5,
        },
        {
          id: "data_spine_6",
          name: "Data Spine & Schema Architect",
          role: "data_model",
          status: "active",
          priority: 6,
        },
        {
          id: "socialops_7",
          name: "SocialOps / External-Edge Architect",
          role: "external_edges",
          status: "active",
          priority: 7,
        },
        {
          id: "master_planner_8",
          name: "Master Blueprint & Evolution Planner",
          role: "roadmap",
          status: "active",
          priority: 8,
        },
      ],
    },

    // Other conceptual agents you've already talked about
    supporting: [
      {
        id: "relaybot",
        name: "RelayBot",
        role: "message_dispatcher",
        status: "planned",
        notes: ["Routes formatted messages to Sutton, Tina, etc."],
      },
      {
        id: "monetizer_1",
        name: "Monetizer-1",
        role: "social_monetization",
        status: "planned",
        notes: [
          "Stealth social media monetization stack for Sutton.",
          "Handles posting, trend hijack, stealth funnels.",
        ],
      },
      {
        id: "lawyer_agent",
        name: "LawyerAgent",
        role: "legal_docs",
        status: "planned",
        notes: [
          "Generates contracts, trademarks, IP filings from templates.",
        ],
      },
    ],
  },

  platforms: {
    infra: {
      googleCloud: {
        id: "gcp",
        active: true,
        roles: ["compute", "Vertex AI", "credits"],
        notes: ["AntiGravity / Vertex-based agents live here."],
      },
      netlify: {
        id: "netlify",
        active: true,
        roles: ["frontend_hosting"],
        notes: ["Current deploy target that worked cleanly."],
      },
      vercel: {
        id: "vercel",
        active: true,
        roles: ["frontend_hosting"],
        notes: ["Used previously; had some deploy issues."],
      },
      replit: {
        id: "replit",
        active: true,
        roles: ["dev_env", "agents"],
        notes: ["DreamForge / DreamOPS / Monetizer-1, etc."],
      },
    },

    onchain: {
      base: {
        id: "base",
        active: true,
        role: "primary_l2",
        usage: [
          "token launches",
          "HyperSub subscriptions",
          "Zora mints",
          "Base posts",
        ],
      },
      zora: {
        id: "zora",
        active: true,
        role: "mints_collectibles",
      },
      hypersub: {
        id: "hypersub",
        active: true,
        role: "subscriptions",
      },
      // Add more chains/tokens as you formalize them
    },

    ai: {
      openai: {
        id: "openai",
        active: true,
        role: ["chat", "agents"],
      },
      vertexAI: {
        id: "vertex_ai",
        active: true,
        role: ["gemini_agents", "citadel_support"],
      },
      ohara: {
        id: "ohara_ai",
        active: true,
        role: ["mini_apps"],
      },
    },

    content: {
      canva: {
        id: "canva",
        active: true,
        role: ["design", "quote_panels", "memes"],
      },
      whatnot: {
        id: "whatnot",
        active: true,
        role: ["live_sales", "metals_resale", "collectibles"],
      },
      gumroad: {
        id: "gumroad",
        active: true,
        role: ["digital_products", "GhostMint OPS"],
      },
    },
  },

  social: {
    twitter: {
      handle: "Brandon Ducar",
      role: "crypto_monetization",
    },
    tiktok: {
      handle: "BScrypto72",
      role: "crypto_monetization",
    },
    instagram: {
      handle: "bd420chef",
      role: "quotes_pickleball_lifestyle",
    },
    facebookPersonal: {
      handle: "Brandon Ducar",
      role: "personal_pickleball_inspo",
    },
    facebookBusiness: {
      handle: "Ducar Consulting",
      role: "business_monetization",
    },
  },

  tokens: {
    // Conceptual slots – fill addresses when live
    sheep: {
      symbol: "SHEEP",
      chain: "Base",
      role: "native_dreamnet_token",
      address: null,
    },
    flby: {
      symbol: "FLBY",
      chain: "Solana",
      role: "Flutterbye_token",
      address: null,
    },
    dream: {
      symbol: "DREAM",
      chain: "Base",
      role: "ecosystem_or_dream_token",
      address: null,
    },
  },

  // Where DreamNet actually touches people/products/content
  surfaces: {
    miniApps: {
      ohara: {
        status: "active",
        notes: [
          "Set of experimental mini apps (sniper tools, dev tools, games).",
        ],
      },
    },
    brands: {
      flutterbye: {
        role: "Dream Core node",
        status: "external_but_connected",
      },
      ghostmintOps: {
        role: "AI side-hustle content brand",
        status: "active",
      },
      cleanBinPro: {
        role: "offline_business",
        status: "on_hold",
      },
    },
  },

  // High-level toggles The Citadel can use to decide what to care about now
  focus: {
    enableDreamScope: true,
    enableOnchain: true,
    enableSocialOps: true,
    enableWhatnotStack: true,
    enableFirebasePersistence: false, // will flip to true when you wire Firebase
  },
};

