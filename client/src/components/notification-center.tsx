import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, BellRing, CheckCheck, Clock, Mail, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  recipientWallet: string;
  type: string;
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  emailSent: boolean;
  createdAt: string;
  readAt?: string;
}

interface NotificationCenterProps {
  walletAddress: string;
}

function getNotificationIcon(type: string) {
  const icons = {
    dream_approved: "🎉",
    cocoon_created: "🛡️",
    cocoon_stage_updated: "🔄",
    contributor_added: "🤝",
    contributor_removed: "👋",
    dream_score_updated: "📊",
  };
  return icons[type as keyof typeof icons] || "🔔";
}

function getNotificationColor(type: string, isRead: boolean) {
  if (isRead) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
  
  const colors = {
    dream_approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cocoon_created: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    cocoon_stage_updated: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    contributor_added: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    contributor_removed: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    dream_score_updated: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
}

export function NotificationCenter({ walletAddress }: NotificationCenterProps) {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);

  // Query for unread notifications count
  const { data: unreadCount = { count: 0 } } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/count"],
    queryFn: async () => {
      const response = await fetch("/api/notifications/count", {
        headers: { 'x-wallet-address': walletAddress }
      });
      if (!response.ok) throw new Error('Failed to fetch notification count');
      return response.json();
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Query for all notifications
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notifications", {
        headers: { 'x-wallet-address': walletAddress }
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    },
    enabled: showDialog, // Only fetch when dialog is open
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'x-wallet-address': walletAddress }
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/count"] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      const response = await fetch("/api/notifications/mark-all-read", {
        method: 'PATCH',
        headers: { 
          'x-wallet-address': walletAddress,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds: unreadIds })
      });
      if (!response.ok) throw new Error('Failed to mark all notifications as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/count"] });
      toast({
        title: "All notifications marked as read",
        description: "Your notification center has been cleared",
      });
    },
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount.count > 0 ? (
            <BellRing className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
          {unreadCount.count > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount.count > 99 ? '99+' : unreadCount.count}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </DialogTitle>
              <DialogDescription>
                Stay updated with your dream journey
              </DialogDescription>
            </div>
            {unreadNotifications.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm">We'll notify you when something exciting happens!</p>
          </div>
        ) : (
          <Tabs defaultValue="unread" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unread" className="flex items-center gap-2">
                <BellRing className="w-4 h-4" />
                Unread ({unreadNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                All ({notifications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unread" className="mt-4">
              <div className="h-96 overflow-y-auto">
                {unreadNotifications.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <CheckCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>All caught up!</p>
                    <p className="text-sm">No unread notifications</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {unreadNotifications.map((notification) => (
                      <Card key={notification.id} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {getNotificationIcon(notification.type)}
                              </span>
                              <div>
                                <CardTitle className="text-sm">{notification.title}</CardTitle>
                                <CardDescription className="text-xs">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getNotificationColor(notification.type, false)}>
                                {notification.type.replace('_', ' ')}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                disabled={markAsReadMutation.isPending}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          {notification.emailSent && (
                            <div className="flex items-center gap-1 mt-2">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Email sent</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              <div className="h-96 overflow-y-auto">
                <div className="space-y-3">
                  {notifications.map((notification: Notification) => (
                    <Card key={notification.id} className={`${notification.isRead ? 'opacity-75' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div>
                              <CardTitle className="text-sm flex items-center gap-2">
                                {notification.title}
                                {notification.isRead && (
                                  <CheckCheck className="w-3 h-3 text-green-500" />
                                )}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                {notification.isRead && notification.readAt && (
                                  <span className="ml-2">
                                    • Read {formatDistanceToNow(new Date(notification.readAt), { addSuffix: true })}
                                  </span>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={getNotificationColor(notification.type, notification.isRead)}>
                            {notification.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        {notification.emailSent && (
                          <div className="flex items-center gap-1 mt-2">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Email sent</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}