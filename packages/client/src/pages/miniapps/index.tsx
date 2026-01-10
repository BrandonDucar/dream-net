/**
 * Mini Apps Directory
 * Browse and launch Base mini apps
 */

import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MINI_APPS, getMiniAppsByCategory } from '@/miniapps/registry';
import { Badge } from '@/components/ui/badge';
import { Wallet, Coins, Users, Gamepad2, Wrench, Sparkles } from 'lucide-react';

const categoryIcons = {
  defi: Coins,
  nft: Sparkles,
  social: Users,
  gaming: Gamepad2,
  utility: Wrench,
  other: Sparkles,
};

const categoryColors = {
  defi: 'bg-blue-500/10 text-blue-500',
  nft: 'bg-purple-500/10 text-purple-500',
  social: 'bg-green-500/10 text-green-500',
  gaming: 'bg-orange-500/10 text-orange-500',
  utility: 'bg-gray-500/10 text-gray-500',
  other: 'bg-pink-500/10 text-pink-500',
};

export default function MiniAppsIndex() {
  const [apps, setApps] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const categories = ['analysis', 'monitoring', 'management', 'utility', 'defi', 'social', 'gaming', 'nft', 'other'] as const;

  React.useEffect(() => {
    const loadApps = async () => {
      try {
        const { fetchMiniApps } = await import('@/miniapps/registry');
        const data = await fetchMiniApps();
        setApps(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Loading DreamHub...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">DreamHub Mini Apps</h1>
          <p className="text-muted-foreground text-lg">
            Discover and launch autonomous agent capabilities
          </p>
        </div>

        {categories.map((category) => {
          const categoryApps = apps.filter(app => app.category === category);
          if (categoryApps.length === 0) return null;

          const Icon = categoryIcons[category as keyof typeof categoryIcons] || Sparkles;

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <h2 className="text-2xl font-semibold capitalize">{category}</h2>
                <Badge variant="secondary">{categoryApps.length}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryApps.map((app) => (
                  <Link key={app.id} href={app.route}>
                    <Card className="hover:border-electric-cyan transition-colors cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{app.name}</CardTitle>
                          {app.requiresWallet && (
                            <Wallet className="w-4 h-4 text-muted-foreground" />
                          )}
                          {app.agentId && (
                            <Badge variant="outline" className="text-xs border-electric-cyan text-electric-cyan">Agent</Badge>
                          )}
                        </div>
                        <CardDescription>{app.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge className={categoryColors[category as keyof typeof categoryColors] || 'bg-gray-500/10 text-gray-500'}>
                            {category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">v{app.version}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {apps.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No mini apps available yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


