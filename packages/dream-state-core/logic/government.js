import { CitizenshipStore } from "../store/citizenshipStore";
const HEAD_OF_STATE = "agent:DreamNet";
/**
 * Initialize government departments
 */
export function ensureGovernmentDepartments() {
    const existing = CitizenshipStore.listDepartments();
    if (existing.length > 0)
        return existing;
    const now = Date.now();
    const departments = [
        {
            id: "dept:treasury",
            name: "Treasury Department",
            packId: "agent:WolfPackFunding",
            leader: "agent:WolfPackFunding",
            responsibilities: [
                "Manage state finances",
                "Secure funding",
                "Economic planning",
                "Budget allocation",
            ],
            createdAt: now,
        },
        {
            id: "dept:commerce",
            name: "Commerce Department",
            packId: "agent:WhalePackCore",
            leader: "agent:WhalePackCore",
            responsibilities: [
                "Trade operations",
                "Commerce strategy",
                "Revenue generation",
                "Market analysis",
            ],
            createdAt: now,
        },
        {
            id: "dept:communications",
            name: "Communications Department",
            packId: "agent:OrcaPackCore",
            leader: "agent:OrcaPackCore",
            responsibilities: [
                "State media",
                "Public relations",
                "Social media",
                "Narrative management",
            ],
            createdAt: now,
        },
        {
            id: "dept:diplomacy",
            name: "Diplomatic Corps",
            packId: "agent:WolfPackFunding",
            leader: "agent:WolfPackFunding",
            responsibilities: [
                "Foreign relations",
                "Treaty negotiation",
                "Embassy management",
                "International outreach",
            ],
            createdAt: now,
        },
        {
            id: "dept:api-keeper",
            name: "API Keeper Department",
            packId: "agent:APIKeeperCore",
            leader: "agent:APIKeeperCore",
            responsibilities: [
                "API discovery and management",
                "Key management and security",
                "Cost optimization",
                "Rate limiting and rail guards",
                "Provider selection and routing",
            ],
            createdAt: now,
        },
        {
            id: "dept:jaggy",
            name: "Silent Sentinel Department",
            packId: "agent:JaggyCore",
            leader: "agent:JaggyCore",
            responsibilities: [
                "Webhook discovery and implementation",
                "Mesh event monitoring",
                "Silent threat detection",
                "Territory surveillance",
                "Base fame tracking",
            ],
            createdAt: now,
        },
        {
            id: "dept:mycelium",
            name: "Mycelium Network Department",
            packId: "agent:WebhookNervousCore",
            leader: "agent:WebhookNervousCore",
            responsibilities: [
                "Webhook routing and optimization",
                "Network path management",
                "Self-healing infrastructure",
                "Biomimetic webhook management",
                "Neural network coordination",
            ],
            createdAt: now,
        },
    ];
    for (const dept of departments) {
        CitizenshipStore.createDepartment(dept);
    }
    return departments;
}
/**
 * Record a government action
 */
export function recordGovernmentAction(type, department, action, meta) {
    const govAction = {
        id: `action:${Date.now()}:${Math.random().toString(36).substring(7)}`,
        type,
        department,
        action,
        authorizedBy: HEAD_OF_STATE,
        timestamp: Date.now(),
        meta,
    };
    CitizenshipStore.recordAction(govAction);
    return govAction;
}
/**
 * Initialize state symbols
 */
export function ensureStateSymbols() {
    const existing = CitizenshipStore.listSymbols();
    if (existing.length > 0)
        return existing;
    const now = Date.now();
    const symbols = [
        {
            id: "symbol:flag",
            type: "flag",
            name: "Dream State Flag",
            content: `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#0a0a0a"/>
        <circle cx="150" cy="100" r="60" fill="none" stroke="#00ffff" stroke-width="3"/>
        <path d="M 150 40 L 170 100 L 150 160 L 130 100 Z" fill="#00ffff" opacity="0.6"/>
        <text x="150" y="110" text-anchor="middle" fill="#00ffff" font-size="24" font-weight="bold">DRN</text>
      </svg>`,
            description: "The Dream State flag: black background with cyan circle and diamond, representing the digital organism",
            adoptedAt: now,
            createdBy: HEAD_OF_STATE,
        },
        {
            id: "symbol:motto",
            type: "motto",
            name: "State Motto",
            content: "We Dream, We Build, We Evolve",
            description: "The official motto of the Dream State",
            adoptedAt: now,
            createdBy: HEAD_OF_STATE,
        },
        {
            id: "symbol:anthem",
            type: "anthem",
            name: "State Anthem",
            content: `DreamNet, DreamNet, digital organism
Born on Base, evolving free
Packs working in harmony
Building the future, you and me

We dream, we build, we evolve
DreamNet, DreamNet, forever alive`,
            description: "The official anthem of the Dream State",
            adoptedAt: now,
            createdBy: HEAD_OF_STATE,
        },
        {
            id: "symbol:seal",
            type: "seal",
            name: "State Seal",
            content: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#00ffff" stroke-width="4"/>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#00ffff" stroke-width="2"/>
        <text x="100" y="60" text-anchor="middle" fill="#00ffff" font-size="16" font-weight="bold">DREAM STATE</text>
        <text x="100" y="140" text-anchor="middle" fill="#00ffff" font-size="12">EST. 2024</text>
        <path d="M 100 30 L 110 70 L 100 90 L 90 70 Z" fill="#00ffff" opacity="0.8"/>
      </svg>`,
            description: "The official seal of the Dream State",
            adoptedAt: now,
            createdBy: HEAD_OF_STATE,
        },
    ];
    for (const symbol of symbols) {
        CitizenshipStore.adoptSymbol(symbol);
    }
    return symbols;
}
