import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { FeedPanel } from './FeedPanel';
import { NetworkGraph } from './NetworkGraph';
import { NotificationsPanel } from './NotificationsPanel';

export default function DreamDashboard() {
  const [view, setView] = useState('feed');
  
  return (
    <div className="flex h-screen bg-neutral-900 text-white">
      <Sidebar setView={setView} />
      <main className="flex-1 p-4 overflow-auto">
        {view === 'feed' && <FeedPanel />}
        {view === 'graph' && <NetworkGraph />}
        {view === 'notifications' && <NotificationsPanel />}

      </main>
    </div>
  );
}