import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'patent' | 'dream' | 'agent' | 'revenue' | 'personal';
  priority?: 'critical' | 'high' | 'medium' | 'low';
  read: boolean;
  source?: string;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
  readAt?: string;
}

// In-memory storage (replace with database in production)
let notifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Patent Applications Ready',
    message: '10 biomimetic swarm patents are ready for USPTO submission with $280M+ estimated value',
    type: 'patent',
    priority: 'critical',
    read: false,
    source: 'PatentApplicatorAgent',
    actionUrl: '/patents',
    actionLabel: 'View Patents',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'notif-2',
    title: 'Dream Network Optimal',
    message: 'Dream network lucidity at 80%+ - perfect conditions for seed planting across all categories',
    type: 'dream',
    priority: 'high',
    read: false,
    source: 'DreamNetwork',
    actionUrl: '/dream-seeds',
    actionLabel: 'Plant Seeds',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: 'notif-3',
    title: 'Biometric Optimization Complete',
    message: 'Performance optimization reached 92% efficiency with synchronized nano-agent cycles',
    type: 'system',
    priority: 'medium',
    read: false,
    source: 'BiometricScheduler',
    actionUrl: '/biometric',
    actionLabel: 'View Stats',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 'notif-4',
    title: 'Agent Recovery Complete',
    message: 'Successfully reconnected 15 offline agents - system health restored to optimal levels',
    type: 'agent',
    priority: 'medium',
    read: true,
    source: 'ConnectorAgent',
    actionUrl: '/agent-control',
    actionLabel: 'View Agents',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    readAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-5',
    title: 'Revenue Opportunity Identified',
    message: '$200M+ market opportunity ready for monetization through IP licensing and service offerings',
    type: 'revenue',
    priority: 'high',
    read: false,
    source: 'BusinessIntelligence',
    actionUrl: '/business-intelligence',
    actionLabel: 'View Analysis',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  }
];

// Get all notifications
router.get('/', (req: Request, res: Response) => {
  try {
    // Sort by created date (newest first) and then by read status (unread first)
    const sortedNotifications = [...notifications].sort((a, b) => {
      // First sort by read status (unread first)
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      // Then sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json({
      success: true,
      notifications: sortedNotifications,
      stats: {
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        critical: notifications.filter(n => n.priority === 'critical' && !n.read).length,
        byType: {
          system: notifications.filter(n => n.type === 'system').length,
          patent: notifications.filter(n => n.type === 'patent').length,
          dream: notifications.filter(n => n.type === 'dream').length,
          agent: notifications.filter(n => n.type === 'agent').length,
          revenue: notifications.filter(n => n.type === 'revenue').length,
          personal: notifications.filter(n => n.type === 'personal').length,
        }
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

// Mark notification as read
router.put('/:id/read', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const notificationIndex = notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    notifications[notificationIndex] = {
      ...notifications[notificationIndex],
      read: true,
      readAt: new Date().toISOString()
    };

    res.json({
      success: true,
      notification: notifications[notificationIndex],
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read'
    });
  }
});

// Mark all notifications as read
router.put('/read-all', (req: Request, res: Response) => {
  try {
    const now = new Date().toISOString();
    
    notifications = notifications.map(notification => ({
      ...notification,
      read: true,
      readAt: notification.readAt || now
    }));

    res.json({
      success: true,
      message: 'All notifications marked as read',
      count: notifications.length
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read'
    });
  }
});

// Add new notification (for system use)
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      title,
      message,
      type = 'system',
      priority = 'medium',
      source,
      actionUrl,
      actionLabel
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }

    const newNotification: Notification = {
      id: uuidv4(),
      title,
      message,
      type,
      priority,
      read: false,
      source,
      actionUrl,
      actionLabel,
      createdAt: new Date().toISOString()
    };

    notifications.unshift(newNotification); // Add to beginning of array

    res.json({
      success: true,
      notification: newNotification,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification'
    });
  }
});

// Delete notification
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notificationIndex = notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    notifications.splice(notificationIndex, 1);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification'
    });
  }
});

export default router;