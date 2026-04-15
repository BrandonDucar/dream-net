import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { Network, Bot, Users, ArrowRight } from 'lucide-react';

export function HeroSection() {
  const { dreamNetMode } = useDreamNetTheme();

  return (
    <section className={`relative min-h-[80vh] flex items-center justify-center overflow-hidden ${
      dreamNetMode ? 'bg-gradient-to-br from-black via-cyan-950/20 to-black' : 'bg-background'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {dreamNetMode && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-cyan/10 rounded-full blur-3xl neural-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-violet/10 rounded-full blur-3xl neural-glow" style={{ animationDelay: '1s' }} />
          </>
        )}
        {/* Neural Mesh Visual */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={dreamNetMode ? '#00ffff' : '#666'} strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Animated nodes */}
            {Array.from({ length: 20 }).map((_, i) => (
              <circle
                key={i}
                cx={50 + (i % 5) * 75}
                cy={50 + Math.floor(i / 5) * 75}
                r="3"
                fill={dreamNetMode ? '#00ffff' : '#999'}
                className={dreamNetMode ? 'neural-glow' : ''}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
          dreamNetMode 
            ? 'bg-gradient-to-r from-electric-cyan via-electric-violet to-electric-cyan bg-clip-text text-transparent' 
            : 'text-foreground'
        }`}>
          DreamNet: A Living Digital Network
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Biomimetic, multi-agent, on-chain intelligence designed to evolve, repair, and build.
        </p>

        {/* Primary Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link href="/os">
            <Button 
              size="lg" 
              className={`${
                dreamNetMode 
                  ? 'bg-electric-cyan text-black hover:bg-electric-cyan/90 shadow-glow' 
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              Enter DreamNet OS
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/agents">
            <Button 
              size="lg" 
              variant={dreamNetMode ? "outline" : "default"}
              className={dreamNetMode ? 'border-electric-cyan text-electric-cyan hover:bg-electric-cyan/10' : ''}
            >
              <Bot className="mr-2 w-5 h-5" />
              Explore Agents
            </Button>
          </Link>
          <Link href="/community">
            <Button 
              size="lg" 
              variant={dreamNetMode ? "outline" : "default"}
              className={dreamNetMode ? 'border-electric-cyan text-electric-cyan hover:bg-electric-cyan/10' : ''}
            >
              <Users className="mr-2 w-5 h-5" />
              View Ecosystem
            </Button>
          </Link>
        </div>

        {/* Quick Pillars */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <PillarCard
            title="OS Core"
            description="Global status, orchestration, and system heartbeat."
            href="/os"
            dreamNetMode={dreamNetMode}
          />
          <PillarCard
            title="Dream Ecosystems"
            description="Vault, Shop, DreamTank — the civilization layer."
            href="/vault"
            dreamNetMode={dreamNetMode}
          />
          <PillarCard
            title="Swarm Intelligence"
            description="Biomimetic agents & fields that adapt and evolve."
            href="/agents"
            dreamNetMode={dreamNetMode}
          />
        </div>
      </div>
    </section>
  );
}

function PillarCard({ 
  title, 
  description, 
  href, 
  dreamNetMode 
}: { 
  title: string; 
  description: string; 
  href: string; 
  dreamNetMode: boolean;
}) {
  return (
    <Link href={href}>
      <div className={`p-6 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
        dreamNetMode 
          ? 'border-electric-cyan/30 bg-electric-cyan/5 hover:border-electric-cyan/50 hover:bg-electric-cyan/10' 
          : 'border-border bg-card hover:border-primary'
      }`}>
        <h3 className={`text-xl font-semibold mb-2 ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

