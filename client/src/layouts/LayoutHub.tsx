import { ReactNode } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  Grid3x3,
  Cloud,
  LayoutGrid,
  Wallet,
  Bot,
  Settings,
  LogOut,
  Activity,
  Zap,
  Rocket,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface LayoutHubProps {
  children: ReactNode;
}

const hubNavigation = [
  {
    name: "Overview",
    href: "/hub",
    icon: LayoutDashboard,
    description: "High-level DreamNet view",
  },
  {
    name: "Grid",
    href: "/hub/grid",
    icon: Grid3x3,
    description: "Dream/Node grid view",
  },
  {
    name: "Clouds",
    href: "/hub/clouds",
    icon: Cloud,
    description: "DreamClouds overview",
  },
  {
    name: "Apps",
    href: "/hub/apps",
    icon: LayoutGrid,
    description: "Mini-app catalog",
  },
  {
    name: "Wallets",
    href: "/hub/wallets",
    icon: Wallet,
    description: "Wallet & CoinSensei",
  },
  {
    name: "Agents",
    href: "/hub/agents",
    icon: Bot,
    description: "Agent list & status",
  },
  {
    name: "Ops",
    href: "/hub/ops",
    icon: Settings,
    description: "Operator console",
  },
  {
    name: "Deployment",
    href: "/hub/deployment",
    icon: Rocket,
    description: "Deploy to any platform",
  },
  {
    name: "Card Forge",
    href: "/hub/card-forge",
    icon: CreditCard,
    description: "AI-powered card creation",
  },
];

export default function LayoutHub({ children }: LayoutHubProps) {
  const [location] = useLocation();
  const { walletAddress, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/hub") {
      return location === "/hub" || location === "/hub/";
    }
    return location.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0">
        {/* Logo/Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-electric-cyan to-electric-violet rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">DreamNet</h1>
              <p className="text-xs text-muted-foreground">Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-1">
            {hubNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer group",
                    active
                      ? "bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20"
                      : "text-muted-foreground hover:bg-zinc-800/50 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground/70 truncate">
                      {item.description}
                    </div>
                  </div>
                </a>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-800/30">
            <div className="w-8 h-8 bg-gradient-to-br from-electric-violet to-electric-cyan rounded-full flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-black">DN</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Operator
              </p>
              <p className="text-xs text-muted-foreground truncate font-mono">
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : "Not connected"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="shrink-0 h-8 w-8"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold">
              {hubNavigation.find((item) => isActive(item.href))?.name ||
                "DreamNet Hub"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {hubNavigation.find((item) => isActive(item.href))
                ?.description || "DreamNet operator console"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20">
              <Activity className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400 font-medium">
                System Online
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>

      {/* Right Rail (Collapsible) */}
      <aside className="w-80 bg-card border-l border-border flex flex-col shrink-0 hidden lg:flex">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Live Events</h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Live events and system logs will appear here.</p>
            </div>
            {/* Placeholder for live events */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground/70">
                Agent activity feed coming soon...
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}

