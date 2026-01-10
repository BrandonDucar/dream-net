/**
 * Simple Notifications System
 * 
 * In-memory array to store notification objects with:
 * - recipientWallet
 * - type 
 * - message
 * - timestamp
 * - read (boolean)
 */

interface SimpleNotification {
  id: string;
  recipientWallet: string;
  type: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// In-memory notifications array
let notifications: SimpleNotification[] = [];

export class SimpleNotificationService {
  
  // Add a new notification
  addNotification(recipientWallet: string, type: string, message: string): string {
    const notification: SimpleNotification = {
      id: Math.random().toString(36).substr(2, 9),
      recipientWallet,
      type,
      message,
      timestamp: new Date(),
      read: false
    };

    notifications.push(notification);
    
    // Simulate delivery with console log
    console.log(`📬 NOTIFICATION DELIVERED:`);
    console.log(`   To: ${recipientWallet.slice(0, 8)}...`);
    console.log(`   Type: ${type}`);
    console.log(`   Message: ${message}`);
    console.log(`   Time: ${notification.timestamp.toISOString()}`);
    console.log(`   ID: ${notification.id}`);

    return notification.id;
  }

  // Get notifications for a specific wallet
  getNotifications(walletAddress: string, limit = 20): SimpleNotification[] {
    return notifications
      .filter(n => n.recipientWallet === walletAddress)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Get unread count for a wallet
  getUnreadCount(walletAddress: string): number {
    return notifications.filter(n => 
      n.recipientWallet === walletAddress && !n.read
    ).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): boolean {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      console.log(`✅ Notification ${notificationId} marked as read`);
      return true;
    }
    return false;
  }

  // Mark all notifications as read for a wallet
  markAllAsRead(walletAddress: string): number {
    const userNotifications = notifications.filter(n => 
      n.recipientWallet === walletAddress && !n.read
    );
    
    userNotifications.forEach(n => n.read = true);
    
    console.log(`✅ Marked ${userNotifications.length} notifications as read for ${walletAddress.slice(0, 8)}...`);
    return userNotifications.length;
  }

  // Get all notifications (for admin)
  getAllNotifications(limit = 100): SimpleNotification[] {
    return notifications
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Clear old notifications (older than 30 days)
  clearOldNotifications(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const initialCount = notifications.length;
    notifications = notifications.filter(n => n.timestamp > thirtyDaysAgo);
    const removedCount = initialCount - notifications.length;
    
    if (removedCount > 0) {
      console.log(`🗑️  Cleared ${removedCount} old notifications`);
    }
    
    return removedCount;
  }

  // Notification helpers for specific events
  notifyCocoonStageChange(creatorWallet: string, cocoonTitle: string, oldStage: string, newStage: string): void {
    const stageEmojis: Record<string, string> = {
      seedling: "🌱",
      incubating: "🥚", 
      active: "🔥",
      metamorphosis: "🦋",
      emergence: "✨",
      complete: "🎯",
      archived: "📦"
    };

    const emoji = stageEmojis[newStage] || "🔄";
    
    this.addNotification(
      creatorWallet,
      "stage_change",
      `Your cocoon "${cocoonTitle}" evolved from ${oldStage} to ${newStage} ${emoji}`
    );
  }

  notifyNFTMinted(creatorWallet: string, cocoonTitle: string, tokenId: number): void {
    this.addNotification(
      creatorWallet,
      "nft_minted",
      `🎨 Congratulations! Your cocoon "${cocoonTitle}" has been minted as NFT #${tokenId}`
    );
  }

  notifyContributorAdded(contributorWallet: string, cocoonTitle: string, role: string): void {
    this.addNotification(
      contributorWallet,
      "contributor_added",
      `🤝 You've been added as ${role} to cocoon "${cocoonTitle}"`
    );
  }

  notifyScoreInsufficientForProgression(creatorWallet: string, cocoonTitle: string, currentScore: number): void {
    this.addNotification(
      creatorWallet,
      "score_insufficient", 
      `⚡ Your cocoon "${cocoonTitle}" needs score 60+ to progress (current: ${currentScore}). Add contributors or build traction!`
    );
  }
}

// Export singleton instance
export const simpleNotifications = new SimpleNotificationService();