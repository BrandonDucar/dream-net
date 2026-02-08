import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gamepad2, Flower2, MessageSquare } from 'lucide-react';

const mockPosts = [
  { id: '1', author: 'user:founder', text: 'Welcome to DreamNet. This is our living organism on Base.', tags: ['intro', 'dreamnet'] },
  { id: '2', author: 'system:dreamnet', text: 'Tier IV subsystems online: Vault, Shop, Zen Garden, DreamBet, Dream Tank, Liquidity, Civic Panel.', tags: ['system', 'status'] },
];

export default function CommunityPage() {
  const { dreamNetMode } = useDreamNetTheme();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            dreamNetMode ? 'text-electric-cyan' : 'text-foreground'
          }`}>
            Community
          </h1>
          <p className="text-xl text-muted-foreground">
            DreamBet, Zen Garden, and Social Hub — the community layer of DreamNet
          </p>
        </div>

        {/* DreamBet Section */}
        <section className="mb-12">
          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-black/50 mb-6' : 'mb-6'}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Gamepad2 className={`w-6 h-6 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
                <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                  DreamBet
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Fair, agent-audited games: poker tables, Angel Slots, and more.
              </CardDescription>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${
                  dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : 'border-border bg-card'
                }`}>
                  <h3 className="font-semibold mb-2">Poker Table</h3>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </div>
                <div className={`p-4 rounded-lg border ${
                  dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : 'border-border bg-card'
                }`}>
                  <h3 className="font-semibold mb-2">Angel Slots</h3>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Zen Garden Section */}
        <section className="mb-12">
          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-black/50 mb-6' : 'mb-6'}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Flower2 className={`w-6 h-6 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
                <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                  Zen Garden
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Rituals for wellness: meditation, walks, classes → earn Zen Points and future rewards.
              </CardDescription>
              <div className={`p-4 rounded-lg border ${
                dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : 'border-border bg-card'
              }`}>
                <h3 className="font-semibold mb-2">Sample Session</h3>
                <p className="text-sm text-muted-foreground mb-2">Meditation - 30 minutes</p>
                <p className="text-xs text-muted-foreground">Reward: 30 Zen Points</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Social Hub Section */}
        <section>
          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-black/50' : ''}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageSquare className={`w-6 h-6 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
                <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                  Social Hub
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                DreamNet's internal feed and narrative stream.
              </CardDescription>
              <div className="space-y-4">
                {mockPosts.map((post) => (
                  <div 
                    key={post.id}
                    className={`p-4 rounded-lg border ${
                      dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{post.author}</span>
                    </div>
                    <p className="text-sm mb-2">{post.text}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span 
                          key={tag}
                          className={`text-xs px-2 py-1 rounded ${
                            dreamNetMode 
                              ? 'bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}

