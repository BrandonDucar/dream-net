/**
 * Agent Marketplace Component
 * Displays all 64 Active GPT agents with search and filter capabilities
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Search, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';

interface GPTAgent {
  name: string;
  category: string;
  purpose: string;
  status: 'Active' | 'Draft';
  link: string | null;
}

export function AgentMarketplace() {
  const { dreamNetMode } = useDreamNetTheme();
  const [agents, setAgents] = useState<GPTAgent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<GPTAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('/api/gpt-agents');
        if (response.ok) {
          const data = await response.json();
          if (data.ok && data.agents) {
            const activeAgents = data.agents.filter((a: GPTAgent) => a.status === 'Active');
            setAgents(activeAgents);
            setFilteredAgents(activeAgents);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to registry.json
        const registryResponse = await fetch('/registry.json');
        if (registryResponse.ok) {
          const registryData = await registryResponse.json();
          const activeAgents = registryData.filter((a: GPTAgent) => a.status === 'Active');
          setAgents(activeAgents);
          setFilteredAgents(activeAgents);
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    let filtered = agents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((agent) => agent.category === selectedCategory);
    }

    setFilteredAgents(filtered);
  }, [searchQuery, selectedCategory, agents]);

  const categories = Array.from(new Set(agents.map((a) => a.category))).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-electric-cyan" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search agents by name, purpose, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? dreamNetMode
                  ? 'bg-electric-cyan text-black'
                  : 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All ({agents.length})
          </button>
          {categories.map((category) => {
            const count = agents.filter((a) => a.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? dreamNetMode
                      ? 'bg-electric-cyan text-black'
                      : 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAgents.length} of {agents.length} agents
        </p>
      </div>

      {/* Agent Grid */}
      {filteredAgents.length === 0 ? (
        <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No agents found matching your criteria</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <Card
              key={agent.name}
              className={`transition-all hover:scale-[1.02] ${
                dreamNetMode
                  ? 'border-electric-cyan/30 bg-electric-cyan/5 hover:border-electric-cyan/50'
                  : 'hover:border-primary/50'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        dreamNetMode ? 'bg-electric-cyan/20 text-electric-cyan' : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{agent.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`mt-1 text-xs ${
                          dreamNetMode
                            ? 'border-electric-cyan/30 text-electric-cyan'
                            : ''
                        }`}
                      >
                        {agent.category}
                      </Badge>
                    </div>
                  </div>
                  {agent.link && (
                    <a
                      href={agent.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-electric-cyan hover:text-electric-cyan/80"
                    >
                      <Sparkles className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3">{agent.purpose}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

