import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  LayoutDashboard, 
  Grid3x3, 
  Cloud, 
  LayoutGrid, 
  Wallet, 
  Bot, 
  Settings,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import mockDreams from "@/data/mockDreams";

interface CommandAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  category: "navigation" | "search";
  keywords?: string[];
}

const navigationActions: CommandAction[] = [
  {
    id: "hub",
    label: "Go to Hub",
    icon: LayoutDashboard,
    href: "/hub",
    category: "navigation",
  },
  {
    id: "grid",
    label: "Go to Grid",
    icon: Grid3x3,
    href: "/hub/grid",
    category: "navigation",
  },
  {
    id: "ops",
    label: "Go to Ops",
    icon: Settings,
    href: "/hub/ops",
    category: "navigation",
  },
  {
    id: "apps",
    label: "Go to Apps",
    icon: LayoutGrid,
    href: "/hub/apps",
    category: "navigation",
  },
  {
    id: "clouds",
    label: "Go to Clouds",
    icon: Cloud,
    href: "/hub/clouds",
    category: "navigation",
  },
  {
    id: "wallets",
    label: "Go to Wallets",
    icon: Wallet,
    href: "/hub/wallets",
    category: "navigation",
  },
  {
    id: "agents",
    label: "Go to Agents",
    icon: Bot,
    href: "/hub/agents",
    category: "navigation",
  },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Create search actions from dreams
  const dreamActions: CommandAction[] = mockDreams.slice(0, 10).map((dream) => ({
    id: `dream-${dream.dreamId}`,
    label: dream.dreamId,
    icon: Zap,
    href: `/hub/grid?dream=${dream.dreamId}`,
    category: "search",
    keywords: [dream.dreamId, "dream", "node"],
  }));

  const allActions = [...navigationActions, ...dreamActions];

  const filteredActions = allActions.filter((action) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      action.label.toLowerCase().includes(query) ||
      action.keywords?.some((kw) => kw.toLowerCase().includes(query))
    );
  });

  const handleSelect = (action: CommandAction) => {
    setLocation(action.href);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-2xl">
          <Command className="rounded-lg border-none">
            <CommandInput
              placeholder="Type a command or search..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                {filteredActions
                  .filter((a) => a.category === "navigation")
                  .map((action) => {
                    const Icon = action.icon;
                    return (
                      <CommandItem
                        key={action.id}
                        onSelect={() => handleSelect(action)}
                        className="cursor-pointer"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{action.label}</span>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
              {filteredActions.filter((a) => a.category === "search").length > 0 && (
                <CommandGroup heading="Dreams & Nodes">
                  {filteredActions
                    .filter((a) => a.category === "search")
                    .map((action) => {
                      const Icon = action.icon;
                      return (
                        <CommandItem
                          key={action.id}
                          onSelect={() => handleSelect(action)}
                          className="cursor-pointer"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{action.label}</span>
                        </CommandItem>
                      );
                    })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
          <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
                <span>to open</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

