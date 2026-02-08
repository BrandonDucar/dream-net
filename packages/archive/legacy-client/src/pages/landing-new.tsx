import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap, Grid3x3, Cloud, Bot, ArrowRight, Shield, Tv, Coins,
  Users, FlaskConical, Plane, Code, Building2, Star,
  Network, Rocket, Wallet, Activity, LayoutGrid, Sparkles, Palette
} from "lucide-react";

interface Vertical {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  domain: string;
  status: "live" | "coming-soon" | "beta";
  route?: string;
}

export default function LandingNew() {
  const coreVerticals: Vertical[] = [
    {
      id: "military",
      name: "Military & Defense",
      description: "Security, threat intelligence, and defense systems",
      icon: Shield,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      domain: "military.dream",
      status: "live",
      route: "/defense-network"
    },
    {
      id: "ott",
      name: "OTT Streaming",
      description: "Dream-driven content streaming platform",
      icon: Tv,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      domain: "stream.dream",
      status: "coming-soon"
    },
    {
      id: "metals",
      name: "Precious Metals",
      description: "Dream-backed precious metals trading",
      icon: Coins,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      domain: "metals.dream",
      status: "coming-soon"
    },
    {
      id: "crypto-social",
      name: "Crypto Social",
      description: "Social ecosystem for Web3 communities",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      domain: "social.dream",
      status: "live",
      route: "/community"
    },
    {
      id: "science",
      name: "Science & Research",
      description: "Dream-inspired research and discovery",
      icon: FlaskConical,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      domain: "science.dream",
      status: "coming-soon"
    },
    {
      id: "travel",
      name: "Travel",
      description: "Dream destination matching and experiences",
      icon: Plane,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      domain: "travel.dream",
      status: "coming-soon"
    },
    {
      id: "agent-foundry",
      name: "Agent Foundry",
      description: "Logic Hybridization & Genetic Splicing. Forge Phase 2 agents with inherited wisdom.",
      icon: FlaskConical,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      domain: "foundry.dream",
      status: "live",
      route: "/foundry"
    },
    {
      id: "avatar-forge",
      name: "Avatar Forge",
      description: "Visual Identity Substrate. Remix your sovereign presence and incubate Moltings.",
      icon: Palette,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      domain: "forge.dream",
      status: "live",
      route: "/avatar"
    },
    {
      id: "dreamnet-systems",
      name: "DreamNet Systems",
      description: "Infrastructure, documentation, and core systems",
      icon: Network,
      color: "text-electric-cyan",
      bgColor: "bg-electric-cyan/10",
      domain: "systems.dream",
      status: "live",
      route: "/system/os-status"
    },
    {
      id: "dreamstate-gov",
      name: "DreamState Government",
      description: "Digital citizenship and governance",
      icon: Building2,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
      domain: "gov.dream",
      status: "beta",
      route: "/dao-management"
    },
    {
      id: "pods-packs",
      name: "Pods & Packs",
      description: "Wolf packs, whale packs, and community pods",
      icon: Users,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      domain: "pods.dream",
      status: "live",
      route: "/swarm-dashboard"
    },
    {
      id: "dreamstar",
      name: "DreamStar",
      description: "Star-powered dream experiences",
      icon: Star,
      color: "text-yellow-300",
      bgColor: "bg-yellow-300/10",
      domain: "dreamstar.dream",
      status: "live"
    }
  ];

  const coreInfrastructure: Vertical[] = [
    {
      id: "dreamkeeper",
      name: "DreamKeeper",
      description: "Core agent monitoring and management",
      icon: Bot,
      color: "text-electric-cyan",
      bgColor: "bg-electric-cyan/10",
      domain: "dreamkeeper.dream",
      status: "live",
      route: "/dreamkeeper-core"
    },
    {
      id: "deploykeeper",
      name: "DeployKeeper",
      description: "Automated deployment operations",
      icon: Rocket,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      domain: "deploykeeper.dream",
      status: "live"
    },
    {
      id: "mesh",
      name: "Neural Mesh",
      description: "Network connectivity and routing",
      icon: Network,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      domain: "mesh.dream",
      status: "live"
    },
    {
      id: "star-bridge",
      name: "Star Bridge",
      description: "Cross-chain communication layer",
      icon: Sparkles,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      domain: "star-bridge.dream",
      status: "live"
    },
    {
      id: "dream-cloud",
      name: "Dream Cloud",
      description: "Cloud storage and compute",
      icon: Cloud,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      domain: "dream-cloud.dream",
      status: "live",
      route: "/dream-cloud"
    },
    {
      id: "dream-vault",
      name: "Dream Vault",
      description: "Secure vault marketplace",
      icon: Wallet,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      domain: "dream-vault.dream",
      status: "live",
      route: "/vault"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Live</Badge>;
      case "beta":
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Beta</Badge>;
      case "coming-soon":
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/10 via-electric-violet/10 to-transparent" />
        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-electric-cyan to-electric-violet mb-6">
              <Zap className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-electric-cyan to-electric-violet bg-clip-text text-transparent">
              DreamNet Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The complete ecosystem of verticals, agents, and systems. Everything DreamNet in one place.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/hub">
                <Button size="lg" className="bg-electric-cyan text-black hover:bg-electric-cyan/90">
                  Enter Hub
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button size="lg" variant="outline" className="border-electric-violet text-electric-violet hover:bg-electric-violet/10">
                  View Feed
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Core Verticals Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Core Verticals</h2>
          <p className="text-muted-foreground">
            Specialized ecosystems within DreamNet
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coreVerticals.map((vertical) => {
            const Icon = vertical.icon;
            return (
              <Card
                key={vertical.id}
                className="border-border hover:border-electric-cyan/50 transition-all hover:shadow-lg hover:shadow-electric-cyan/10 cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${vertical.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${vertical.color}`} />
                    </div>
                    {getStatusBadge(vertical.status)}
                  </div>
                  <CardTitle className="text-lg">{vertical.name}</CardTitle>
                  <CardDescription className="text-sm mt-2">
                    {vertical.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">{vertical.domain}</span>
                    {vertical.route && (
                      <Link href={vertical.route}>
                        <Button variant="ghost" size="sm" className="h-8">
                          Open
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Core Infrastructure Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Core Infrastructure</h2>
          <p className="text-muted-foreground">
            The backbone systems that power DreamNet
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreInfrastructure.map((infra) => {
            const Icon = infra.icon;
            return (
              <Card
                key={infra.id}
                className="border-border hover:border-electric-violet/50 transition-all hover:shadow-lg hover:shadow-electric-violet/10 cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${infra.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${infra.color}`} />
                    </div>
                    {getStatusBadge(infra.status)}
                  </div>
                  <CardTitle className="text-lg">{infra.name}</CardTitle>
                  <CardDescription className="text-sm mt-2">
                    {infra.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">{infra.domain}</span>
                    {infra.route && (
                      <Link href={infra.route}>
                        <Button variant="ghost" size="sm" className="h-8">
                          Open
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="container mx-auto px-6 py-16">
        <Card className="border-border bg-gradient-to-br from-electric-cyan/5 to-electric-violet/5">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Access</CardTitle>
            <CardDescription>
              Jump to key areas of DreamNet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/hub/grid">
                <Card className="border-border hover:border-electric-cyan/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <Grid3x3 className="w-5 h-5 text-electric-cyan" />
                      <div>
                        <div className="font-medium">Dream Grid</div>
                        <div className="text-sm text-muted-foreground">Explore network</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/hub/apps">
                <Card className="border-border hover:border-electric-violet/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <LayoutGrid className="w-5 h-5 text-electric-violet" />
                      <div>
                        <div className="font-medium">Mini Apps</div>
                        <div className="text-sm text-muted-foreground">Browse apps</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/hub/ops">
                <Card className="border-border hover:border-green-400/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="font-medium">Ops Console</div>
                        <div className="text-sm text-muted-foreground">Monitor system</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/agents">
                <Card className="border-border hover:border-blue-400/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <Bot className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-medium">Agents</div>
                        <div className="text-sm text-muted-foreground">Manage agents</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <Card className="border-border bg-gradient-to-br from-electric-cyan/5 to-electric-violet/5">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to explore DreamNet?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Enter the Hub to access the full DreamNet operator console, dream grid, agent management, and all verticals.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/hub">
                <Button size="lg" className="bg-electric-cyan text-black hover:bg-electric-cyan/90">
                  Enter Hub
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button size="lg" variant="outline" className="border-electric-violet text-electric-violet hover:bg-electric-violet/10">
                  View Dream Feed
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
