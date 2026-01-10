"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var uuid_1 = require("uuid");
var router = (0, express_1.Router)();
// In-memory storage (replace with database in production)
var notifications = [
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
router.get('/', function (req, res) {
    try {
        // Sort by created date (newest first) and then by read status (unread first)
        var sortedNotifications = __spreadArray([], notifications, true).sort(function (a, b) {
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
                unread: notifications.filter(function (n) { return !n.read; }).length,
                critical: notifications.filter(function (n) { return n.priority === 'critical' && !n.read; }).length,
                byType: {
                    system: notifications.filter(function (n) { return n.type === 'system'; }).length,
                    patent: notifications.filter(function (n) { return n.type === 'patent'; }).length,
                    dream: notifications.filter(function (n) { return n.type === 'dream'; }).length,
                    agent: notifications.filter(function (n) { return n.type === 'agent'; }).length,
                    revenue: notifications.filter(function (n) { return n.type === 'revenue'; }).length,
                    personal: notifications.filter(function (n) { return n.type === 'personal'; }).length,
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications'
        });
    }
});
// Mark notification as read
router.put('/:id/read', function (req, res) {
    try {
        var id_1 = req.params.id;
        var notificationIndex = notifications.findIndex(function (n) { return n.id === id_1; });
        if (notificationIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found'
            });
        }
        notifications[notificationIndex] = __assign(__assign({}, notifications[notificationIndex]), { read: true, readAt: new Date().toISOString() });
        res.json({
            success: true,
            notification: notifications[notificationIndex],
            message: 'Notification marked as read'
        });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mark notification as read'
        });
    }
});
// Mark all notifications as read
router.put('/read-all', function (req, res) {
    try {
        var now_1 = new Date().toISOString();
        notifications = notifications.map(function (notification) { return (__assign(__assign({}, notification), { read: true, readAt: notification.readAt || now_1 })); });
        res.json({
            success: true,
            message: 'All notifications marked as read',
            count: notifications.length
        });
    }
    catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mark all notifications as read'
        });
    }
});
// Add new notification (for system use)
router.post('/', function (req, res) {
    try {
        var _a = req.body, title = _a.title, message = _a.message, _b = _a.type, type = _b === void 0 ? 'system' : _b, _c = _a.priority, priority = _c === void 0 ? 'medium' : _c, source = _a.source, actionUrl = _a.actionUrl, actionLabel = _a.actionLabel;
        if (!title || !message) {
            return res.status(400).json({
                success: false,
                error: 'Title and message are required'
            });
        }
        var newNotification = {
            id: (0, uuid_1.v4)(),
            title: title,
            message: message,
            type: type,
            priority: priority,
            read: false,
            source: source,
            actionUrl: actionUrl,
            actionLabel: actionLabel,
            createdAt: new Date().toISOString()
        };
        notifications.unshift(newNotification); // Add to beginning of array
        res.json({
            success: true,
            notification: newNotification,
            message: 'Notification created successfully'
        });
    }
    catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create notification'
        });
    }
});
// Delete notification
router.delete('/:id', function (req, res) {
    try {
        var id_2 = req.params.id;
        var notificationIndex = notifications.findIndex(function (n) { return n.id === id_2; });
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
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete notification'
        });
    }
});
exports.default = router;
