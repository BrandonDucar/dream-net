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
exports.adminRoutes = void 0;
var express_1 = require("express");
var router = express_1.default.Router();
exports.adminRoutes = router;
// Mock client monitoring data for admin spy agent
var mockClientSessions = [
    {
        id: 'session_eric_001',
        userId: 'eric_metals',
        username: 'Eric Rodriguez',
        email: 'eric@metalsmint.com',
        currentPage: '/ai-seo/campaigns',
        ipAddress: '67.149.123.45',
        userAgent: 'Chrome/120.0.0 (Windows NT 10.0; Win64; x64)',
        sessionStart: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 30 * 1000).toISOString(),
        actionsCount: 23,
        dataAccessed: ['customer_data', 'seo_campaigns', 'analytics', 'keyword_research'],
        riskLevel: 'low',
        isActive: true,
        location: 'Jupiter, FL',
        device: 'Desktop',
        timeOnSite: 180
    },
    {
        id: 'session_sutton_001',
        userId: 'sutton_creative',
        username: 'Sutton',
        email: 'sutton@flutterbye.nest',
        currentPage: '/flutterbye/dashboard',
        ipAddress: '198.51.100.22',
        userAgent: 'Safari/17.0 (Macintosh; Intel Mac OS X 10_15_7)',
        sessionStart: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 45 * 1000).toISOString(),
        actionsCount: 156,
        dataAccessed: ['creative_projects', 'user_profiles', 'messaging', 'design_assets'],
        riskLevel: 'medium',
        isActive: true,
        location: 'Creative Studio',
        device: 'MacBook Pro',
        timeOnSite: 1920
    },
    {
        id: 'session_dan_001',
        userId: 'dan_tutorial',
        username: 'Dan Thompson',
        email: 'dan@dreamnet.tutorials',
        currentPage: '/tutorials/advanced',
        ipAddress: '203.0.113.88',
        userAgent: 'Firefox/121.0 (X11; Linux x86_64)',
        sessionStart: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 15 * 1000).toISOString(),
        actionsCount: 89,
        dataAccessed: ['tutorial_content', 'user_progress', 'system_logs', 'documentation'],
        riskLevel: 'low',
        isActive: true,
        location: 'Tutorial Labs',
        device: 'Linux Workstation',
        timeOnSite: 6300
    }
];
var mockDataAccess = [
    {
        id: 'access_001',
        timestamp: new Date(Date.now() - 30 * 1000).toISOString(),
        userId: 'eric_metals',
        username: 'Eric Rodriguez',
        action: 'READ',
        resource: '/api/seo/campaigns/precious-metals',
        details: 'Accessed SEO campaign data for gold/silver keywords',
        sensitive: false,
        success: true,
        duration: 1240
    },
    {
        id: 'access_002',
        timestamp: new Date(Date.now() - 45 * 1000).toISOString(),
        userId: 'sutton_creative',
        username: 'Sutton',
        action: 'CREATE',
        resource: '/api/flutterbye/messages',
        details: 'Created new creative project message thread',
        sensitive: true,
        success: true,
        duration: 850
    },
    {
        id: 'access_003',
        timestamp: new Date(Date.now() - 15 * 1000).toISOString(),
        userId: 'dan_tutorial',
        username: 'Dan Thompson',
        action: 'READ',
        resource: '/api/tutorials/system-architecture',
        details: 'Accessed DreamNet architecture documentation',
        sensitive: false,
        success: true,
        duration: 2100
    },
    {
        id: 'access_004',
        timestamp: new Date(Date.now() - 75 * 1000).toISOString(),
        userId: 'eric_metals',
        username: 'Eric Rodriguez',
        action: 'UPDATE',
        resource: '/api/seo/keywords/gold-investment',
        details: 'Updated gold investment keyword targeting',
        sensitive: true,
        success: true,
        duration: 1850
    },
    {
        id: 'access_005',
        timestamp: new Date(Date.now() - 90 * 1000).toISOString(),
        userId: 'sutton_creative',
        username: 'Sutton',
        action: 'READ',
        resource: '/api/flutterbye/analytics',
        details: 'Viewed creative project performance analytics',
        sensitive: false,
        success: true,
        duration: 960
    }
];
// Get client monitoring data for admin spy
router.get('/client-monitoring', function (req, res) {
    try {
        // Update last activity for active sessions
        var updatedSessions = mockClientSessions.map(function (session) { return (__assign(__assign({}, session), { lastActivity: session.isActive ? new Date(Date.now() - Math.random() * 60 * 1000).toISOString() : session.lastActivity, actionsCount: session.isActive ? session.actionsCount + Math.floor(Math.random() * 3) : session.actionsCount })); });
        // Add new recent data access entries
        var recentAccess = __spreadArray([], mockDataAccess, true).map(function (access) { return (__assign(__assign({}, access), { timestamp: new Date(Date.now() - Math.random() * 300 * 1000).toISOString() })); });
        res.json({
            success: true,
            sessions: updatedSessions,
            dataAccess: recentAccess.slice(0, 10), // Last 10 entries
            statistics: {
                totalActiveSessions: updatedSessions.filter(function (s) { return s.isActive; }).length,
                totalDataAccess: recentAccess.length,
                highRiskSessions: updatedSessions.filter(function (s) { return s.riskLevel === 'high'; }).length,
                mediumRiskSessions: updatedSessions.filter(function (s) { return s.riskLevel === 'medium'; }).length,
                lowRiskSessions: updatedSessions.filter(function (s) { return s.riskLevel === 'low'; }).length
            }
        });
    }
    catch (error) {
        console.error('Admin monitoring error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch client monitoring data'
        });
    }
});
// Get specific client details
router.get('/client/:userId', function (req, res) {
    try {
        var userId_1 = req.params.userId;
        var session = mockClientSessions.find(function (s) { return s.userId === userId_1; });
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Client session not found'
            });
        }
        var clientDataAccess = mockDataAccess
            .filter(function (access) { return access.userId === userId_1; })
            .slice(0, 20);
        res.json({
            success: true,
            session: session,
            dataAccess: clientDataAccess,
            riskAssessment: {
                level: session.riskLevel,
                factors: session.riskLevel === 'medium'
                    ? ['High data access volume', 'Creative assets access']
                    : ['Normal usage patterns', 'Standard data access']
            }
        });
    }
    catch (error) {
        console.error('Client details error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch client details'
        });
    }
});
// Eric's AI-SEO readiness assessment
router.get('/eric-readiness', function (req, res) {
    try {
        var ericReadiness = {
            overallReadiness: 95,
            businessReadiness: {
                score: 100,
                factors: [
                    { name: 'Business Model', status: 'ready', details: '7-figure precious metals company established' },
                    { name: 'Target Market', status: 'ready', details: 'Clear precious metals customer base' },
                    { name: 'Revenue Goals', status: 'ready', details: 'Replace expensive PPC campaigns' },
                    { name: 'Location', status: 'ready', details: 'Jupiter, FL - established business location' }
                ]
            },
            technicalReadiness: {
                score: 92,
                factors: [
                    { name: 'Platform Integration', status: 'ready', details: 'AI-SEO platform fully integrated' },
                    { name: 'Admin Access', status: 'ready', details: 'Secure admin dashboard with monitoring' },
                    { name: 'Data Analytics', status: 'ready', details: 'Comprehensive tracking and reporting' },
                    { name: 'Content System', status: 'ready', details: 'AI-optimized content generation active' }
                ]
            },
            contentReadiness: {
                score: 88,
                factors: [
                    { name: 'Keyword Strategy', status: 'ready', details: 'Precious metals keywords mapped' },
                    { name: 'Content Templates', status: 'ready', details: 'Industry-specific templates created' },
                    { name: 'SEO Optimization', status: 'in-progress', details: 'Fine-tuning local Jupiter, FL targeting' },
                    { name: 'Competitor Analysis', status: 'ready', details: 'PPC competitor intelligence gathered' }
                ]
            },
            recommendations: [
                'Begin with low-competition precious metals keywords',
                'Monitor PPC cost savings vs AI-SEO performance',
                'Focus on local Jupiter, FL market first',
                'Set up weekly performance reviews',
                'Prepare backup PPC campaigns for peak seasons'
            ],
            nextSteps: [
                'Review admin dashboard and monitoring tools',
                'Approve initial keyword targeting strategy',
                'Set monthly AI-SEO budget vs PPC savings goals',
                'Schedule weekly optimization calls',
                'Launch first 10 AI-optimized content pieces'
            ]
        };
        res.json({
            success: true,
            readiness: ericReadiness,
            recommendation: ericReadiness.overallReadiness >= 90
                ? 'Eric is READY to start using the AI-SEO platform immediately'
                : 'Eric needs additional preparation before launch',
            launchDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
        });
    }
    catch (error) {
        console.error('Eric readiness assessment error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to assess Eric readiness'
        });
    }
});
