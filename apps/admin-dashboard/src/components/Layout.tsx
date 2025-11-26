import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Brain,
  Heart,
  Users,
  Coins,
  FileText,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { name: "Consciousness", href: "/admin/consciousness", icon: Brain },
  { name: "Organs & Systems", href: "/admin/organs", icon: Heart },
  { name: "Agents & Workforces", href: "/admin/agents", icon: Users },
  { name: "Economy & Tokens", href: "/admin/economy", icon: Coins },
  { name: "Events & Logs", href: "/admin/events", icon: FileText },
  { name: "Controls & Governance", href: "/admin/controls", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">DreamNet Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Control Core Interface
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {process.env.NODE_ENV === "development" ? (
                <span className="rounded bg-yellow-100 px-2 py-1 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Development
                </span>
              ) : (
                <span className="rounded bg-green-100 px-2 py-1 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Production
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-border bg-card">
          <nav className="p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

