"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHealthRoutes = registerHealthRoutes;
function registerHealthRoutes(app) {
    // System health endpoint
    app.get('/api/system/health', function (req, res) {
        var healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                database: 'connected',
                messaging: {
                    telegram: !!process.env.TELEGRAM_BOT_TOKEN ? 'configured' : 'missing',
                    sms: !!(process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) ? 'configured' : 'missing',
                    slack: !!(process.env.SLACK_BOT_TOKEN || process.env.SLACK_TEST_API_KEY) ? 'configured' : 'missing'
                },
                payments: !!process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing',
                dreamNetwork: 'active',
                agents: 'running'
            },
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: '2.0.0'
        };
        res.json(healthStatus);
    });
    // Ready endpoint for deployment
    app.get('/api/ready', function (req, res) {
        res.json({
            ready: true,
            timestamp: new Date().toISOString(),
            services: 'operational'
        });
    });
    // Live endpoint for Kubernetes/Docker
    app.get('/api/live', function (req, res) {
        res.json({
            alive: true,
            timestamp: new Date().toISOString()
        });
    });
}
