// Using anchor tags for navigation (wouter not available in this context)

const miniApps = [
  {
    name: "DREAM Rewards Hub",
    description: "Claim daily rewards, track streaks, compete on leaderboards, and earn DREAM tokens",
    status: "Live",
    link: "/miniapps/rewards",
    icon: "💎",
    tags: ["Rewards", "Gamification", "Tokens"],
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    name: "Creator Subscriptions",
    description: "Launch on-chain membership tiers with ERC1155 badges and automated renewals",
    status: "Live",
    link: "/miniapps/subscriptions",
    icon: "🎨",
    tags: ["Creator Economy", "Subscriptions", "NFTs"],
    gradient: "from-purple-600 to-pink-600",
  },
  {
    name: "Dream Social Feed",
    description: "Browse, share, and remix dreams. Discover trending content and build your creative network",
    status: "Live",
    link: "/miniapps/social",
    icon: "🌙",
    tags: ["Social", "Content", "Community"],
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    name: "Dream Contributions",
    description: "Support dreams as they evolve. Sponsor fully, partially, tip any amount, or offer your skills and services",
    status: "Live",
    link: "/miniapps/contributions",
    icon: "💫",
    tags: ["Contributions", "Sponsorship", "Community"],
    gradient: "from-pink-600 to-purple-600",
  },
  {
    name: "Wallet Analytics",
    description: "Query wallet holdings, view token balances, and access gating logic across Base",
    status: "Coming Soon",
    link: "/miniapps/analytics",
    icon: "📊",
    tags: ["Analytics", "Wallet", "Tools"],
    gradient: "from-emerald-600 to-teal-600",
  },
];

export default function MiniAppsDirectory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Mini Apps
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Lightweight apps that run in Base. Each one breaks the mold, each one serves a purpose.
          </p>
        </div>

        {/* Mini Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {miniApps.map((app) => (
            <a key={app.link} href={app.link}>
              <div className="group bg-gray-900/50 rounded-2xl border border-white/10 p-8 hover:border-cyan-500/50 transition-all cursor-pointer h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl">{app.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{app.name}</h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "Live"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">{app.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {app.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`mt-4 h-1 bg-gradient-to-r ${app.gradient} rounded-full group-hover:h-1.5 transition-all`} />
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl border border-cyan-500/30 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Build Your Own Mini App</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Want to create a mini app on Base? We've got the infrastructure, you bring the creativity.
          </p>
          <a
            href="#contact"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition"
          >
            Get in Touch →
          </a>
        </div>
      </div>
    </div>
  );
}

