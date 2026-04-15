import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";

interface Prompt {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  priority: number;
}

// Context-based prompts based on current page
const promptsByPath: Record<string, Prompt[]> = {
  "/miniapps/rewards": [
    {
      id: "social",
      title: "Explore the Social Feed",
      description: "See what others are dreaming and remix their creations",
      href: "/miniapps/social",
      priority: 1,
    },
    {
      id: "subscriptions",
      title: "Check out Creator Subscriptions",
      description: "Launch your own subscription plan or subscribe to creators",
      href: "/miniapps/subscriptions",
      priority: 2,
    },
    {
      id: "token",
      title: "Visit Token Hub",
      description: "Learn about DREAM tokenomics and ecosystem",
      href: "/token",
      priority: 3,
    },
  ],
  "/miniapps/subscriptions": [
    {
      id: "rewards",
      title: "Earn DREAM Tokens",
      description: "Claim daily rewards to build your token balance",
      href: "/miniapps/rewards",
      priority: 1,
    },
    {
      id: "social",
      title: "Join the Social Feed",
      description: "Share your dreams and connect with the community",
      href: "/miniapps/social",
      priority: 2,
    },
  ],
  "/miniapps/social": [
    {
      id: "rewards",
      title: "Earn Rewards",
      description: "Claim daily DREAM tokens and compete on leaderboards",
      href: "/miniapps/rewards",
      priority: 1,
    },
    {
      id: "subscriptions",
      title: "Creator Subscriptions",
      description: "Launch your own subscription plan",
      href: "/miniapps/subscriptions",
      priority: 2,
    },
  ],
  "/token": [
    {
      id: "rewards",
      title: "Start Earning DREAM",
      description: "Claim daily rewards to build your token balance",
      href: "/miniapps/rewards",
      priority: 1,
    },
    {
      id: "miniapps",
      title: "Explore Mini Apps",
      description: "Discover all the ways to use your DREAM tokens",
      href: "/miniapps",
      priority: 2,
    },
  ],
  "/miniapps": [
    {
      id: "rewards",
      title: "Start with Rewards",
      description: "Claim your first DREAM tokens",
      href: "/miniapps/rewards",
      priority: 1,
    },
    {
      id: "social",
      title: "Join the Community",
      description: "Explore the social feed and connect with creators",
      href: "/miniapps/social",
      priority: 2,
    },
  ],
  "/": [
    {
      id: "rewards",
      title: "Earn DREAM Tokens",
      description: "Claim daily rewards and compete on leaderboards",
      href: "/miniapps/rewards",
      priority: 1,
    },
    {
      id: "miniapps",
      title: "Explore Mini Apps",
      description: "Discover our ecosystem of autonomous mini apps",
      href: "/miniapps",
      priority: 2,
    },
  ],
};

export function ContextualPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Get current path
    const path = window.location.pathname;
    
    // Find matching prompts
    const pathPrompts = promptsByPath[path] || promptsByPath["/"] || [];
    
    // Filter out dismissed prompts
    const activePrompts = pathPrompts
      .filter((p) => !dismissed.has(p.id))
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 2); // Show max 2 prompts
    
    setPrompts(activePrompts);
    setIsVisible(activePrompts.length > 0);
  }, [window.location.pathname, dismissed]);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const handleDismissAll = () => {
    prompts.forEach((p) => setDismissed((prev) => new Set(prev).add(p.id)));
    setIsVisible(false);
  };

  if (!isVisible || prompts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm space-y-3">
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-xl border border-cyan-500/30 p-4 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-xl"
        >
          <button
            onClick={() => handleDismiss(prompt.id)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white mb-1">{prompt.title}</h3>
              <p className="text-xs text-gray-400 mb-3">{prompt.description}</p>
              <a
                href={prompt.href}
                className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Explore
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      ))}
      
      {prompts.length > 1 && (
        <button
          onClick={handleDismissAll}
          className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
        >
          Dismiss all
        </button>
      )}
    </div>
  );
}

