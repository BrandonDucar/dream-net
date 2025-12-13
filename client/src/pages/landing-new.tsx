import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Grid3x3, Cloud, Bot, ArrowRight, Shield } from "lucide-react";
import { GuardianStatus } from "@/components/GuardianStatus";

export default function LandingNew() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-electric-cyan" />
              <span className="text-xl font-semibold">DreamNet</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/hub" className="text-muted-foreground hover:text-foreground transition-colors">
                Hub
              </Link>
              <a href="/miniapps" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-electric-cyan transition-colors font-medium border-b-2 border-electric-cyan">
                Mini Apps
              </a>
              <Link href="/agents" className="text-muted-foreground hover:text-foreground transition-colors">
                Agents
              </Link>
            </nav>
            <a href="/miniapps" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-electric-cyan/50 hover:bg-electric-cyan/10">
                <Zap className="w-4 h-4 mr-2" />
                Browse Apps
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/10 via-electric-violet/10 to-transparent" />
        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-electric-cyan to-electric-violet mb-6">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              DreamNet
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              An autonomous agent network for managing dreams, nodes, and the
              collective imagination.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/hub">
                <Button size="lg" className="bg-electric-cyan text-black hover:bg-electric-cyan/90">
                  Enter Hub
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Apps Section - Prominent */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Mini Apps</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Discover 59+ mini applications built on DreamNet
            </p>
            <a href="/miniapps" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-electric-cyan text-black hover:bg-electric-cyan/90">
                Browse All Mini Apps
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/miniapps/token-balance">
              <Card className="border-border hover:border-electric-cyan/50 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-electric-cyan" />
                    <h4 className="font-semibold text-sm">Token Balance</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">View your token balances</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/miniapps/simple-swap">
              <Card className="border-border hover:border-electric-cyan/50 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-electric-cyan" />
                    <h4 className="font-semibold text-sm">Simple Swap</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">Transfer tokens on Base</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/miniapps/subscription-hub">
              <Card className="border-border hover:border-electric-cyan/50 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-electric-cyan" />
                    <h4 className="font-semibold text-sm">Subscription Hub</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">Launch subscription tiers</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border hover:border-electric-cyan/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-electric-cyan/10 text-electric-cyan">
                  <Grid3x3 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Dream Grid</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore all dreams and nodes in the network
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-electric-cyan/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-electric-violet/10 text-electric-violet">
                  <Cloud className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">DreamClouds</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Multi-chain integrations and protocols
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-electric-cyan/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-green-400/10 text-green-400">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Agents</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Autonomous agents for system operations
              </p>
            </CardContent>
          </Card>

          <a href="/miniapps" target="_blank" rel="noopener noreferrer">
            <Card className="border-border hover:border-electric-cyan/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold">Mini-Apps</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Access to all DreamNet mini-applications
                </p>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>

      {/* Guardian Framework Status */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-electric-cyan" />
            <h2 className="text-3xl font-bold">Guardian Framework</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            3-layer defense system protecting DreamNet with 64 personal agent drones, shield layers, and strategic command cluster.
          </p>
          <GuardianStatus />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <Card className="border-border bg-gradient-to-br from-electric-cyan/5 to-electric-violet/5">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to explore DreamNet?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Enter the Hub to access the full DreamNet operator console, dream grid, agent management, and more.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/hub">
                <Button size="lg" className="bg-electric-cyan text-black hover:bg-electric-cyan/90">
                  Enter Hub
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="/miniapps" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-electric-cyan/50 hover:bg-electric-cyan/10">
                  Browse Mini Apps
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <Link href="/agents">
                <Button size="lg" variant="outline" className="border-electric-cyan/50 hover:bg-electric-cyan/10">
                  Browse Agents
                  <Bot className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

