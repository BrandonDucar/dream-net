import { useQuery } from '@tanstack/react-query';

interface XPEvent {
  id: string;
  type: string;
  actor: string;
  cloudId: string;
  xpGained: number;
  timestamp: number;
  description: string;
}

interface CloudFeedProps {
  cloudId?: string;
  className?: string;
}

export default function CloudFeed({ cloudId, className = "" }: CloudFeedProps) {
  const { data: xpEvents = [] } = useQuery({
    queryKey: ['/api/cloud/xp-events', cloudId],
    queryFn: async (): Promise<XPEvent[]> => {
      const response = await fetch(`/api/cloud/xp-events${cloudId ? `/${cloudId}` : ''}`);
      return response.json();
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      remix: '🔄',
      revival: '💫',
      bounty: '💰',
      mission: '🎯',
      fusion: '⚡',
      creation: '✨'
    };
    return icons[type] || '📈';
  };

  return (
    <section className={`cloud-feed bg-gray-900 border border-cyan-500 rounded-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">⚡ Cloud Activity Feed</h2>
      
      <ul id="xpEvents" className="space-y-3 max-h-64 overflow-y-auto">
        {xpEvents.length === 0 ? (
          <li className="text-gray-400 text-center py-4">
            No recent activity in this cloud
          </li>
        ) : (
          xpEvents.map((event) => (
            <li 
              key={event.id} 
              className="flex items-center justify-between p-3 bg-black border border-gray-700 rounded-lg hover:border-cyan-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{getEventIcon(event.type)}</span>
                <div>
                  <p className="text-white text-sm">
                    {event.description}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {event.actor} • {formatTimeAgo(event.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-gold-400 font-semibold">
                +{event.xpGained} XP
              </div>
            </li>
          ))
        )}
      </ul>

      {xpEvents.length > 0 && (
        <div className="mt-4 text-center">
          <span className="text-xs text-gray-400">
            Total events: {xpEvents.length} • Last updated: {formatTimeAgo(Math.max(...xpEvents.map(e => e.timestamp)))}
          </span>
        </div>
      )}
    </section>
  );
}