import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { 
  ChartLine, 
  Bed, 
  Circle, 
  Gem, 
  Wallet, 
  Users,
  CloudMoon, 
  Settings,
  LogOut,
  Archive,
  Bot,
  Coins,
  Zap,
  FlaskConical,
  Filter,
  Vault,
  Shuffle,
  Target,
  Terminal,
  Sprout,
  Network,
  Trophy,
  Vote,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Store,
  Cloud,
  Brain,
  Stethoscope,
  Shield,
  Dna,
  Eye
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: ChartLine,
  },
  {
    name: "Dreams",
    href: "/dreams",
    icon: Bed,
  },
  {
    name: "Cocoons",
    href: "/cocoons",
    icon: Circle,
  },
  {
    name: "Dream Cores",
    href: "/cores",
    icon: Gem,
  },
  {
    name: "Wallets",
    href: "/wallets",
    icon: Wallet,
  },
  {
    name: "Contributors",
    href: "/contributors",
    icon: Users,
  },
  {
    name: "🏆 Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    name: "🗳️ DAO Management",
    href: "/dao-management",
    icon: Vote,
  },
  {
    name: "💫 Whisper Messaging",
    href: "/whisper-messaging",
    icon: MessageCircle,
  },
  {
    name: "⚡ User Progression",
    href: "/user-progression",
    icon: TrendingUp,
  },
  {
    name: "💰 Revenue Sharing",
    href: "/revenue-sharing",
    icon: DollarSign,
  },
  {
    name: "🏪 Vault Marketplace",
    href: "/vault-marketplace",
    icon: Store,
  },
  {
    name: "🧬 Evolution Vault",
    href: "/evolution-vault",
    icon: Zap,
  },
  {
    name: "🧠 DREAMKEEPER Core",
    href: "/dreamkeeper-core",
    icon: Brain,
  },
  {
    name: "🩺 AI Surgeon",
    href: "/ai-surgeon",
    icon: Stethoscope,
  },
  {
    name: "🛡️ Defense Network",
    href: "/defense-network",
    icon: Shield,
  },
  {
    name: "🧬 Evolution Engine",
    href: "/evolution-engine",
    icon: Dna,
  },
  {
    name: "🌌 DreamScope",
    href: "/dreamscope",
    icon: Eye,
  },
  {
    name: "☁️ Dream Cloud",
    href: "/dream-cloud",
    icon: Cloud,
  },
  {
    name: "Wallet Admin",
    href: "/wallet-admin",
    icon: Settings,
  },
  {
    name: "Dream Feed",
    href: "/feed",
    icon: CloudMoon,
  },
  {
    name: "Dream Vault (Legacy)",
    href: "/vault",
    icon: Archive,
  },
  {
    name: "Wallet Integration",
    href: "/wallet-integration",
    icon: Wallet,
  },
  {
    name: "ECHO Agent",
    href: "/echo-agent",
    icon: Settings,
  },
  {
    name: "Agent Status",
    href: "/agent-status",
    icon: Bot,
  },
  {
    name: "Wallet Agents",
    href: "/wallet-agents", 
    icon: Settings,
  },
  {
    name: "Agent Glow Demo",
    href: "/agent-glow",
    icon: Bot,
  },
  {
    name: "Token Minting",
    href: "/token-minting",
    icon: Coins,
  },
  {
    name: "Dream Minting",
    href: "/dream-minting",
    icon: Zap,
  },
  {
    name: "Fusion Chamber",
    href: "/fusion-chamber",
    icon: FlaskConical,
  },
  {
    name: "Agent Filtering",
    href: "/agent-filtering",
    icon: Filter,
  },
  {
    name: "Dream Vault",
    href: "/dream-vault",
    icon: Vault,
  },
  {
    name: "Dream Remixer",
    href: "/dream-remixer",
    icon: Shuffle,
  },
  {
    name: "Mission Center",
    href: "/mission-center",
    icon: Target,
  },
  {
    name: "Agent Customizer",
    href: "/agent-customizer",
    icon: Bot,
  },
  {
    name: "Dev Console",
    href: "/dev-console",
    icon: Terminal,
  },
  {
    name: "🌾 Harvest",
    href: "/harvest-dashboard",
    icon: Sprout,
  },
  {
    name: "🚨 Swarm Mode",
    href: "/swarm-dashboard",
    icon: Bot,
  },
  {
    name: "🕸️ Node Web",
    href: "/node-web-demo",
    icon: Network,
  },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { walletAddress, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location === "/" || location === "/dashboard";
    }
    return location === href;
  };

  return (
    <aside className="w-60 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-electric-cyan to-soft-gold rounded-lg flex items-center justify-center">
            <CloudMoon className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Dream Network</h1>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer",
                  active
                    ? "bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20"
                    : "text-muted-foreground hover:bg-zinc-800/50 hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-800/30">
          <div className="w-8 h-8 bg-gradient-to-br from-soft-gold to-electric-cyan rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-black">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate font-mono">
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}
            </p>
          </div>
          <button 
            onClick={logout}
            className="text-muted-foreground hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
