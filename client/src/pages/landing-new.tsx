import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Grid3x3, Cloud, Bot, ArrowRight } from "lucide-react";

export default function LandingNew() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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

          <Card className="border-border hover:border-electric-cyan/50 transition-colors">
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
            <Link href="/hub">
              <Button size="lg" className="bg-electric-cyan text-black hover:bg-electric-cyan/90">
                Enter Hub
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

