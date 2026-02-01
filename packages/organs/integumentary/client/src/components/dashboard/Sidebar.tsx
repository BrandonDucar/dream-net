interface SidebarProps {
  setView: (view: string) => void;
}

export function Sidebar({ setView }: SidebarProps) {
  return (
    <nav className="w-64 bg-zinc-800 p-4 space-y-2">
      <button 
        className="w-full text-left hover:bg-zinc-700 p-2 rounded" 
        onClick={() => setView('feed')}
      >
        🌱 Garden Feed
      </button>
      <button 
        className="w-full text-left hover:bg-zinc-700 p-2 rounded" 
        onClick={() => setView('graph')}
      >
        🌐 Network Graph
      </button>
      <button 
        className="w-full text-left hover:bg-zinc-700 p-2 rounded" 
        onClick={() => setView('notifications')}
      >
        🔔 Notifications
      </button>
    </nav>
  );
}