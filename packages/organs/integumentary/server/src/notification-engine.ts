import { db } from './db.js';
import { notifications, dreams, cocoons } from "@dreamnet/shared/schema";
import type { InsertNotification, Dream, Cocoon } from "@dreamnet/shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

// Placeholder email service
async function sendEmail(to: string, subject: string, content: string): Promise<boolean> {
  console.log(`📧 [EMAIL] To: ${to}`);
  console.log(`📧 [EMAIL] Subject: ${subject}`);
  console.log(`📧 [EMAIL] Content: ${content}`);
  console.log(`📧 [EMAIL] Email sent successfully (placeholder)`);
  
  // In a real implementation, you would integrate with a service like:
  // - SendGrid
  // - Mailgun  
  // - AWS SES
  // - Resend
  // - Nodemailer with SMTP
  
  return true; // Simulate successful email send
}

export class NotificationEngine {
  // Create a new notification and optionally send email
  async createNotification(notification: InsertNotification, sendEmailAlert = true): Promise<string> {
    try {
      // Insert notification into database
      const [createdNotification] = await db
        .insert(notifications)
        .values(notification)
        .returning();

      console.log(`🔔 Created notification: ${notification.type} for ${notification.recipientWallet}`);

      // Send email if enabled
      if (sendEmailAlert) {
        try {
          const emailSent = await this.sendNotificationEmail(createdNotification);
          
          // Update notification with email status
          await db
            .update(notifications)
            .set({ emailSent })
            .where(eq(notifications.id, createdNotification.id));
            
        } catch (emailError) {
          console.error("Failed to send notification email:", emailError);
          // Don't fail the notification creation if email fails
        }
      }

      return createdNotification.id;
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw error;
    }
  }

  // Send email for a notification
  private async sendNotificationEmail(notification: any): Promise<boolean> {
    const subject = `Dream Network: ${notification.title}`;
    const content = `
Hello,

${notification.message}

You can view more details in your Dream Network dashboard.

Best regards,
The Dream Network Team
    `.trim();

    return await sendEmail(notification.recipientWallet, subject, content);
  }

  // Get unread notifications for a wallet
  async getUnreadNotifications(walletAddress: string): Promise<any[]> {
    return await db
      .select()
      .from(notifications)
      .where(and(
        eq(notifications.recipientWallet, walletAddress),
        eq(notifications.isRead, false)
      ))
      .orderBy(desc(notifications.createdAt));
  }

  // Get all notifications for a wallet (with pagination)
  async getNotifications(
    walletAddress: string, 
    limit = 20, 
    offset = 0
  ): Promise<any[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.recipientWallet, walletAddress))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);
  }

  // Mark notification(s) as read
  async markAsRead(notificationIds: string[], walletAddress: string): Promise<void> {
    await db
      .update(notifications)
      .set({ 
        isRead: true, 
        readAt: new Date() 
      })
      .where(and(
        eq(notifications.recipientWallet, walletAddress),
        // Use an IN clause for multiple IDs if supported, otherwise loop
      ));
  }

  // Mark single notification as read
  async markNotificationAsRead(notificationId: string, walletAddress: string): Promise<void> {
    await db
      .update(notifications)
      .set({ 
        isRead: true, 
        readAt: new Date() 
      })
      .where(and(
        eq(notifications.id, notificationId),
        eq(notifications.recipientWallet, walletAddress)
      ));
  }

  // Get notification count for a wallet
  async getUnreadCount(walletAddress: string): Promise<number> {
    const result = await db
      .select({ count: sql`count(*)`.as('count') })
      .from(notifications)
      .where(and(
        eq(notifications.recipientWallet, walletAddress),
        eq(notifications.isRead, false)
      ));
    
    return Number(result[0]?.count || 0);
  }

  // Notification generators for specific events
  async notifyDreamApproved(dream: Dream): Promise<void> {
    await this.createNotification({
      recipientWallet: dream.wallet,
      type: "dream_approved",
      title: "Dream Approved! 🎉",
      message: `Your dream "${dream.title}" has been approved and is ready for transformation into a cocoon.`,
      data: {
        dreamId: dream.id,
        dreamTitle: dream.title,
        approvedAt: new Date().toISOString()
      }
    });
  }

  async notifyCocoonCreated(cocoon: Cocoon, dream: Dream): Promise<void> {
    await this.createNotification({
      recipientWallet: cocoon.creatorWallet,
      type: "cocoon_created",
      title: "Your Dream Became a Cocoon! 🛡️",
      message: `Your dream "${dream.title}" has evolved into a cocoon and is beginning its transformation journey.`,
      data: {
        cocoonId: cocoon.id,
        dreamId: dream.id,
        cocoonTitle: cocoon.title,
        stage: cocoon.stage,
        createdAt: cocoon.createdAt
      }
    });
  }

  async notifyCocoonStageUpdated(cocoon: Cocoon, oldStage: string, newStage: string): Promise<void> {
    const stageEmojis = {
      seedling: "🌱",
      incubating: "🐣", 
      metamorphosis: "🦋",
      emergence: "✨",
      hatched: "🎭"
    };

    await this.createNotification({
      recipientWallet: cocoon.creatorWallet,
      type: "cocoon_stage_updated",
      title: `Cocoon Evolution: ${newStage} ${stageEmojis[newStage as keyof typeof stageEmojis] || "🔄"}`,
      message: `Your cocoon "${cocoon.title}" has evolved from ${oldStage} to ${newStage}. The transformation continues!`,
      data: {
        cocoonId: cocoon.id,
        cocoonTitle: cocoon.title,
        oldStage,
        newStage,
        updatedAt: new Date().toISOString()
      }
    });
  }

  async notifyContributorAdded(cocoonId: string, contributorWallet: string, role: string, cocoonTitle: string): Promise<void> {
    await this.createNotification({
      recipientWallet: contributorWallet,
      type: "contributor_added",
      title: `Welcome to the Team! 🤝`,
      message: `You've been added as a ${role} to the cocoon "${cocoonTitle}". Start collaborating on this amazing project!`,
      data: {
        cocoonId,
        cocoonTitle,
        role,
        addedAt: new Date().toISOString()
      }
    });
  }

  async notifyContributorRemoved(cocoonId: string, contributorWallet: string, role: string, cocoonTitle: string): Promise<void> {
    await this.createNotification({
      recipientWallet: contributorWallet,
      type: "contributor_removed",
      title: "Role Update",
      message: `Your ${role} role has been removed from the cocoon "${cocoonTitle}".`,
      data: {
        cocoonId,
        cocoonTitle,
        role,
        removedAt: new Date().toISOString()
      }
    });
  }

  async notifyDreamScoreUpdated(dream: Dream, oldScore: number, newScore: number): Promise<void> {
    const scoreDiff = newScore - oldScore;
    const isImprovement = scoreDiff > 0;
    
    await this.createNotification({
      recipientWallet: dream.wallet,
      type: "dream_score_updated",
      title: `Dream Score ${isImprovement ? 'Increased' : 'Updated'} ${isImprovement ? '📈' : '📊'}`,
      message: `Your dream "${dream.title}" score changed from ${oldScore} to ${newScore} (${scoreDiff > 0 ? '+' : ''}${scoreDiff} points).`,
      data: {
        dreamId: dream.id,
        dreamTitle: dream.title,
        oldScore,
        newScore,
        scoreDiff,
        updatedAt: new Date().toISOString()
      }
    });
  }

  // New notification methods for additional features
  async notifyInsufficientScore(cocoon: Cocoon): Promise<void> {
    await this.createNotification({
      recipientWallet: cocoon.creatorWallet,
      type: "cocoon_score_insufficient",
      title: "Score Boost Needed! 🎯",
      message: `Your cocoon "${cocoon.title}" needs a score of 60+ to progress to Active stage. Current score: ${cocoon.dreamScore || 0}. Consider adding contributors or building more traction!`,
      data: {
        cocoonId: cocoon.id,
        cocoonTitle: cocoon.title,
        currentScore: cocoon.dreamScore || 0,
        requiredScore: 60,
        notifiedAt: new Date().toISOString()
      }
    });
  }

  async notifyNFTMinted(cocoon: Cocoon, nftData: any): Promise<void> {
    await this.createNotification({
      recipientWallet: cocoon.creatorWallet,
      type: "nft_minted",
      title: "NFT Minted Successfully! 🎨✨",
      message: `Congratulations! Your high-scoring cocoon "${cocoon.title}" has been minted as an NFT. Token ID: ${nftData.tokenId}`,
      data: {
        cocoonId: cocoon.id,
        cocoonTitle: cocoon.title,
        nftData,
        mintedAt: new Date().toISOString()
      }
    });
  }

  async notifyCocoonArchived(cocoon: Cocoon): Promise<void> {
    await this.createNotification({
      recipientWallet: cocoon.creatorWallet,
      type: "cocoon_archived",
      title: "Cocoon Archived Due to Inactivity 📦",
      message: `Your cocoon "${cocoon.title}" has been archived due to inactivity. You can contact support to restore it if needed.`,
      data: {
        cocoonId: cocoon.id,
        cocoonTitle: cocoon.title,
        archivedAt: new Date().toISOString()
      }
    });
  }
}

// Export singleton instance
export const notificationEngine = new NotificationEngine();