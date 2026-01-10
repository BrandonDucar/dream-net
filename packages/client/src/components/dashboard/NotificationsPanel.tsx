import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Bell, CheckCircle, Clock, Webhook } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: string;
  recipientWallet: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function NotificationsPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications', refreshKey],
    queryFn: async () => {
      const response = await fetch('/api/notifications?wallet=0x742d35Cc6ab7C0532f3C671e5dfFCFa040e5A9C2');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json();
    },
    retry: 1,
    staleTime: 30000,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'webhook_test': return Webhook;
      case 'token_minted': return CheckCircle;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'webhook_test': return 'bg-blue-500/20 text-blue-400';
      case 'token_minted': return 'bg-yellow-500/20 text-yellow-400';
      case 'cocoon_stage_change': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-neutral-400">System notifications and alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <Badge className="bg-electric-cyan text-black">
              {unreadCount} unread
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={() => setRefreshKey(prev => prev + 1)}
            disabled={isLoading}
            className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Webhook Test Section */}
      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Webhook className="w-5 h-5 mr-2" />
            Webhook Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-neutral-400 text-sm">
            Test webhook notifications for Discord and Telegram integrations.
          </p>
          <Button
            onClick={async () => {
              try {
                await fetch('/api/webhooks/test', { 
                  method: 'POST',
                  headers: { 'x-wallet-address': 'demo-admin' }
                });
                setRefreshKey(prev => prev + 1);
              } catch (error) {
                console.error('Webhook test failed:', error);
              }
            }}
            className="bg-electric-cyan text-black hover:bg-electric-cyan/90"
          >
            <Webhook className="w-4 h-4 mr-2" />
            Test Webhooks
          </Button>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-neutral-400 py-8">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-neutral-400 py-8">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No notifications yet
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = getTypeIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      notification.read 
                        ? 'bg-neutral-900/50' 
                        : 'bg-electric-cyan/10 border border-electric-cyan/30'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-white">{notification.message}</p>
                        {!notification.read && (
                          <Badge className="bg-electric-cyan text-black text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getTypeColor(notification.type)}>
                          {notification.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-neutral-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {notification.recipientWallet && (
                        <p className="text-xs text-neutral-500 font-mono mt-1">
                          To: {notification.recipientWallet.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-white">Webhook Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-neutral-400 text-sm">
            Configure webhook endpoints using environment variables:
          </p>
          <div className="bg-neutral-900/50 p-3 rounded font-mono text-xs text-neutral-300">
            <div>DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...</div>
            <div>TELEGRAM_BOT_TOKEN=your_bot_token</div>
            <div>TELEGRAM_CHAT_ID=your_chat_id</div>
          </div>
          <p className="text-xs text-neutral-500">
            Webhooks automatically trigger when cocoons reach 'Active' stage.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}