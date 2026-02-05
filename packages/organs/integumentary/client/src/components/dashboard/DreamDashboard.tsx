import { useState } from 'react';
import { HeatMapper } from './HeatMapper';
import { SovereignGallery } from './SovereignGallery';
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

        <div className="mt-12 bg-black/30 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
          <HeatMapper />
        </div>
        <div className="mt-6">
          <SovereignGallery />
        </div>
      </main>
    </div>
  );
}