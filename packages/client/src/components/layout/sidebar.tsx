import { SovereignLogo } from '../ui/SovereignLogo.js';
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
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

// Navigation items for the sidebar
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: ChartLine },
  { name: "God View", href: "/god-view", icon: Eye },
  { name: "OS Status", href: "/os", icon: Network },
  { name: "System Funding", href: "/system-funding", icon: DollarSign },
  { name: "System Runtime", href: "/system-os-status", icon: Activity },
  { name: "Dreams", href: "/dreams", icon: Bed },
  { name: "Dream Gallery", href: "/dream-gallery", icon: Gem },
  { name: "Community", href: "/community", icon: Users },
  { name: "Vault", href: "/vault", icon: Vault },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Settings", href: "/settings", icon: Settings },
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
      <div className="p-6 border-b border-border flex justify-center">
        <SovereignLogo size={40} />
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
