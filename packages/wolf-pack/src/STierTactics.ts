/**
 * S-Tier Outreach Tactics
 * Specialized targeting for high-margin, recession-proof sectors.
 */

export const STIER_SECTORS = {
  PLASTIC_SURGERY: {
    name: "Plastic Surgery",
    value: 2000, // $2k/mo
    hooks: [
      "24/7 AI Patient Inquiry Handling",
      "Automated Consultation Scheduling",
      "Sovereign Data Security for Patient Privacy"
    ],
    searchTerms: ["cosmetic surgeon", "plastic surgery clinic", "aesthetic medicine"]
  },
  REALTY: {
    name: "Real Estate",
    value: 1500, // $1.5k/mo
    hooks: [
      "AI Lead Capture from Farcaster/Warpcast",
      "Virtual Tour Auto-Generation",
      "Smart Contract Property Escrow"
    ],
    searchTerms: ["realtor", "real estate broker", "luxury property management"]
  },
  LAW_FIRMS: {
    name: "Legal Services",
    value: 3000, // $3k/mo
    hooks: [
      "AI Case Research & Discovery",
      "Automated Document Drafting",
      "Sovereign Legal Intelligence Vault"
    ],
    searchTerms: ["personal injury lawyer", "corporate law firm", "legal discovery services"]
  },
  HOME_REMODELING: {
    name: "Bathroom & Kitchen Remodeling",
    value: 5000, // $5k margin (God-Tier)
    hooks: [
      "High-Intent Lead Filtration",
      "AI Design Visualization",
      "Automated Quote Generation"
    ],
    searchTerms: ["bathroom renovation", "kitchen remodeling contractor", "home improvement"]
  }
};

export type STierSector = keyof typeof STIER_SECTORS;
