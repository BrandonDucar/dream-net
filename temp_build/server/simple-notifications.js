"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleNotifications = exports.SimpleNotificationService = void 0;
// In-memory notifications array
var notifications = [];
var SimpleNotificationService = /** @class */ (function () {
    function SimpleNotificationService() {
    }
    // Add a new notification
    SimpleNotificationService.prototype.addNotification = function (recipientWallet, type, message) {
        var notification = {
            id: Math.random().toString(36).substr(2, 9),
            recipientWallet: recipientWallet,
            type: type,
            message: message,
            timestamp: new Date(),
            read: false
        };
        notifications.push(notification);
        // Simulate delivery with console log
        console.log("\uD83D\uDCEC NOTIFICATION DELIVERED:");
        console.log("   To: ".concat(recipientWallet.slice(0, 8), "..."));
        console.log("   Type: ".concat(type));
        console.log("   Message: ".concat(message));
        console.log("   Time: ".concat(notification.timestamp.toISOString()));
        console.log("   ID: ".concat(notification.id));
        return notification.id;
    };
    // Get notifications for a specific wallet
    SimpleNotificationService.prototype.getNotifications = function (walletAddress, limit) {
        if (limit === void 0) { limit = 20; }
        return notifications
            .filter(function (n) { return n.recipientWallet === walletAddress; })
            .sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); })
            .slice(0, limit);
    };
    // Get unread count for a wallet
    SimpleNotificationService.prototype.getUnreadCount = function (walletAddress) {
        return notifications.filter(function (n) {
            return n.recipientWallet === walletAddress && !n.read;
        }).length;
    };
    // Mark notification as read
    SimpleNotificationService.prototype.markAsRead = function (notificationId) {
        var notification = notifications.find(function (n) { return n.id === notificationId; });
        if (notification) {
            notification.read = true;
            console.log("\u2705 Notification ".concat(notificationId, " marked as read"));
            return true;
        }
        return false;
    };
    // Mark all notifications as read for a wallet
    SimpleNotificationService.prototype.markAllAsRead = function (walletAddress) {
        var userNotifications = notifications.filter(function (n) {
            return n.recipientWallet === walletAddress && !n.read;
        });
        userNotifications.forEach(function (n) { return n.read = true; });
        console.log("\u2705 Marked ".concat(userNotifications.length, " notifications as read for ").concat(walletAddress.slice(0, 8), "..."));
        return userNotifications.length;
    };
    // Get all notifications (for admin)
    SimpleNotificationService.prototype.getAllNotifications = function (limit) {
        if (limit === void 0) { limit = 100; }
        return notifications
            .sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); })
            .slice(0, limit);
    };
    // Clear old notifications (older than 30 days)
    SimpleNotificationService.prototype.clearOldNotifications = function () {
        var thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        var initialCount = notifications.length;
        notifications = notifications.filter(function (n) { return n.timestamp > thirtyDaysAgo; });
        var removedCount = initialCount - notifications.length;
        if (removedCount > 0) {
            console.log("\uD83D\uDDD1\uFE0F  Cleared ".concat(removedCount, " old notifications"));
        }
        return removedCount;
    };
    // Notification helpers for specific events
    SimpleNotificationService.prototype.notifyCocoonStageChange = function (creatorWallet, cocoonTitle, oldStage, newStage) {
        var stageEmojis = {
            seedling: "🌱",
            incubating: "🥚",
            active: "🔥",
            metamorphosis: "🦋",
            emergence: "✨",
            complete: "🎯",
            archived: "📦"
        };
        var emoji = stageEmojis[newStage] || "🔄";
        this.addNotification(creatorWallet, "stage_change", "Your cocoon \"".concat(cocoonTitle, "\" evolved from ").concat(oldStage, " to ").concat(newStage, " ").concat(emoji));
    };
    SimpleNotificationService.prototype.notifyNFTMinted = function (creatorWallet, cocoonTitle, tokenId) {
        this.addNotification(creatorWallet, "nft_minted", "\uD83C\uDFA8 Congratulations! Your cocoon \"".concat(cocoonTitle, "\" has been minted as NFT #").concat(tokenId));
    };
    SimpleNotificationService.prototype.notifyContributorAdded = function (contributorWallet, cocoonTitle, role) {
        this.addNotification(contributorWallet, "contributor_added", "\uD83E\uDD1D You've been added as ".concat(role, " to cocoon \"").concat(cocoonTitle, "\""));
    };
    SimpleNotificationService.prototype.notifyScoreInsufficientForProgression = function (creatorWallet, cocoonTitle, currentScore) {
        this.addNotification(creatorWallet, "score_insufficient", "\u26A1 Your cocoon \"".concat(cocoonTitle, "\" needs score 60+ to progress (current: ").concat(currentScore, "). Add contributors or build traction!"));
    };
    return SimpleNotificationService;
}());
exports.SimpleNotificationService = SimpleNotificationService;
// Export singleton instance
exports.simpleNotifications = new SimpleNotificationService();
